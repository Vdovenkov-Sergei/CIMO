from app.dao.base import BaseDAO
from app.sessions.models import Session


class SessionDAO(BaseDAO):
    model = Session