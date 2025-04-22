from pydantic import BaseModel
from datetime import datetime


class ChatCreate(BaseModel):
    user_id: int
    bot_name: str


class ChatRead(BaseModel):
    id: int
    user_id: int
    bot_name: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
