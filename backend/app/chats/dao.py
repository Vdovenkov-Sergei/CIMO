from typing import Optional

from faker import Faker

from app.chats.models import Chat
from app.dao.base import BaseDAO
from app.dao.decorators import log_db_add, log_db_find_one


class ChatDAO(BaseDAO[Chat]):
    model = Chat

    @classmethod
    @log_db_find_one("Fetch chat")
    async def get_existing_chat(cls, *, user_id: int) -> Optional[Chat]:
        return await cls.find_one_or_none(filters=[cls.model.user_id == user_id])

    @classmethod
    @log_db_add("Add chat")
    async def add_chat(cls, *, user_id: int) -> Chat:
        bot_name = Faker("ru_RU").first_name()
        return await cls.add_record(user_id=user_id, bot_name=bot_name)
