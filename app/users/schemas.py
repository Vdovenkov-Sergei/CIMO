from pydantic import BaseModel, EmailStr, Field


class SUserAuth(BaseModel):
    login: str
    password: str


class SUserRegisterEmail(BaseModel):
    email: EmailStr
    password: str


class SUserVerification(BaseModel):
    email: EmailStr
    code: str


class SUserRegisterUsername(BaseModel):
    user_id: int
    user_name: str = Field(..., pattern=r"^[a-zA-Z0-9_.]+$", min_length=5, max_length=30)
