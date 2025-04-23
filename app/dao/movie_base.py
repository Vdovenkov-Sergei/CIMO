from typing import Any, Optional, Sequence, Type

from sqlalchemy import RowMapping
from app.dao.base import BaseDAO
from app.database import Base

from sqlalchemy.orm import Load, joinedload


class MovieBaseDAO(BaseDAO):
    @classmethod
    async def find_movies(
        cls,
        *,
        joins: Optional[list[tuple[Type[Base], Any]]] = None,
        columns: Optional[list[Any]] = None,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[RowMapping]:
        return await cls.find_all(
            joins=joins,
            options=[joinedload(cls.model.movie)],
            columns=columns,
            filters=filters,
            order_by=order_by,
            limit=limit,
            offset=offset,
        )

    @classmethod
    async def find_by_id(
        cls, user_id: int, movie_id: int, *, columns: Optional[list[Any]] = None, options: Optional[list[Load]] = None
    ) -> Optional[RowMapping]:
        return await cls.find_one_or_none(
            columns=columns, options=options, filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id]
        )
