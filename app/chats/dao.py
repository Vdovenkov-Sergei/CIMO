from datetime import datetime, UTC
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.chats.models import Chat
from app.chats.schemas import ChatCreate
from app.dao.base import BaseDAO


class ChatDAO(BaseDAO):
    @staticmethod
    async def create(session: AsyncSession, chat_data: ChatCreate) -> Chat:
        new_chat = Chat(
            user_id=chat_data.user_id,
            bot_name=chat_data.bot_name,
            created_at=datetime.now(UTC)
        )
        session.add(new_chat)
        await session.commit()
        await session.refresh(new_chat)
        return new_chat

    @staticmethod
    async def get_by_id(session: AsyncSession, chat_id: int) -> Chat | None:
        result = await session.execute(
            select(Chat)
            .where(Chat.id == chat_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_user_id(session: AsyncSession, user_id: int) -> Sequence[Chat]:
        result = await session.execute(
            select(Chat)
            .where(Chat.user_id == user_id)
        )
        return result.scalars().all()

    @staticmethod
    async def delete(session: AsyncSession, chat_id: int) -> bool:
        chat = await ChatDAO.get_by_id(session, chat_id)
        if chat:
            await session.delete(chat)
            await session.commit()
            return True
        return False
