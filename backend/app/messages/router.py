from fastapi import APIRouter, Depends

from app.chats.dependencies import get_existing_chat
from app.chats.models import Chat
from app.constants import Pagination
from app.logger import logger
from app.messages.dao import MessageDAO
from app.messages.models import SenderType
from app.messages.schemas import SMessageCreate, SMessageRead

router = APIRouter(prefix="/chats/message", tags=["Chats"])


async def bot_generate_response(_: str) -> str:
    # TODO Добавить логику генерации ответа бота
    msg = "Я не знаю, что ответить =("
    logger.debug("Bot generated response", extra={"msg_content": msg})
    return msg


@router.post("/", response_model=SMessageRead)
async def create_message(data: SMessageCreate, chat: Chat = Depends(get_existing_chat)) -> SMessageRead:
    message = await MessageDAO.add_message(chat_id=chat.id, sender=data.sender, content=data.content)

    if data.sender == SenderType.USER:
        bot_reply = await bot_generate_response(data.content)
        await MessageDAO.add_message(chat_id=chat.id, sender=SenderType.BOT, content=bot_reply)
    return SMessageRead.model_validate(message)


@router.get("/", response_model=list[SMessageRead])
async def get_messages(
    limit: int = Pagination.PAG_LIMIT,
    offset: int = Pagination.PAG_OFFSET,
    chat: Chat = Depends(get_existing_chat),
) -> list[SMessageRead]:
    messages = await MessageDAO.get_messages(chat_id=chat.id, limit=limit, offset=offset)
    return [SMessageRead.model_validate(msg) for msg in messages]
