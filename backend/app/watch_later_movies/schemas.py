from datetime import datetime

from app.movies.schemas import SMovieRead
from app.schemas.base import BaseSchema


class SWatchLaterMovieCreate(BaseSchema):
    movie_id: int


class SWatchLaterMovieRead(BaseSchema):
    movie: SMovieRead
    created_at: datetime
