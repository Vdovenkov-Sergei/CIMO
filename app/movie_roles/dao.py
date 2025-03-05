from app.dao.base import BaseDAO
from app.movies.models import MovieRole


class MovieRoleDAO(BaseDAO):
    model = MovieRole
