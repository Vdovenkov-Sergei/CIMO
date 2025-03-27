from app.dao.base import BaseDAO
from app.movies.models import Movie


class MovieDAO(BaseDAO):
    model = Movie
