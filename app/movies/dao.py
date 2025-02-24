from app.dao.base import BaseDAO
from app.movies.models import Movie


class MoviesDAO(BaseDAO):
    model = Movie
