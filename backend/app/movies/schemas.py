from typing import Optional, Self

from pydantic import model_validator

from app.constants import URLs
from app.movies.models import MovieType
from app.schemas.base import BaseSchema


class SMovieRead(BaseSchema):
    id: int
    name: str
    release_year: int
    poster_url: str

    @model_validator(mode="after")
    def postprocess_poster_url(self) -> Self:
        if not self.poster_url.startswith("http"):
            self.poster_url = f"{URLs.BASE_POSTER_URL}{self.poster_url}"
        return self


class SMovieDetailedRead(SMovieRead):
    type: MovieType
    rating_kp: Optional[float]
    rating_imdb: Optional[float]
    description: Optional[str]
    runtime: Optional[int]
    age_rating: Optional[int]
    genres: Optional[list[str]]
    countries: Optional[list[str]]
