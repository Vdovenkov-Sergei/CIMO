from app.dao.base import BaseDAO
from app.messages.models import Message


class MessageDAO(BaseDAO):
    model = Message