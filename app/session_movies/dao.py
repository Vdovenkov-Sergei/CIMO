from app.dao.base import BaseDAO
from app.session_movies.models import SessionMovie


class SessionMovieDAO(BaseDAO):
    model = SessionMovie