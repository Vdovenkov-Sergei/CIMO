from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.messages.dao import MessageDAO
from app.messages.schemas import MessageRead, MessageCreate

router_message = APIRouter(prefix="/chats", tags=["Chats"])


@router_message.post("/", response_model=MessageRead)
async def create_message(msg: MessageCreate, session: AsyncSession = Depends(get_session)):
    return await MessageDAO.create(session, msg)


@router_message.get("/chat/{chat_id}", response_model=list[MessageRead])
async def get_message_for_chat(chat_id: int, session: AsyncSession = Depends(get_session)):
    return await MessageDAO.get_by_chat(session, chat_id)
