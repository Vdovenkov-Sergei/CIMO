from pydantic import BaseModel
from datetime import datetime

from app.movies.schemas import SMovieRead


class SWatchLaterMovieCreate(BaseModel):
    movie_id: int


class SWatchLaterMovieRead(BaseModel):
    movie: SMovieRead
    created_at: datetime
