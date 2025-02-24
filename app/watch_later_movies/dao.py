from app.dao.base import BaseDAO
from app.watch_later_movies.models import WatchLaterMovie


class WatchLaterMovieDAO(BaseDAO):
    model = WatchLaterMovie