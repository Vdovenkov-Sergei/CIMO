from app.dao.base import BaseDAO
from app.movie_roles.models import MovieRole


class MovieRoleDAO(BaseDAO):
    model = MovieRole
