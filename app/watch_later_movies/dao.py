from typing import Sequence

from sqlalchemy import RowMapping

from app.dao.movie_base import MovieBaseDAO
from app.viewed_movies.models import ViewedMovie


class WatchLaterMovieDAO(MovieBaseDAO):
    model = ViewedMovie

    @classmethod
    async def find_movies(cls, *, user_id: int, limit: int, offset: int) -> Sequence[RowMapping]:
        return await super().find_movies(
            filters=[cls.model.user_id == user_id],
            order_by=[cls.model.created_at.desc()],
            limit=limit,
            offset=offset,
        )