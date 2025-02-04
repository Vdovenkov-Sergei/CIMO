from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Integer, DateTime, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SenderType(PyEnum):
    USER = "user"
    BOT = "bot"


class Message(Base):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    chat_id: Mapped[int] = mapped_column(Integer, ForeignKey('chats.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime)
    sender: Mapped[SenderType] = mapped_column(Enum(SenderType), default=SenderType.BOT)
    content: Mapped[str] = mapped_column(Text)
