from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SenderType(str, PyEnum):
    USER = "USER"
    BOT = "BOT"


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    sender: Mapped[SenderType] = mapped_column(Enum(SenderType), server_default=SenderType.BOT, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    chat = relationship("Chat", back_populates="messages")

    def __str__(self) -> str:
        return f"Message {self.sender.value} #{self.id}"
