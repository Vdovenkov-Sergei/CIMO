from typing import Optional, Self

from pydantic import BaseModel, model_validator

from app.config import settings


class SPersonRead(BaseModel):
    id: int
    name: str
    photo_url: Optional[str] = None

    @model_validator(mode="after")
    def postprocess_photo_url(self) -> Self:
        if self.photo_url and not self.photo_url.startswith("http"):
            self.photo_url = f"{settings.BASE_PHOTO_URL}{self.photo_url}"
        return self
