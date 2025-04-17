import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.sessions.models import SessionStatus


class SSessionCreate(BaseModel):
    is_pair: bool = False


class SStatusUpdate(BaseModel):
    status: SessionStatus

    model_config = {"use_enum_values": True}


class SSessionRead(BaseModel):
    id: uuid.UUID
    user_id: int
    created_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    status: SessionStatus
    is_pair: bool

    model_config = {"use_enum_values": True}
