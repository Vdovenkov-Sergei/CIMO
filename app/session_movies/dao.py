import uuid
from typing import Sequence

from sqlalchemy import RowMapping, func, select

from app.dao.movie_base import MovieBaseDAO
from app.database import async_session_maker
from app.session_movies.models import SessionMovie


class SessionMovieDAO(MovieBaseDAO):
    model = SessionMovie
    PAIR = 2

    @classmethod
    async def check_movie_match(cls, *, session_id: uuid.UUID, movie_id: int) -> bool:
        query = select(func.count(func.distinct(cls.model.user_id))).where(
            cls.model.session_id == session_id, cls.model.movie_id == movie_id
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            user_count = result.scalar() or 0
            return user_count == cls.PAIR

    @classmethod
    async def update_movie_match(cls, *, session_id: uuid.UUID, movie_id: int) -> int:
        return await cls.update_record(
            filters=[cls.model.session_id == session_id, cls.model.movie_id == movie_id],
            update_data={"is_matched": True},
        )

    @classmethod
    async def find_movies(cls, *, session_id: uuid.UUID, user_id: int, limit: int, offset: int) -> Sequence[RowMapping]:
        return await super().find_movies(
            filters=[cls.model.session_id == session_id, cls.model.user_id == user_id],
            order_by=[cls.model.is_matched.desc(), cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )

    @classmethod
    async def delete_movie(cls, *, session_id: uuid.UUID, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(
            filters=[
                cls.model.session_id == session_id,
                cls.model.user_id == user_id,
                cls.model.movie_id == movie_id,
            ]
        )
