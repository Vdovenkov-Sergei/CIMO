import uuid
from typing import Optional, Sequence

from sqlalchemy import func, select

from app.constants import General
from app.dao.decorators import (
    log_db_action,
    log_db_add,
    log_db_delete,
    log_db_find_all,
    log_db_find_one,
    log_db_update,
    log_query_time,
)
from app.dao.movie_base import MovieBaseDAO
from app.database import async_session_maker
from app.session_movies.models import SessionMovie


class SessionMovieDAO(MovieBaseDAO):
    model = SessionMovie

    @classmethod
    @log_db_action("Check movie match")
    @log_query_time
    async def check_movie_match(cls, *, session_id: uuid.UUID, movie_id: int) -> bool:
        query = select(func.count(func.distinct(cls.model.user_id))).where(
            cls.model.session_id == session_id, cls.model.movie_id == movie_id
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            user_count = result.scalar() or 0
            return user_count == General.PAIR

    @classmethod
    @log_db_update("Update movie match")
    async def update_movie_match(cls, *, session_id: uuid.UUID, movie_id: int) -> int:
        return await cls.update_record(
            filters=[cls.model.session_id == session_id, cls.model.movie_id == movie_id],
            update_data={"is_matched": True},
        )

    @classmethod
    @log_db_find_all("Fetch session movies")
    async def find_movies(
        cls, *, session_id: uuid.UUID, user_id: int, limit: int, offset: int
    ) -> Sequence[SessionMovie]:
        return await super().find_all_movies(
            filters=[cls.model.session_id == session_id, cls.model.user_id == user_id],
            order_by=[cls.model.is_matched.desc(), cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )

    @classmethod
    @log_db_find_one("Fetch user's session movie")
    async def find_by_session_user_movie_id(
        cls, *, session_id: uuid.UUID, user_id: int, movie_id: int
    ) -> Optional[SessionMovie]:
        return await cls.find_one_or_none(
            filters=[
                cls.model.session_id == session_id,
                cls.model.user_id == user_id,
                cls.model.movie_id == movie_id,
            ]
        )

    @classmethod
    @log_db_delete("Delete session movie")
    async def delete_movie(cls, *, session_id: uuid.UUID, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(
            filters=[
                cls.model.session_id == session_id,
                cls.model.user_id == user_id,
                cls.model.movie_id == movie_id,
            ]
        )

    @classmethod
    @log_db_add("Add session movie")
    async def add_movie(cls, *, session_id: uuid.UUID, user_id: int, movie_id: int) -> SessionMovie:
        return await cls.add_record(
            session_id=session_id,
            user_id=user_id,
            movie_id=movie_id,
        )
