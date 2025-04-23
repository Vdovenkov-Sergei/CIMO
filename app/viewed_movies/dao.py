from typing import Sequence

from sqlalchemy import RowMapping
from app.dao.movie_base import MovieBaseDAO
from app.viewed_movies.models import ViewedMovie


class ViewedMovieDAO(MovieBaseDAO):
    model = ViewedMovie

    @classmethod
    async def find_movies(
        cls, *, user_id: int, limit: int, offset: int, order_review: bool = False
    ) -> Sequence[RowMapping]:
        order_by = [cls.model.review.desc()] if order_review else []
        order_by.append(cls.model.created_at.desc())
        return await super().find_movies(
            filters=[cls.model.user_id == user_id],
            order_by=order_by,
            limit=limit,
            offset=offset,
        )
