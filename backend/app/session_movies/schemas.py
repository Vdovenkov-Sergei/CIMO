from datetime import datetime

from app.movies.schemas import SMovieRead
from app.schemas.base import BaseSchema


class SSessionMovieRead(BaseSchema):
    movie: SMovieRead
    is_matched: bool


class SSessionMovieCreate(BaseSchema):
    movie_id: int
    is_liked: bool
    is_open_full_info: bool
    time_swiped: int


class MatchNotification(BaseSchema):
    movie: SMovieRead
    match_time: datetime
