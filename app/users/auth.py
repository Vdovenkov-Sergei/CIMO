from datetime import UTC, datetime, timedelta
from typing import Optional
from fastapi import HTTPException
from passlib.context import CryptContext
from jose import jwt
from pydantic import EmailStr

from app.config import settings
from app.users.dao import UserDAO
from app.users.models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_jwt_token(data: dict, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire_time = datetime.now(UTC) + expires_delta
    to_encode.update({"exp": int(expire_time.timestamp())})
    jwt_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return jwt_token


async def authenticate_by_email(email: EmailStr, password: str) -> Optional[User]:
    user = await UserDAO.find_one_or_none(email=email)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return user


async def authenticate_by_username(user_name: str, password: str) -> Optional[User]:
    user = await UserDAO.find_one_or_none(user_name=user_name)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    return user
