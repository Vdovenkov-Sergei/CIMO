from app.chats.models import Chat
from app.dao.base import BaseDAO


class ChatDAO(BaseDAO):
    model = Chat
