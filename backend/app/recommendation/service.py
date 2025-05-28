import random
from typing import Optional
import uuid
import numpy as np
import json
from pathlib import Path
import math

from app.recommendation.index import FaissIndex, faiss_index
from app.constants import RedisKeys
from app.database import redis_client


BASE_DIR = Path(__file__).parent.parent
ONBOARDING_FILE_PATH = BASE_DIR / "data" / "onboarding.json"
POPULAR_MOVIES_FILE_PATH = BASE_DIR / "data" / "popular.json"


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
        user_likes_key = RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user_id)
        user_swipes_key = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session_id, user_id=user_id)
        user_vector_key = RedisKeys.USER_VECTOR_KEY.format(user_id=user_id)
        norm_key = RedisKeys.USER_VECTOR_NORM_KEY.format(user_id=user_id)

        user_vector_bytes = await redis_client.get(user_vector_key)
        norm_bytes = await redis_client.get(norm_key)
        user_swipes = await redis_client.get(user_swipes_key)
        user_likes = await redis_client.get(user_likes_key)

        await redis_client.set(user_swipes_key, (int(user_swipes) + 1) % self.SWIPES_ITER)
        if user_vector_bytes:
            u_old = np.frombuffer(user_vector_bytes, dtype=np.float32)
        else:
            u_old = np.zeros(self.faiss_index.index.d, dtype=np.float32)
        Z_old = float(norm_bytes) if norm_bytes else 0.0
        v = self.faiss_index.index.reconstruct(movie_id)
        w = math.log(1 + time_swiped)
        if is_liked:
            u_new = (Z_old * u_old + w * v) / (Z_old + w)
            Z_new = Z_old + w
            await redis_client.set(user_likes_key, (int(user_likes) + 1) % self.LIKES_ITER)
        else:
            penalized = self.BETA * w
            u_new = (Z_old * u_old - penalized * v) / (Z_old + penalized)
            Z_new = Z_old + penalized
        await redis_client.set(user_vector_key, u_new.astype(np.float32).tobytes())
        await redis_client.set(norm_key, str(Z_new))

    async def get_recommendation(
        self, session_id: uuid.UUID, user_id: int, is_pair: bool = False, is_onboarding: bool = False
    ) -> int:
        if is_onboarding:
            return await self.get_onboarding_recommendation(session_id, user_id)
        else:
            if is_pair:
                movie_id = await self.get_pair_recommendation(session_id, user_id)
                if movie_id == -1:
                    return await self.get_user_recommendation(user_id)
                return movie_id
            else:
                return await self.get_user_recommendation(user_id)

    async def get_onboarding_recommendation(self, session_id: uuid.UUID, user_id: int) -> int:
        onboard_list_key = RedisKeys.USER_ONBOARDING_LIST.format(session_id=session_id, user_id=user_id)
        onboard_list = None
        raw_onboard_list = await redis_client.get(onboard_list_key)
        if raw_onboard_list is None:
            onboard_list = recommender.generate_onboarding_list()
        else:
            onboard_list = json.loads(raw_onboard_list)

        if not onboard_list:
            await redis_client.delete(onboard_list_key)
            # No more movies in the onboarding list
            return -1
        movie_id = onboard_list.pop()
        await redis_client.set(onboard_list_key, json.dumps(onboard_list))
        return movie_id

    async def get_user_recommendation(self, user_id: int) -> int:
        random_movie = self.get_popular_movie_with_prob()
        if random_movie is not None:
            return random_movie
        user_vector_key = RedisKeys.USER_VECTOR_KEY.format(user_id=user_id)
        user_vector_bytes = await redis_client.get(user_vector_key)

        if user_vector_bytes:
            user_vector = np.frombuffer(user_vector_bytes, dtype=np.float32)
        else:
            user_vector = np.zeros(self.faiss_index.index.d, dtype=np.float32)
        return int(np.random.choice(self.faiss_index.search(user_vector)))

    async def get_pair_recommendation(self, session_id: uuid.UUID, user_id: int) -> int:
        user_swipes_key = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session_id, user_id=user_id)
        swipes = await redis_client.get(user_swipes_key)
        if not swipes or int(swipes) != self.SWIPES_ITER - 1:
            return -1

        pair_key = RedisKeys.SESSION_PAIR_REC_KEY.format(session_id=session_id)
        existing = await redis_client.get(pair_key)
        if existing:
            movie_str, recommender_id_str = existing.split(":")
            recommender_id = int(recommender_id_str)
            if recommender_id != user_id:
                return int(movie_str)

        users_key = RedisKeys.SESSION_USERS_KEY.format(session_id=session_id)
        users = await redis_client.smembers(users_key)
        user1, user2 = [int(user_id) for user_id in users]

        u1_bytes = await redis_client.get(RedisKeys.USER_VECTOR_KEY.format(user_id=user1))
        u2_bytes = await redis_client.get(RedisKeys.USER_VECTOR_KEY.format(user_id=user2))
        if u1_bytes:
            u1 = np.frombuffer(u1_bytes, dtype=np.float32)
        else:
            u1 = np.zeros(self.faiss_index.index.d, dtype=np.float32)
        if u2_bytes:
            u2 = np.frombuffer(u2_bytes, dtype=np.float32)
        else:
            u2 = np.zeros(self.faiss_index.index.d, dtype=np.float32)

        likes1 = await redis_client.get(RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user1))
        likes2 = await redis_client.get(RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user2))
        C1 = int(likes1) if likes1 else 1
        C2 = int(likes2) if likes2 else 1

        alpha = C1 / (C1 + C2)
        u_pair = alpha * u1 + (1 - alpha) * u2
        movie_id = int(np.random.choice(self.faiss_index.search(u_pair)))
        await redis_client.set(pair_key, f"{movie_id}:{user_id}")
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
            return random.choice(self.popular_movies)
        return None


recommender = RecommendationService(faiss_index=faiss_index)
