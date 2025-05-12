from datetime import datetime
import re

from pydantic import EmailStr, Field, field_validator

from app.schemas.base import BaseSchema
from app.users.utils import (
    MAX_PASSWORD_LEN,
    MAX_USERNAME_LEN,
    MIN_PASSWORD_LEN,
    MIN_USERNAME_LEN,
    VERIFICATION_CODE_LEN,
)

USERNAME_REGEX = r"^[a-zA-Z0-9_.]+$"


class SUserAuth(BaseSchema):
    login: str
    password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LEN,
        max_length=MAX_PASSWORD_LEN,
        description=f"Password must be {MIN_PASSWORD_LEN}-{MAX_PASSWORD_LEN} length",
    )


class SUserRegisterEmail(BaseSchema):
    email: EmailStr
    password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LEN,
        max_length=MAX_PASSWORD_LEN,
        description=f"Password must be {MIN_PASSWORD_LEN}-{MAX_PASSWORD_LEN} length",
    )


class SUserVerification(BaseSchema):
    email: EmailStr
    code: str = Field(
        ...,
        pattern=r"^[A-Z0-9]+$",
        min_length=VERIFICATION_CODE_LEN,
        max_length=VERIFICATION_CODE_LEN,
        description=f"Code must be {VERIFICATION_CODE_LEN} length, can contain A-Z0-9",
    )


class SUserRegisterUsername(BaseSchema):
    user_id: int = Field(..., gt=0, description="User ID must be a positive integer")
    user_name: str = Field(
        ...,
        pattern=USERNAME_REGEX,
        min_length=MIN_USERNAME_LEN,
        max_length=MAX_USERNAME_LEN,
        description=f"Username must be {MIN_USERNAME_LEN}-{MAX_USERNAME_LEN} length, can contain a-zA-Z0-9_.",
    )

    @field_validator("user_name")
    def not_reserved_username(cls, v):
        if re.fullmatch(r"user_\d+", v):
            raise ValueError("Usernames like 'user_\d+' are not allowed")
        return v


class SUserResetPassword(BaseSchema):
    email: EmailStr


class SUserVerifyPassword(BaseSchema):
    token: str
    new_password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LEN,
        max_length=MAX_PASSWORD_LEN,
        description=f"Password must be {MIN_PASSWORD_LEN}-{MAX_PASSWORD_LEN} length",
    )


class SUserRead(BaseSchema):
    id: int
    email: EmailStr
    user_name: str
    created_at: datetime


class SUserUpdate(BaseSchema):
    user_name: str = Field(
        pattern=USERNAME_REGEX,
        min_length=MIN_USERNAME_LEN,
        max_length=MAX_USERNAME_LEN,
        description=f"Username must be {MIN_USERNAME_LEN}-{MAX_USERNAME_LEN} length, can contain a-zA-Z0-9_.",
    )

    @field_validator("user_name")
    def not_reserved_username(cls, v):
        if re.fullmatch(r"user_\d+", v):
            raise ValueError("usernames like 'user_123' are not allowed")
        return v
