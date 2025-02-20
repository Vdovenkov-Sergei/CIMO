from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class WatchLaterMovie(Base):
    __tablename__ = 'watch_later_movies'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    movie_id: Mapped[int] = mapped_column(ForeignKey('movies.id'), nullable=False)
