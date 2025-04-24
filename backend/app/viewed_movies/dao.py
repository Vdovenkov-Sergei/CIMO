from typing import Sequence

from app.dao.movie_base import MovieBaseDAO
from app.database import Base
from app.viewed_movies.models import ViewedMovie


class ViewedMovieDAO(MovieBaseDAO):
    model = ViewedMovie

    @classmethod
    async def find_movies(cls, *, user_id: int, limit: int, offset: int, order_review: bool) -> Sequence[Base]:
        order_by = [cls.model.review.desc()] if order_review else []
        order_by.append(cls.model.created_at.desc())  # type: ignore
        return await super().find_all_movies(
            filters=[cls.model.user_id == user_id],
            order_by=order_by,
            limit=limit,
            offset=offset,
        )

    @classmethod
    async def delete_movie(cls, *, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id])
