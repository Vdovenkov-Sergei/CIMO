from enum import Enum as PyEnum

from sqlalchemy import ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SessionType(PyEnum):
    SOLO = "solo"
    DUO = "duo"


class Session(Base):
    __tablename__ = 'sessions'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_1_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    user_2_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    sender: Mapped[SessionType] = mapped_column(Enum(SessionType), default=SessionType.SOLO, nullable=False)
