from datetime import datetime

from pydantic import EmailStr, Field

from app.schemas.base import BaseSchema
from app.users.utils import VERIFICATION_CODE_LEN

USERNAME_REGEX = r"^[a-zA-Z0-9_.]+$"


class SUserAuth(BaseSchema):
    login: str
    password: str = Field(..., min_length=8, max_length=24, description="Password must be 8-24 length")


class SUserRegisterEmail(BaseSchema):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=24, description="Password must be 8-24 length")


class SUserVerification(BaseSchema):
    email: EmailStr
    code: str = Field(
        ...,
        pattern=r"^[A-Z0-9]+$",
        min_length=VERIFICATION_CODE_LEN,
        max_length=VERIFICATION_CODE_LEN,
        description="Code must be 6 length, can contain A-Z0-9",
    )


class SUserRegisterUsername(BaseSchema):
    user_id: int = Field(..., gt=0, description="User ID must be a positive integer")
    user_name: str = Field(
        ...,
        pattern=USERNAME_REGEX,
        min_length=5,
        max_length=30,
        description="Username must be 5-30 length, can contain a-zA-Z0-9_.",
    )


class SUserResetPassword(BaseSchema):
    email: EmailStr


class SUserVerifyPassword(BaseSchema):
    token: str
    new_password: str = Field(..., min_length=8, max_length=24, description="Password must be 8-24 length")


class SUserRead(BaseSchema):
    id: int
    email: EmailStr
    user_name: str
    created_at: datetime


class SUserUpdate(BaseSchema):
    user_name: str = Field(
        pattern=USERNAME_REGEX,
        min_length=5,
        max_length=30,
        description="Username must be 5-30 length, can contain a-zA-Z0-9_.",
    )
