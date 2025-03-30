from datetime import UTC, datetime, timedelta
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import RowMapping

from app.config import settings
from app.exceptions import (
    IncorrectLoginOrPasswordException,
    IncorrectTokenFormatException,
    TokenExpiredException,
    TokenNotFoundException,
)
from app.users.dao import UserDAO
from app.users.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)  # type: ignore


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)  # type: ignore


def create_jwt_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire_time = datetime.now(UTC) + expires_delta
    to_encode.update({"exp": int(expire_time.timestamp())})
    jwt_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return jwt_token  # type: ignore


def check_jwt_token(token: Optional[str]) -> dict[str, Any]:
    if not token:
        raise TokenNotFoundException
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
    except JWTError:
        raise IncorrectTokenFormatException

    expire = payload.get("exp")
    if expire and expire < int(datetime.now(UTC).timestamp()):
        raise TokenExpiredException

    return payload  # type: ignore


async def authenticate_user(login: str, password: str) -> RowMapping:
    user = await UserDAO.find_one_or_none(filters=[User.email == login]) or await UserDAO.find_one_or_none(
        filters=[User.user_name == login]
    )
    if not user or not verify_password(password, user.hashed_password):
        raise IncorrectLoginOrPasswordException
    return user
