from typing import Optional
from pydantic import BaseModel, Field, model_validator
from app.config import settings
from app.movie_roles.schemas import SMovieRoleRead
from app.movies.models import MovieType


class SMovieRead(BaseModel):
    id: int
    name: str
    release_year: int
    poster_url: str
    rating_kp: Optional[float]
    rating_imdb: Optional[float]

    @model_validator(mode="after")
    def postprocess_poster_url(self):
        if not self.poster_url.startswith("http"):
            self.poster_url = f"{settings.BASE_POSTER_URL}{self.poster_url}"
        return self


class SMovieDetailedRead(SMovieRead):
    type: MovieType
    description: Optional[str]
    runtime: Optional[int]
    age_rating: Optional[int]
    genres: Optional[list[str]]
    countries: Optional[list[str]]
    roles: list[SMovieRoleRead] = Field(default_factory=list)

    model_config = {"use_enum_values": True}
