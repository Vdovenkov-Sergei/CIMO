from enum import Enum as PyEnum

from sqlalchemy import Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MovieType(PyEnum):
    MOVIE = "MOVIE"
    CARTOON = "CARTOON"
    ANIME = "ANIME"


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[MovieType] = mapped_column(Enum(MovieType), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    release_year: Mapped[int] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    rating_kp: Mapped[float] = mapped_column(nullable=True)
    rating_imdb: Mapped[float] = mapped_column(nullable=True)
    runtime: Mapped[int] = mapped_column(nullable=True)
    age_rating: Mapped[int] = mapped_column(nullable=True)
    poster_url: Mapped[str] = mapped_column(nullable=False)
    genres: Mapped[list[str]] = mapped_column(nullable=True)
    countries: Mapped[list[str]] = mapped_column(nullable=True)

    roles = relationship("MovieRole", back_populates="movie", cascade="all, delete-orphan")
    viewed_by_users = relationship("ViewedMovie", back_populates="movie", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<id(id={self.id}, type='{self.type}', name='{self.name}', " \
               f"release_year={self.release_year}, description='{self.description}'," \
               f"rating_kp={self.rating_kp}, rating_imdb={self.rating_imdb}," \
               f"runtime={self.runtime}, age_rating={self.age_rating}, postgres_url='{self.poster_url}'," \
               f"genres='{self.genres}', countries={self.countries})>"
