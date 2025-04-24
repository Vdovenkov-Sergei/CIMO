from datetime import datetime

from app.schemas.base import BaseSchema


class SChatRead(BaseSchema):
    id: int
    bot_name: str
    created_at: datetime
