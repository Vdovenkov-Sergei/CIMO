from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SessionMovie(Base):
    __tablename__ = "session_movies"

    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"), primary_key=True, autoincrement=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True, autoincrement=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), primary_key=True, autoincrement=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
