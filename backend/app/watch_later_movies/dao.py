from typing import Sequence

from app.dao.movie_base import MovieBaseDAO
from app.database import Base
from app.watch_later_movies.models import WatchLaterMovie


class WatchLaterMovieDAO(MovieBaseDAO):
    model = WatchLaterMovie

    @classmethod
    async def find_movies(cls, *, user_id: int, limit: int, offset: int) -> Sequence[Base]:
        return await super().find_all_movies(
            filters=[cls.model.user_id == user_id],
            order_by=[cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )

    @classmethod
    async def delete_movie(cls, *, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id])
