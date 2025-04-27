from datetime import UTC, datetime, timedelta
import uuid
from typing import Any, Optional, Sequence

from sqlalchemy import and_, or_, select

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.sessions.models import Session, SessionStatus


class SessionDAO(BaseDAO):
    model = Session

    @classmethod
    async def find_existing_session(cls, *, user_id: int) -> Optional[Session]:
        query = select(cls.model).where(
            cls.model.user_id == user_id, cls.model.status.not_in([SessionStatus.COMPLETED])
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def get_participants(cls, *, session_id: uuid.UUID) -> Sequence[Session]:
        query = select(cls.model).where(cls.model.id == session_id)
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def update_session(cls, *, session_id: uuid.UUID, user_id: int, update_data: dict[str, Any]) -> int:
        return await cls.update_record(
            filters=[cls.model.id == session_id, cls.model.user_id == user_id], update_data=update_data
        )

    @classmethod
    async def delete_session(cls, *, session_id: uuid.UUID, user_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.id == session_id, cls.model.user_id == user_id])

    @classmethod
    async def clean_completed_sessions(cls) -> None:
        return await cls.delete_record(filters=[cls.model.status == SessionStatus.COMPLETED])

    @classmethod
    async def clean_old_sessions(cls) -> None:
        now = datetime.now(UTC)
        afk_cutoff = now - timedelta(days=3)
        pending_prepared_cutoff = now - timedelta(days=1)
        return await cls.delete_record(
            filters=[
                or_(
                    # Удаляем AFK сессии старше 3 дней по started_at
                    and_(
                        Session.status == SessionStatus.AFK,
                        Session.started_at.is_not(None),
                        Session.started_at < afk_cutoff,
                    ),
                    # Удаляем PENDING/PREPARED сессии старше 1 дня по created_at
                    and_(
                        Session.status.in_([SessionStatus.PENDING, SessionStatus.PREPARED]),
                        Session.created_at < pending_prepared_cutoff,
                    ),
                )
            ]
        )
