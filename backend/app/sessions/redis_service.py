import uuid

from app.constants import RedisKeys
from app.database import redis_client
from app.logger import logger


class RedisSessionService:
    @staticmethod
    async def clear_session_keys(session_id: uuid.UUID, user_id: int) -> None:
        user_session_pattern_key = RedisKeys.PATTERN_USER_SESSION_KEY.format(session_id=session_id, user_id=user_id)
        await RedisSessionService.clear_keys_by_pattern(user_session_pattern_key)

        session_users_key = RedisKeys.SESSION_USERS_KEY.format(session_id=session_id)
        await redis_client.srem(session_users_key, str(user_id))
        users_left = await redis_client.scard(session_users_key)
        if users_left == 0:
            session_pattern_key = RedisKeys.PATTERN_SESSION_KEY.format(session_id=session_id)
            await RedisSessionService.clear_keys_by_pattern(session_pattern_key)

    @staticmethod
    async def clear_keys_by_pattern(pattern: str) -> None:
        cursor, count = 0, 0
        while True:
            cursor, keys = await redis_client.scan(cursor=cursor, match=pattern)
            if keys:
                count += len(keys)
                await redis_client.delete(*keys)
            if cursor == 0:
                break

        if count > 0:
            logger.info("Cleared keys by pattern.", extra={"pattern": pattern, "count": count})
        else:
            logger.warning("No keys found for the given pattern.", extra={"pattern": pattern})
