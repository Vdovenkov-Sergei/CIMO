from sqlalchemy import String, Integer, Date, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movie(Base):
    __tablename__ = 'movies'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    release_date: Mapped[Date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    runtime: Mapped[int] = mapped_column(Integer, nullable=False)
    poster_id: Mapped[int] = mapped_column(Integer, nullable=False)
    imdb_id: Mapped[int] = mapped_column(Integer, nullable=False)
    kinopoisk_id: Mapped[int] = mapped_column(Integer, nullable=False)
    overview: Mapped[str] = mapped_column(Text)
    genres: Mapped[list] = mapped_column(JSON, nullable=False)
    countries: Mapped[list] = mapped_column(JSON, nullable=False)
