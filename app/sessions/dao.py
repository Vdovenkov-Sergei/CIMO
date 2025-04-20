import uuid
from typing import Optional, Sequence

from sqlalchemy import RowMapping, and_, func, select

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.sessions.models import Session, SessionStatus


class SessionDAO(BaseDAO):
    model = Session

    @classmethod
    async def find_existing_session(cls, *, user_id: int) -> Optional[RowMapping]:
        query = select(*cls.model.__table__.columns).where(
            and_(cls.model.user_id == user_id, cls.model.status.not_in([SessionStatus.COMPLETED]))
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
