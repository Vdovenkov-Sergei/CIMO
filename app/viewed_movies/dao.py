from app.dao.base import MovieBaseDAO
from app.viewed_movies.models import ViewedMovie


class ViewedMovieDAO(MovieBaseDAO):
    model = ViewedMovie
