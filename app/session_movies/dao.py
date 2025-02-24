from app.dao.base import MovieBaseDAO
from app.session_movies.models import SessionMovie


class SessionMovieDAO(MovieBaseDAO):
    model = SessionMovie
