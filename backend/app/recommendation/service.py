import json
import math
import random
import uuid
from pathlib import Path
from typing import Optional

import numpy as np
import numpy.typing as npt

from app.constants import RedisKeys
from app.database import redis_bin_client, redis_client
from app.logger import logger
from app.recommendation.index import FaissIndex, faiss_index

BASE_DIR = Path(__file__).parent.parent
ONBOARDING_FILE_PATH = BASE_DIR / "data" / "recommender" / "onboarding.json"
POPULAR_MOVIES_FILE_PATH = BASE_DIR / "data" / "recommender" / "popular.json"


class RecommendationService:
    PROBABILITY: float = 0.1  # Probability of returning a popular movie
    BETA: float = 0.05  # Punishment for not liking a movie
    SWIPES_ITER: int = 5  # Number of iterations for pair recommendations
    LIKES_ITER: int = 10  # Number of iterations for likes in pair recommendations

    def __init__(self, *, faiss_index: FaissIndex) -> None:
        self.faiss_index = faiss_index
        with open(ONBOARDING_FILE_PATH, "r", encoding="utf-8") as file:
            self.onboarding_data = json.load(file)
        with open(POPULAR_MOVIES_FILE_PATH, "r", encoding="utf-8") as file:
            self.popular_movies = json.load(file)

    async def update_user_vector(
        self, session_id: uuid.UUID, user_id: int, movie_id: int, time_swiped: int, is_liked: bool = False
    ) -> None:

        logger.info(
            "Updating user vector.",
            extra={"user_id": user_id, "session_id": str(session_id), "movie_id": movie_id, "is_liked": is_liked},
        )
        user_likes_key = RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user_id)
        user_swipes_key = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session_id, user_id=user_id)
        user_vector_key = RedisKeys.USER_VECTOR_KEY.format(user_id=user_id)
        norm_key = RedisKeys.USER_VECTOR_NORM_KEY.format(user_id=user_id)

        user_vector_bytes = await redis_bin_client.get(user_vector_key)
        norm_koef = await redis_client.get(norm_key)
        user_swipes = await redis_client.get(user_swipes_key)
        user_likes = await redis_client.get(user_likes_key)

        await redis_client.set(user_swipes_key, (int(user_swipes) + 1) % self.SWIPES_ITER)
        u_old = self.load_or_default(user_vector_bytes, self.faiss_index.index.d)
        Z_old = float(norm_koef) if norm_koef else 0.0
        v = self.faiss_index.index.reconstruct(movie_id).reshape(1, -1)
        w = math.log(1 + time_swiped)
        if is_liked:
            u_new = (Z_old * u_old + w * v) / (Z_old + w)
            Z_new = Z_old + w
            await redis_client.set(user_likes_key, (int(user_likes) + 1) % self.LIKES_ITER)
        else:
            penalized = self.BETA * w
            u_new = (Z_old * u_old - penalized * v) / (Z_old + penalized)
            Z_new = Z_old + penalized

        await redis_bin_client.set(user_vector_key, u_new.tobytes())
        await redis_client.set(norm_key, str(Z_new))
        logger.debug("Successfully updated user vector.", extra={"user_id": user_id})

    async def get_recommendation(
        self, session_id: uuid.UUID, user_id: int, is_pair: bool = False, is_onboarding: bool = False
    ) -> int:
        logger.info(
            "Generating recommendation.",
            extra={
                "session_id": str(session_id),
                "user_id": user_id,
                "is_pair": is_pair,
                "is_onboarding": is_onboarding,
            },
        )
        if is_onboarding:
            logger.debug("Onboarding recommendation selected.", extra={"user_id": user_id})
            return await self.get_onboarding_recommendation(session_id, user_id)
        else:
            if is_pair:
                logger.debug("Pair recommendation selected.", extra={"user_id": user_id})
                movie_id = await self.get_pair_recommendation(session_id, user_id)
                if movie_id == -1:
                    logger.debug("Pair recommendation fallback to user recommendation.", extra={"user_id": user_id})
                    return await self.get_user_recommendation(user_id)
                return movie_id
            else:
                logger.debug("Single user recommendation selected.", extra={"user_id": user_id})
                return await self.get_user_recommendation(user_id)

    async def get_onboarding_recommendation(self, session_id: uuid.UUID, user_id: int) -> int:
        onboard_list_key = RedisKeys.USER_ONBOARDING_LIST.format(session_id=session_id, user_id=user_id)
        onboard_list = None
        logger.debug("Fetching onboarding list.", extra={"session_id": str(session_id), "user_id": user_id})

        raw_onboard_list = await redis_client.get(onboard_list_key)
        if raw_onboard_list is None:
            onboard_list = recommender.generate_onboarding_list()
            logger.debug(
                "Generated new onboarding list.",
                extra={"session_id": str(session_id), "user_id": user_id, "length": len(onboard_list)},
            )
        else:
            onboard_list = json.loads(raw_onboard_list)
            logger.debug(
                "Loaded existing onboarding list.",
                extra={"session_id": str(session_id), "user_id": user_id, "length": len(onboard_list)},  # type: ignore
            )

        if not onboard_list:
            await redis_client.delete(onboard_list_key)
            logger.warning("Onboarding list exhausted.", extra={"session_id": str(session_id), "user_id": user_id})
            return -1
        movie_id = onboard_list.pop()
        await redis_client.set(onboard_list_key, json.dumps(onboard_list))
        logger.info(
            "Successfully fetched onboarding recommendation.",
            extra={"session_id": str(session_id), "user_id": user_id, "movie_id": movie_id},
        )
        return movie_id

    async def get_user_recommendation(self, user_id: int) -> int:
        random_movie = self.get_popular_movie_with_prob()
        if random_movie is not None:
            logger.info("Returned popular movie by probability.", extra={"user_id": user_id, "movie_id": random_movie})
            return random_movie
        user_vector_key = RedisKeys.USER_VECTOR_KEY.format(user_id=user_id)
        user_vector_bytes = await redis_bin_client.get(user_vector_key)
        user_vector = self.load_or_default(user_vector_bytes, self.faiss_index.index.d)
        movie_id = int(np.random.choice(self.faiss_index.search(user_vector)))
        logger.info("Successfully fetched user recommendation.", extra={"user_id": user_id, "movie_id": movie_id})
        return movie_id

    async def get_pair_recommendation(self, session_id: uuid.UUID, user_id: int) -> int:
        user_swipes_key = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session_id, user_id=user_id)
        swipes = await redis_client.get(user_swipes_key)
        if not swipes or int(swipes) != self.SWIPES_ITER - 1:
            logger.debug(
                "Not enough swipes yet for pair recommendation.",
                extra={"session_id": str(session_id), "user_id": user_id, "swipes": swipes},
            )
            return -1

        pair_key = RedisKeys.SESSION_PAIR_REC_KEY.format(session_id=session_id)
        existing = await redis_client.get(pair_key)
        if existing:
            movie_str, recommender_id_str = existing.split(":")
            recommender_id = int(recommender_id_str)
            if recommender_id != user_id:
                logger.info(
                    "Returning cached pair recommendation.",
                    extra={"session_id": str(session_id), "user_id": user_id, "movie_id": int(movie_str)},
                )
                return int(movie_str)

        users_key = RedisKeys.SESSION_USERS_KEY.format(session_id=session_id)
        users = await redis_client.smembers(users_key)
        user1, user2 = [int(user_id) for user_id in users]

        u1_bytes = await redis_bin_client.get(RedisKeys.USER_VECTOR_KEY.format(user_id=user1))
        u2_bytes = await redis_bin_client.get(RedisKeys.USER_VECTOR_KEY.format(user_id=user2))
        u1 = self.load_or_default(u1_bytes, self.faiss_index.index.d)
        u2 = self.load_or_default(u2_bytes, self.faiss_index.index.d)

        likes1 = await redis_client.get(RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user1))
        likes2 = await redis_client.get(RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user2))
        C1 = int(likes1) if likes1 else 1
        C2 = int(likes2) if likes2 else 1

        alpha = C1 / (C1 + C2)
        u_pair = (alpha * u1 + (1 - alpha) * u2).astype(np.float32)
        movie_id = int(np.random.choice(self.faiss_index.search(u_pair)))
        await redis_client.set(pair_key, f"{movie_id}:{user_id}")
        logger.info(
            "Successfully fetched pair recommendation.",
            extra={"session_id": str(session_id), "user_id": user_id, "movie_id": movie_id, "alpha": alpha},
        )
        return movie_id

    def generate_onboarding_list(self) -> list[int]:
        onboard_list = []
        for movie_ids in self.onboarding_data.values():
            k = random.choices([1, 2], weights=[0.8, 0.2])[0]
            onboard_list.extend(random.sample(movie_ids, k))
        random.shuffle(onboard_list)
        return onboard_list

    def get_popular_movie_with_prob(self) -> Optional[int]:
        if random.random() < self.PROBABILITY and self.popular_movies:
            return int(random.choice(self.popular_movies))
        return None

    def load_or_default(self, vector_bytes: Optional[bytes], dim: int) -> npt.NDArray[np.float32]:
        if vector_bytes:
            return np.frombuffer(vector_bytes, dtype=np.float32).reshape(1, -1)
        return np.zeros((1, dim), dtype=np.float32)


recommender = RecommendationService(faiss_index=faiss_index)
