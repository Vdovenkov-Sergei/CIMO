import re
from datetime import datetime

from pydantic import EmailStr, Field, field_validator

from app.constants import Validation, Verification
from app.schemas.base import BaseSchema


class SUserAuth(BaseSchema):
    login: str
    password: str = Field(
        ...,
        min_length=Validation.MIN_PASSWORD_LEN,
        max_length=Validation.MAX_PASSWORD_LEN,
        description=f"Password must be {Validation.MIN_PASSWORD_LEN}-{Validation.MAX_PASSWORD_LEN} length",
    )


class SUserRegisterEmail(BaseSchema):
    email: EmailStr
    password: str = Field(
        ...,
        min_length=Validation.MIN_PASSWORD_LEN,
        max_length=Validation.MAX_PASSWORD_LEN,
        description=f"Password must be {Validation.MIN_PASSWORD_LEN}-{Validation.MAX_PASSWORD_LEN} length",
    )


class SUserVerification(BaseSchema):
    email: EmailStr
    code: str = Field(
        ...,
        pattern=rf"^[A-Z0-9]{Verification.CODE_LENGTH}$",
        description=f"Code must be {Verification.CODE_LENGTH} length, can contain A-Z0-9",
    )


class SUserRegisterUsername(BaseSchema):
    user_id: int = Field(..., gt=0, description="User ID must be a positive integer")
    user_name: str = Field(
        ...,
        pattern=Validation.USERNAME_REGEX,
        min_length=Validation.MIN_USERNAME_LEN,
        max_length=Validation.MAX_USERNAME_LEN,
        description=(
            f"Username must be {Validation.MIN_USERNAME_LEN}-{Validation.MAX_USERNAME_LEN} length, "
            "can contain a-zA-Z0-9_."
        ),
    )

    @field_validator("user_name")
    def not_reserved_username(cls, v: str) -> str:
        if re.fullmatch(r"user_\d+", v):
            raise ValueError(r"Usernames like 'user_\d+' are not allowed")
        return v


class SUserResetPassword(BaseSchema):
    email: EmailStr


class SUserVerifyPassword(BaseSchema):
    token: str
    new_password: str = Field(
        ...,
        min_length=Validation.MIN_PASSWORD_LEN,
        max_length=Validation.MAX_PASSWORD_LEN,
        description=f"Password must be {Validation.MIN_PASSWORD_LEN}-{Validation.MAX_PASSWORD_LEN} length",
    )


class SUserRead(BaseSchema):
    id: int
    email: EmailStr
    user_name: str
    created_at: datetime


class SUserUpdate(BaseSchema):
    user_name: str = Field(
        ...,
        pattern=Validation.USERNAME_REGEX,
        min_length=Validation.MIN_USERNAME_LEN,
        max_length=Validation.MAX_USERNAME_LEN,
        description=(
            f"Username must be {Validation.MIN_USERNAME_LEN}-{Validation.MAX_USERNAME_LEN} length, "
            "can contain a-zA-Z0-9_."
        ),
    )

    @field_validator("user_name")
    def not_reserved_username(cls, v: str) -> str:
        if re.fullmatch(r"user_\d+", v):
            raise ValueError(r"usernames like 'user_\d+' are not allowed")
        return v
