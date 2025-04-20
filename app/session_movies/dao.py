import uuid
from typing import Sequence

from sqlalchemy import func, select
from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.session_movies.models import SessionMovie


class SessionMovieDAO(BaseDAO):
    model = SessionMovie
    PAIR = 2

    @classmethod
    async def check_movie_match(cls, session_id: uuid.UUID, movie_id: int) -> bool:
        query = select(func.count(func.distinct(cls.model.user_id))).where(
            cls.model.session_id == session_id, cls.model.movie_id == movie_id
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            user_count = result.scalar() or 0
            return user_count == cls.PAIR

    @classmethod
    async def get_movies(cls, session_id: uuid.UUID, user_id: int, limit: int, offset: int) -> Sequence[SessionMovie]:
        query = (
            select(cls.model)
            .options(joinedload(cls.model.movie))
            .where(
                cls.model.session_id == session_id,
                cls.model.user_id == user_id,
            )
            .order_by(cls.model.is_matched.desc(), cls.model.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().all()
