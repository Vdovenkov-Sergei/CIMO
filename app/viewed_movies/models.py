from sqlalchemy import ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ViewedMovie(Base):
    __tablename__ = 'viewed_movies'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey('movies.id'), nullable=False)
    review: Mapped[int] = mapped_column(nullable=False)

    __table_args__ = (CheckConstraint('review BETWEEN 1 AND 10', name='check_review_range'),)
