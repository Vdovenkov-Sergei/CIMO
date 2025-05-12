from typing import Sequence

from app.dao.decorators import log_db_add, log_db_delete, log_db_find_all
from app.dao.movie_base import MovieBaseDAO
from app.watch_later_movies.models import WatchLaterMovie


class WatchLaterMovieDAO(MovieBaseDAO):
    model = WatchLaterMovie

    @classmethod
    @log_db_find_all("Fetch watch later movies")
    async def find_movies(cls, *, user_id: int, limit: int, offset: int) -> Sequence[WatchLaterMovie]:
        return await super().find_all_movies(
            filters=[cls.model.user_id == user_id],
            order_by=[cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )

    @classmethod
    @log_db_delete("Delete watch later movie")
    async def delete_movie(cls, *, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id])

    @classmethod
    @log_db_add("Add watch later movie")
    async def add_movie(cls, *, user_id: int, movie_id: int) -> WatchLaterMovie:
        return await cls.add_record(user_id=user_id, movie_id=movie_id)
