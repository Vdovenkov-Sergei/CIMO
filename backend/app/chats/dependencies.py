from fastapi import Depends

from app.chats.dao import ChatDAO
from app.chats.models import Chat
from app.exceptions import ChatNotFoundException
from app.users.dependencies import get_current_user
from app.users.models import User


async def get_existing_chat(user: User = Depends(get_current_user)) -> Chat:
    chat = await ChatDAO.get_existing_chat(user_id=user.id)
    if not chat:
        raise ChatNotFoundException
    return chat
