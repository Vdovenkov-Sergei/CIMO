from app.dao.base import MovieBaseDAO
from app.watch_later_movies.models import WatchLaterMovie


class WatchLaterMovieDAO(MovieBaseDAO):
    model = WatchLaterMovie
