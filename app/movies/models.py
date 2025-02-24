from datetime import date

from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    release_date: Mapped[date] = mapped_column(nullable=False)
    age_restriction: Mapped[int] = mapped_column(nullable=True)
    runtime: Mapped[int] = mapped_column(nullable=False)
    poster_id: Mapped[int] = mapped_column(nullable=True)
    imdb_id: Mapped[int] = mapped_column(nullable=True)
    kinopoisk_id: Mapped[int] = mapped_column(nullable=True)
    overview: Mapped[str] = mapped_column(Text, nullable=True)
    genres: Mapped[list[str]] = mapped_column(nullable=True)
    countries: Mapped[list[str]] = mapped_column(nullable=True)
