import uuid

from app.constants import RedisKeys
from app.database import redis_client
from app.logger import logger


class RedisSessionService:
    @staticmethod
    async def clear_session_keys(session_id: uuid.UUID) -> None:
        pattern = RedisKeys.SESSION_KEY.format(session_id=session_id)
        cursor, count = 0, 0
        while True:
            cursor, keys = await redis_client.scan(cursor=cursor, match=pattern)
            if keys:
                count += len(keys)
                await redis_client.delete(*keys)
            if cursor == 0:
                break

        if count > 0:
            logger.info("Cleared session keys.", extra={"session_id": session_id, "count": count})
        else:
            logger.warning("No session keys to clear.", extra={"session_id": session_id})
