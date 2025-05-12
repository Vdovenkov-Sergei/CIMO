from typing import Sequence

from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_find_all
from app.movie_roles.models import MovieRole


class MovieRoleDAO(BaseDAO):
    model = MovieRole

    @classmethod
    @log_db_find_all("Fetch movie roles")
    async def get_movie_roles(cls, *, movie_id: int, limit: int, offset: int) -> Sequence[MovieRole]:
        return await cls.find_all(
            options=[joinedload(cls.model.person)],
            filters=[cls.model.movie_id == movie_id],
            order_by=[cls.model.priority.asc()],
            limit=limit,
            offset=offset,
        )
