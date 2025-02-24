from app.dao.base import BaseDAO
from app.viewed_movies.models import ViewedMovie


class ViewedMovieDAO(BaseDAO):
    model = ViewedMovie