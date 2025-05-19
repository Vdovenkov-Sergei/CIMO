from typing import Optional

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_find_one
from app.movies.models import Movie


class MovieDAO(BaseDAO[Movie]):
    model = Movie

    @classmethod
    @log_db_find_one("Fetch movie")
    async def find_movie_by_id(cls, *, movie_id: int) -> Optional[Movie]:
        return await cls.find_by_id(movie_id)
