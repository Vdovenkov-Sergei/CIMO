from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.database import Base
from app.movie_roles.models import MovieRole


class MovieRoleDAO(BaseDAO):
    model = MovieRole

    @classmethod
    async def get_movie_roles(cls, *, movie_id: int, limit: int, offset: int) -> list[Base]:
        return await cls.find_all(
            options=[joinedload(cls.model.person)],
            filters=[cls.model.movie_id == movie_id],
            order_by=[cls.model.priority.asc()],
            limit=limit,
            offset=offset,
        )
