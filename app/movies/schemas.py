from typing import Optional, Self

from pydantic import BaseModel, model_validator

from app.config import settings
from app.movies.models import MovieType


class SMovieRead(BaseModel):
    id: int
    name: str
    release_year: int
    poster_url: str

    @model_validator(mode="after")
    def postprocess_poster_url(self) -> Self:
        if not self.poster_url.startswith("http"):
            self.poster_url = f"{settings.BASE_POSTER_URL}{self.poster_url}"
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

    model_config = {"use_enum_values": True}

    @model_validator(mode="after")
    def postprocess_poster_url(self) -> Self:
        return super().postprocess_poster_url()
