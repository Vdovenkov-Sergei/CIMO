from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SenderType(PyEnum):
    USER = "user"
    BOT = "bot"


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey('chats.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(nullable=False)
    sender: Mapped[SenderType] = mapped_column(Enum(SenderType), default=SenderType.BOT, nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
