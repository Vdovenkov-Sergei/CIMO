from datetime import datetime

from pydantic import field_validator

from app.messages.models import SenderType
from app.schemas.base import BaseSchema


class SMessageCreate(BaseSchema):
    sender: SenderType
    content: str

    @field_validator("content")
    @classmethod
    def content_must_not_be_blank(cls, content: str) -> str:
        if not content.strip():
            raise ValueError("Message content cannot be empty or just whitespace")
        return content


class SMessageRead(BaseSchema):
    id: int
    chat_id: int
    created_at: datetime
    sender: SenderType
    content: str
