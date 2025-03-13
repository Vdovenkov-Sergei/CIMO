from datetime import datetime

from sqlalchemy import CheckConstraint, ForeignKey, PrimaryKeyConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ViewedMovie(Base):
    __tablename__ = "viewed_movies"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    review: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("review BETWEEN 1 AND 10", name="check_review_range"),
        PrimaryKeyConstraint("user_id", "movie_id", name="viewed_movies_pkey"),
    )

    user = relationship("User", back_populates="viewed_movies")
    movie = relationship("Movie", back_populates="viewed_by_users")
