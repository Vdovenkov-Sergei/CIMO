from datetime import datetime, UTC
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dao.base import BaseDAO
from app.messages.models import Message
from app.messages.schemas import MessageCreate


class MessageDAO(BaseDAO):
    @staticmethod
    async def create(session: AsyncSession, msg_data: MessageCreate) -> Message:
        new_msg = Message(
            chat_id=msg_data.chat_id,
            sender=msg_data.sender,
            content=msg_data.content,
            created_at=datetime.now(UTC)
        )
        session.add(new_msg)
        await session.commit()
        await session.refresh(new_msg)
        return new_msg

    @staticmethod
    async def get_by_chat(session: AsyncSession, chat_id: id) -> Sequence[Message]:
        result = await session.execute(
            select(Message).
            where(Message.chat_id == chat_id)
            .order_by(Message.created_at)
        )
        return result.scalars().all()
