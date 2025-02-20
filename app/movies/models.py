from datetime import date

from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movie(Base):
    __tablename__ = 'movies'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    release_date: Mapped[date] = mapped_column(nullable=False)
    age_restriction: Mapped[int] = mapped_column()  # мб добавить Enum с категориями возрастных ограничений
    runtime: Mapped[int] = mapped_column()
    poster_id: Mapped[int] = mapped_column()
    imdb_id: Mapped[int] = mapped_column()
    kinopoisk_id: Mapped[int] = mapped_column()
    overview: Mapped[str] = mapped_column()
    genres: Mapped[JSON] = mapped_column()
    countries: Mapped[JSON] = mapped_column()
