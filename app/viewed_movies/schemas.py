from pydantic import BaseModel
from datetime import datetime

from app.movies.schemas import SMovieRead


class SViewedMovieCreate(BaseModel):
    movie_id: int
    review: int


class SViewedMovieRead(BaseModel):
    movie: SMovieRead
    review: int
    created_at: datetime