from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SavedMovie(Base):
    __tablename__ = 'saved_movies'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    movie_id: Mapped[int] = mapped_column(Integer, ForeignKey('movie.id'))
