from datetime import datetime

from sqlalchemy import CheckConstraint, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ViewedMovie(Base):
    __tablename__ = "viewed_movies"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True, autoincrement=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), primary_key=True, autoincrement=False)
    review: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)

    __table_args__ = (CheckConstraint("review BETWEEN 1 AND 10", name="check_review_range"),)
