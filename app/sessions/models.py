from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SessionType(PyEnum):
    SOLO = "SOLO"
    DUO = "DUO"


class SessionStatus(PyEnum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    COMPLETED = "COMPLETED"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_1_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user_2_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    session_type: Mapped[SessionType] = mapped_column(
        Enum(SessionType), server_default=SessionType.SOLO.value, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    ended_at: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), server_default=SessionStatus.ACTIVE.value, nullable=False
    )
