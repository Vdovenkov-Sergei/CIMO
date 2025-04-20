import select
from typing import Optional
import uuid

from sqlalchemy import RowMapping, Sequence, func
from app.dao.base import BaseDAO
from app.session_movies.models import SessionMovie
from sqlalchemy.orm import joinedload

from app.database import async_session_maker


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
            user_count = result.scalar_one()
            return user_count == cls.PAIR

    @classmethod
    async def get_movies(
        cls, session_id: uuid.UUID, user_id: int, limit: int, offset: int
    ) -> Optional[Sequence[RowMapping]]:
        query = (
            select(cls.model).options(joinedload(cls.model.movie))
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
