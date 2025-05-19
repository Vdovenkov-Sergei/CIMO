import uuid
from datetime import UTC, datetime, timedelta
from typing import Any, Optional, Sequence

from sqlalchemy import and_, or_, select

from app.dao.base import BaseDAO
from app.dao.decorators import (
    log_db_add,
    log_db_delete,
    log_db_find_all,
    log_db_find_one,
    log_db_update,
    log_query_time,
)
from app.database import async_session_maker
from app.sessions.models import Session, SessionStatus


class SessionDAO(BaseDAO[Session]):
    model = Session

    @classmethod
    @log_db_find_one("Fetch user's session")
    @log_query_time
    async def find_existing_session(cls, *, user_id: int) -> Optional[Session]:
        query = select(cls.model).where(
            cls.model.user_id == user_id, cls.model.status.not_in([SessionStatus.COMPLETED])
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    @log_db_find_all("Fetch participants")
    async def get_participants(cls, *, session_id: uuid.UUID) -> Sequence[Session]:
        return await cls.find_all(filters=[cls.model.id == session_id])

    @classmethod
    @log_db_update("Update session")
    async def update_session(cls, *, session_id: uuid.UUID, user_id: int, update_data: dict[str, Any]) -> int:
        return await cls.update_record(
            filters=[cls.model.id == session_id, cls.model.user_id == user_id], update_data=update_data
        )

    @classmethod
    @log_db_delete("Delete session")
    async def delete_session(cls, *, session_id: uuid.UUID, user_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.id == session_id, cls.model.user_id == user_id])

    @classmethod
    @log_db_add("Add session")
    async def add_session(cls, *, user_id: int, is_pair: bool, session_id: Optional[uuid.UUID] = None) -> Session:
        if session_id is None:
            return await cls.add_record(user_id=user_id, is_pair=is_pair)
        return await cls.add_record(id=session_id, user_id=user_id, is_pair=is_pair)

    @classmethod
    @log_db_delete("Clean completed sessions")
    async def clean_completed_sessions(cls) -> int:
        return await cls.delete_record(filters=[cls.model.status == SessionStatus.COMPLETED])

    @classmethod
    @log_db_delete("Clean old sessions")
    async def clean_old_sessions(cls) -> int:
        now = datetime.now(UTC)
        afk_cutoff = now - timedelta(days=3)
        pending_prepared_cutoff = now - timedelta(days=1)
        return await cls.delete_record(
            filters=[
                or_(
                    # Удаляем AFK сессии старше 3 дней по updated_at
                    and_(
                        cls.model.status == SessionStatus.AFK,
                        cls.model.updated_at < afk_cutoff,
                    ),
                    # Удаляем PENDING/PREPARED сессии старше 1 дня по updated_at
                    and_(
                        cls.model.status.in_([SessionStatus.PENDING, SessionStatus.PREPARED]),
                        cls.model.updated_at < pending_prepared_cutoff,
                    ),
                )
            ]
        )
