import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, PrimaryKeyConstraint, func, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SessionStatus(str, PyEnum):
    PENDING = "PENDING"
    PREPARED = "PREPARED"
    ACTIVE = "ACTIVE"
    AFK = "AFK"
    REVIEW = "REVIEW"
    COMPLETED = "COMPLETED"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(server_default=text("gen_random_uuid()"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    started_at: Mapped[datetime] = mapped_column(nullable=True)
    ended_at: Mapped[datetime] = mapped_column(nullable=True)
    is_pair: Mapped[bool] = mapped_column(nullable=False, server_default="false")
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), server_default=SessionStatus.PENDING.value, nullable=False
    )

    __table_args__ = (PrimaryKeyConstraint("id", "user_id", name="sessions_pkey"),)

    user = relationship("User", back_populates="sessions")
    session_movies = relationship(
        "SessionMovie",
        back_populates="session",
        cascade="all, delete-orphan",
        primaryjoin="and_(Session.id == SessionMovie.session_id, Session.user_id == SessionMovie.user_id)",
    )

    def __str__(self) -> str:
        return self.status.value
