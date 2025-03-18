from datetime import datetime

from sqlalchemy import ForeignKey, PrimaryKeyConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WatchLaterMovie(Base):
    __tablename__ = "watch_later_movies"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("user_id", "movie_id", name="watch_later_movies_pkey"),)

    user = relationship("User", back_populates="watch_later_movies")
    movie = relationship("Movie", back_populates="watch_later_movies")

    def __str__(self):
        return f"Movie #{self.movie_id}"
