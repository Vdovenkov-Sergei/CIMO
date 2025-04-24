from datetime import UTC, datetime, timedelta
from typing import Any, Optional

from jose import ExpiredSignatureError, JWTError, jwt

from app.config import settings
from app.database import redis_client
from app.exceptions import (
    IncorrectLoginOrPasswordException,
    IncorrectTokenFormatException,
    InvalidVerificationCodeException,
    MaxAttemptsEnterCodeException,
    TokenExpiredException,
    TokenNotFoundException,
    VerificationCodeExpiredException,
)
from app.users.dao import UserDAO
from app.users.models import User
from app.users.schemas import SUserVerification
from app.users.utils import ATTEMPTS_ENTER_KEY, CODE_VERIFY_KEY, MAX_ATTEMPTS_ENTER, Hashing


def create_jwt_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire_time = datetime.now(UTC) + expires_delta
    to_encode.update({"exp": int(expire_time.timestamp())})
    jwt_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return jwt_token  # type: ignore


def check_jwt_token(token: Optional[str]) -> dict[str, Any]:
    if token is None:
        raise TokenNotFoundException
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
    except ExpiredSignatureError:
        raise TokenExpiredException
    except JWTError:
        raise IncorrectTokenFormatException

    return payload  # type: ignore


async def authenticate_user(login: str, password: str) -> User:
    user = await UserDAO.find_one_or_none(filters=[User.email == login]) or await UserDAO.find_one_or_none(
        filters=[User.user_name == login]
    )
    if not user or not Hashing.verify_password(password, user.hashed_password):
        raise IncorrectLoginOrPasswordException
    return user


async def check_verification_code(user_data: SUserVerification) -> None:
    email, code = user_data.email, user_data.code
    attempts_key, code_key = ATTEMPTS_ENTER_KEY.format(email=email), CODE_VERIFY_KEY.format(email=email)

    attempts = await redis_client.get(attempts_key)
    stored_code = await redis_client.get(code_key)
    if not stored_code:
        raise VerificationCodeExpiredException
    if attempts and int(attempts) >= MAX_ATTEMPTS_ENTER:
        await redis_client.delete(code_key)
        await redis_client.delete(attempts_key)
        raise MaxAttemptsEnterCodeException
    if stored_code != code:
        await redis_client.incr(attempts_key)
        raise InvalidVerificationCodeException
