import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, ForeignKeyConstraint, PrimaryKeyConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SessionMovie(Base):
    __tablename__ = "session_movies"

    session_id: Mapped[uuid.UUID] = mapped_column()
    user_id: Mapped[int] = mapped_column()
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    __table_args__ = (
        ForeignKeyConstraint(
            ["session_id", "user_id"], ["sessions.id", "sessions.user_id"], name="session_movies_session_user_id_fkey"
        ),
        PrimaryKeyConstraint("session_id", "user_id", "movie_id", name="session_movies_pkey"),
    )
