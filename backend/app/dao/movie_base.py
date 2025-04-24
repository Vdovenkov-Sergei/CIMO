from typing import Any, Optional, Sequence

from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.database import Base


class MovieBaseDAO(BaseDAO):
    @classmethod
    async def find_all_movies(
        cls,
        *,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[Base]:
        return await cls.find_all(
            options=[joinedload(cls.model.movie)],  # type: ignore
            filters=filters,
            order_by=order_by,
            limit=limit,
            offset=offset,
        )
