from datetime import timedelta
from redis import asyncio as aioredis
from typing import Optional

from app.config import settings


class RedisClient:
    def __init__(self):
        self.redis = None

    async def connect(self):
        if not self.redis:
            self.redis = await aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)

    async def close(self):
        if self.redis:
            await self.redis.close()

    async def get(self, key: str) -> Optional[str]:
        return await self.redis.get(key)

    async def setex(self, key: str, time: int | timedelta, value: str) -> bool:
        return await self.redis.setex(key, time, value)


redis_client = RedisClient()
