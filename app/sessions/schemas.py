import uuid
from datetime import datetime
from typing import Optional

from app.schemas.base import BaseSchema
from app.sessions.models import SessionStatus


class SSessionCreate(BaseSchema):
    is_pair: bool = False


class SSessionUpdate(BaseSchema):
    status: SessionStatus


class SSessionRead(BaseSchema):
    id: uuid.UUID
    user_id: int
    created_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    status: SessionStatus
    is_pair: bool
