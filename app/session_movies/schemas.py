from datetime import datetime

from pydantic import BaseModel

from app.movies.schemas import SMovieRead


class SSessionMovieRead(BaseModel):
    movie: SMovieRead
    is_matched: bool


class SSessionMovieCreate(BaseModel):
    movie_id: int
    is_liked: bool


class MatchNotification(BaseModel):
    movie: SMovieRead
    match_time: datetime
