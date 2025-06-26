import re
from datetime import datetime

from pydantic import EmailStr, Field, field_validator

from app.constants import Validation
from app.schemas.base import BaseSchema


class SUserAuth(BaseSchema):
    login: str
    password: str = Field(..., min_length=Validation.MIN_PASSWORD_LEN)


class SUserRegisterEmail(BaseSchema):
    email: EmailStr
    password: str = Field(..., min_length=Validation.MIN_PASSWORD_LEN)


class SUserVerification(BaseSchema):
    email: EmailStr
    code: str


class SUserResendVerification(BaseSchema):
    email: EmailStr


class SUserRegisterUsername(BaseSchema):
    user_id: int
    user_name: str = Field(..., min_length=Validation.MIN_USERNAME_LEN)

    @field_validator("user_name")
    def not_reserved_username(cls, v: str) -> str:
        if re.fullmatch(r"user_\d+", v):
            raise ValueError(r"Usernames like 'user_\d+' are not allowed")
        return v


class SUserResetPassword(BaseSchema):
    email: EmailStr


class SUserVerifyPassword(BaseSchema):
    token: str
    new_password: str = Field(..., min_length=Validation.MIN_PASSWORD_LEN)


class SUserRead(BaseSchema):
    id: int
    email: EmailStr
    user_name: str
    created_at: datetime


class SUserUpdate(BaseSchema):
    user_name: str = Field(..., min_length=Validation.MIN_USERNAME_LEN)

    @field_validator("user_name")
    def not_reserved_username(cls, v: str) -> str:
        if re.fullmatch(r"user_\d+", v):
            raise ValueError(r"Usernames like 'user_\d+' are not allowed")
        return v
