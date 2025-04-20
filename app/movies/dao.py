from typing import Optional

from sqlalchemy import RowMapping, select
from sqlalchemy.orm import joinedload

from app.dao.base import BaseDAO
from app.database import async_session_maker
from app.movies.models import Movie


class MovieDAO(BaseDAO):
    model = Movie

    @classmethod
    async def find_movie_with_roles(cls, movie_id: int) -> Optional[RowMapping]:
        query = (
            select(cls.model)
            .options(joinedload(cls.model.roles).joinedload(cls.model.person))
            .where(cls.model.id == movie_id)
        )
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().unique().one_or_none()
