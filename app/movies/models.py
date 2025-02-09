from datetime import date

from sqlalchemy import JSON, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    release_date: Mapped[date] = mapped_column(Date, nullable=False)
    age_restriction: Mapped[int] = mapped_column(Integer, nullable=False)
    runtime: Mapped[int] = mapped_column(Integer, nullable=False)
    poster_id: Mapped[int] = mapped_column(Integer)
    imdb_id: Mapped[int] = mapped_column(Integer)
    kinopoisk_id: Mapped[int] = mapped_column(Integer)
    overview: Mapped[str] = mapped_column(Text)
    genres: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    countries: Mapped[list[str]] = mapped_column(JSON, nullable=False)
