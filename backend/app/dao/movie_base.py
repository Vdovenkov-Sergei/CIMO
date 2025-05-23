from typing import Any, Optional, Sequence, TypeVar

from sqlalchemy.orm import joinedload
from sqlalchemy.orm.strategy_options import _AbstractLoad

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_find_one
from app.database import Base

T = TypeVar("T", bound=Base)


class MovieBaseDAO(BaseDAO[T]):
    @classmethod
    async def find_all_movies(
        cls,
        *,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[T]:
        return await cls.find_all(
            options=[joinedload(cls.model.movie)],  # type: ignore
            filters=filters,
            order_by=order_by,
            limit=limit,
            offset=offset,
        )

    @classmethod
    @log_db_find_one("Fetch user's movie")
    async def find_by_user_movie_id(
        cls, *, user_id: int, movie_id: int, options: Optional[list[_AbstractLoad]] = None
    ) -> Optional[T]:
        return await cls.find_one_or_none(
            options=options,
            filters=[cls.model.user_id == user_id, cls.model.movie_id == movie_id],  # type: ignore
        )
