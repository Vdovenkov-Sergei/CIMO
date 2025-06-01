from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache

from app.chats.dao import ChatDAO
from app.chats.schemas import SChatRead
from app.config import settings
from app.exceptions import ChatAlreadyExistsException, ChatNotFoundException
from app.logger import logger
from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("/", response_model=SChatRead)
async def create_chat(user: User = Depends(get_current_user)) -> SChatRead:
    existing_chat = await ChatDAO.get_existing_chat(user_id=user.id)
    if existing_chat:
        logger.warning("Chat already exists.", extra={"user_id": user.id, "chat_id": existing_chat.id})
        raise ChatAlreadyExistsException(chat_id=existing_chat.id)

    chat = await ChatDAO.add_chat(user_id=user.id)
    return SChatRead.model_validate(chat)


@router.get("/", response_model=SChatRead)
@cache(expire=settings.CACHE_TTL)
async def get_chat(user: User = Depends(get_current_user)) -> SChatRead:
    chat = await ChatDAO.get_existing_chat(user_id=user.id)
    if not chat:
        raise ChatNotFoundException
    return SChatRead.model_validate(chat)
