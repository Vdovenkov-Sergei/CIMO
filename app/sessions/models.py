import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SessionStatus(PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    AFK = "AFK"
    COMPLETED = "COMPLETED"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    created_at: Mapped[datetime] = mapped_column(nullable=True)
    ended_at: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), server_default=SessionStatus.PENDING.value, nullable=False
    )
