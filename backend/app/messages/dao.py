from typing import Sequence

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_add, log_db_find_all
from app.messages.models import Message, SenderType


class MessageDAO(BaseDAO):
    model = Message

    @classmethod
    @log_db_find_all("Fetch messages")
    async def get_messages(cls, *, chat_id: int, limit: int, offset: int) -> Sequence[Message]:
        return await cls.find_all(
            filters=[cls.model.chat_id == chat_id],
            order_by=[cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )

    @classmethod
    @log_db_add("Add message")
    async def add_message(cls, *, chat_id: int, sender: SenderType, content: str) -> Message:
        return await cls.add_record(chat_id=chat_id, sender=sender, content=content)
