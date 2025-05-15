from typing import Any, Sequence

from app.dao.decorators import log_db_add, log_db_delete, log_db_find_all, log_db_update
from app.dao.movie_base import MovieBaseDAO
from app.viewed_movies.models import ViewedMovie


class ViewedMovieDAO(MovieBaseDAO):
    model = ViewedMovie

    @classmethod
    @log_db_find_all("Fetch viewed movies")
    async def find_movies(cls, *, user_id: int, limit: int, offset: int, order_review: bool) -> Sequence[ViewedMovie]:
        order_by = [cls.model.review.desc()] if order_review else []
        order_by.append(cls.model.created_at.desc())  # type: ignore
        return await super().find_all_movies(
            filters=[cls.model.user_id == user_id],
            order_by=order_by,
            limit=limit,
            offset=offset,
        )

    @classmethod
    @log_db_delete("Delete viewed movie")
    async def delete_movie(cls, *, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id])

    @classmethod
    @log_db_update("Update viewed movie")
    async def update_movie(cls, *, user_id: int, movie_id: int, update_data: dict[str, Any]) -> int:
        return await cls.update_record(
            filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id], update_data=update_data
        )

    @classmethod
    @log_db_add("Add viewed movie")
    async def add_movie(cls, *, user_id: int, movie_id: int, review: int) -> ViewedMovie:
        return await cls.add_record(user_id=user_id, movie_id=movie_id, review=review)
