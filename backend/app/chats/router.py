from typing import Optional

from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache

from app.chats.dao import ChatDAO
from app.chats.schemas import SChatRead
from app.exceptions import ChatAlreadyExistsException
from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("/", response_model=SChatRead)
async def create_chat(user: User = Depends(get_current_user)) -> SChatRead:
    existing_chat = await ChatDAO.get_existing_chat(user_id=user.id)
    if existing_chat:
        raise ChatAlreadyExistsException

    chat = await ChatDAO.add_chat(user_id=user.id)
    return SChatRead.model_validate(chat)


@router.get("/", response_model=Optional[SChatRead])
@cache(expire=60)
async def get_chat(user: User = Depends(get_current_user)) -> Optional[SChatRead]:
    chat = await ChatDAO.get_existing_chat(user_id=user.id)
    return SChatRead.model_validate(chat) if chat else None
