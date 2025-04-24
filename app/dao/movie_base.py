from typing import Any, Optional, Sequence

from sqlalchemy.orm import Load, joinedload

from app.dao.base import BaseDAO
from app.database import Base


class MovieBaseDAO(BaseDAO):
    @classmethod
    async def find_movies(
        cls,
        *,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[Base]:
        return await cls.find_all(
            options=[joinedload(cls.model.movie)],
            filters=filters,
            order_by=order_by,
            limit=limit,
            offset=offset,
        )

    @classmethod
    async def find_by_id(cls, user_id: int, movie_id: int, *, options: Optional[list[Load]] = None) -> Optional[Base]:
        return await cls.find_one_or_none(
            options=options, filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id]
        )

    @classmethod
    async def delete_movie(cls, *, user_id: int, movie_id: int) -> int:
        return await cls.delete_record(filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id])
