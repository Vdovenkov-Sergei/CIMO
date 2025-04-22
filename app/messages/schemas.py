from pydantic import BaseModel
from datetime import datetime

from app.messages.models import SenderType


class MessageCreate(BaseModel):
    chat_id: int
    sender: SenderType
    content: str


class MessageRead(BaseModel):
    id: int
    chat_id: int
    created_at: datetime
    sender: SenderType
    content: str

    model_config = {
        "from_attributes": True
    }
