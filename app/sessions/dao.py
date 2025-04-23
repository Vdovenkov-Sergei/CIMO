import uuid
from typing import Any, Optional, Sequence

from sqlalchemy import RowMapping, select

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.sessions.models import Session, SessionStatus


class SessionDAO(BaseDAO):
    model = Session

    @classmethod
    async def find_existing_session(cls, *, user_id: int) -> Optional[RowMapping]:
        query = select(*cls.model.__table__.columns).where(
            cls.model.user_id == user_id, cls.model.status.not_in([SessionStatus.COMPLETED])
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def get_participants(cls, *, session_id: uuid.UUID) -> Sequence[RowMapping]:
        query = select(*cls.model.__table__.columns).where(cls.model.id == session_id)
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.mappings().all()

    @classmethod
    async def update_session(cls, *, session_id: uuid.UUID, user_id: int, update_data: dict[str, Any]) -> int:
        return await cls.update_record(
            filters=[cls.model.id == session_id, cls.model.user_id == user_id], update_data=update_data
        )

    @classmethod
    async def delete_session(cls, *, session_id: uuid.UUID, user_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.id == session_id, cls.model.user_id == user_id])
