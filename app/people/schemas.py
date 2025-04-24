from typing import Optional, Self

from pydantic import model_validator

from app.config import settings
from app.schemas.base import BaseSchema


class SPersonRead(BaseSchema):
    id: int
    name: str
    photo_url: Optional[str] = None

    @model_validator(mode="after")
    def postprocess_photo_url(self) -> Self:
        if self.photo_url and not self.photo_url.startswith("http"):
            self.photo_url = f"{settings.BASE_PHOTO_URL}{self.photo_url}"
        return self
