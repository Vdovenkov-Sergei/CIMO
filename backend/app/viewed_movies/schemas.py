from datetime import datetime

from pydantic import Field

from app.movies.schemas import SMovieRead
from app.schemas.base import BaseSchema


class SViewedMovieCreate(BaseSchema):
    movie_id: int
    review: int = Field(..., ge=1, le=10, description="Rating must be between 1 and 10")


class SViewedMovieRead(BaseSchema):
    movie: SMovieRead
    review: int = Field(..., ge=1, le=10, description="Rating between 1 and 10")
    created_at: datetime


class SViewedMovieUpdate(BaseSchema):
    review: int = Field(..., ge=1, le=10, description="Rating must be between 1 and 10")
