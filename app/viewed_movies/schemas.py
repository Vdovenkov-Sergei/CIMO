from pydantic import BaseModel
from datetime import datetime


class ViewedMovieCreate(BaseModel):
    movie_id: int
    review: int


class ViewedMovieRead(BaseModel):
    user_id: int
    movie_id: int
    review: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
