from pydantic import BaseModel
from datetime import datetime


class WatchLaterCreate(BaseModel):
    user_id: int
    movie_id: int


class WatchLaterRead(BaseModel):
    user_id: int
    movie_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
