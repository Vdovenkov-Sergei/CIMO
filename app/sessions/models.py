import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SessionStatus(PyEnum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    AFK = "AFK"
    COMPLETED = "COMPLETED"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(nullable=True)
    ended_at: Mapped[datetime] = mapped_column(nullable=True)
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), server_default=SessionStatus.PENDING.value, nullable=False
    )

    __table_args__ = (PrimaryKeyConstraint("id", "user_id", name="sessions_pkey"),)

    user = relationship("User", back_populates="sessions")

    def __repr__(self):
        return f"<id(id={self.id}, user_id={self.user_id}, " \
               f"created_at={self.created_at}, ended_at={self.ended_at}, status='{self.status}')>"
