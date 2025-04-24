from typing import Sequence

from app.dao.base import BaseDAO
from app.database import Base
from app.messages.models import Message


class MessageDAO(BaseDAO):
    model = Message

    @classmethod
    async def get_messages(cls, *, chat_id: int, limit: int, offset: int) -> Sequence[Base]:
        return await cls.find_all(
            filters=[cls.model.chat_id == chat_id], order_by=[cls.model.created_at.desc()], limit=limit, offset=offset
        )
