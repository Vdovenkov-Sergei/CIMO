from pydantic import BaseModel, Field
from datetime import datetime

from app.movies.schemas import SMovieRead


class SViewedMovieCreate(BaseModel):
    movie_id: int
    review: int = Field(..., ge=1, le=10, description="Rating must be between 1 and 10")


class SViewedMovieRead(BaseModel):
    movie: SMovieRead
    review: int = Field(..., ge=1, le=10, description="Rating between 1 and 10")
    created_at: datetime
