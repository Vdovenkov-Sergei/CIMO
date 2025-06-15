import time
from app.constants import RedisKeys
from app.database import redis_client


class MovieCacheManager:
    MAX_RECENTLY_SEEN: int = 250  # Maximum number of recently seen movies per user

    @staticmethod
    def __key(user_id: int) -> str:
        return RedisKeys.USER_RECENTLY_SEEN_KEY.format(user_id=user_id)

    @classmethod
    async def add(cls, user_id: int, movie_id: int) -> None:
        key = cls.__key(user_id)
        await redis_client.zadd(key, {str(movie_id): time.time()})
        await redis_client.zremrangebyrank(key, 0, -cls.MAX_RECENTLY_SEEN - 1)

    @classmethod
    async def get(cls, user_id: int) -> set[int]:
        key = cls.__key(user_id)
        return set(map(int, await redis_client.zrange(key, 0, -1)))

    @classmethod
    async def clear(cls, user_id: int) -> None:
        await redis_client.delete(cls.__key(user_id))