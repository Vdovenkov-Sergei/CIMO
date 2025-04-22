from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.chats.dao import ChatDAO
from app.chats.schemas import ChatRead, ChatCreate
from app.database import get_session

router_chat = APIRouter(prefix="/chats", tags=["Chats"])


@router_chat.post("/", response_model=ChatRead)
async def create_chat(chat: ChatCreate, session: AsyncSession = Depends(get_session)):
    return await ChatDAO.create(session, chat)


@router_chat.get("/{chat_id}", response_model=ChatRead)
async def get_chat(chat_id: int, session: AsyncSession = Depends(get_session)):
    chat = await ChatDAO.get_by_id(session, chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router_chat.get("/user/{user_id}", response_model=list[ChatRead])
async def get_chats_by_user(user_id: int, session: AsyncSession = Depends(get_session)):
    return await ChatDAO.get_by_user_id(session, user_id)


@router_chat.delete("/{chat_id}")
async def delete_chat(chat_id: int, session: AsyncSession = Depends(get_session)):
    deleted = await ChatDAO.delete(session, chat_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat deleted successfully"}
