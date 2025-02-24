from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ConnectionStatus(PyEnum):
    PENDING = "PENDING"
    EXPIRED = "EXPIRED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"


class ConnectionRequest(Base):
    __tablename__ = "connection_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[ConnectionStatus] = mapped_column(
        Enum(ConnectionStatus), server_default=ConnectionStatus.PENDING.value, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
