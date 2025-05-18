from datetime import UTC, datetime, timedelta
from typing import Any, Optional

from jose import ExpiredSignatureError, JWTError, jwt

from app.config import settings
from app.constants import RedisKeys, Verification
from app.database import redis_client
from app.exceptions import (
    IncorrectLoginOrPasswordException,
    IncorrectTokenFormatException,
    InvalidVerificationCodeException,
    MaxAttemptsEnterCodeException,
    NotSuperUserException,
    TokenExpiredException,
    TokenNotFoundException,
    VerificationCodeExpiredException,
)
from app.logger import logger
from app.users.dao import UserDAO
from app.users.models import User
from app.users.schemas import SUserVerification
from app.users.utils import Hashing


def create_jwt_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    to_encode = data.copy()
    expire_time = datetime.now(UTC) + expires_delta
    to_encode.update({"exp": int(expire_time.timestamp())})
    jwt_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    logger.debug("JWT token created successfully.")
    return jwt_token  # type: ignore


def check_jwt_token(token: Optional[str]) -> dict[str, Any]:
    if token is None:
        logger.warning("JWT token not found.")
        raise TokenNotFoundException
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        logger.debug("JWT token decoded correctly.")
    except ExpiredSignatureError:
        logger.warning("JWT token expired.")
        raise TokenExpiredException
    except JWTError:
        logger.warning("JWT token format is incorrect.")
        raise IncorrectTokenFormatException

    return payload  # type: ignore


async def authenticate_user(login: str, password: str) -> User:
    user = await UserDAO.find_by_login(login=login)
    if not user or not Hashing.verify_password(password, user.hashed_password):
        logger.warning("Authentication failed.", extra={"login": login})
        raise IncorrectLoginOrPasswordException

    logger.info("User authenticated.", extra={"user_id": user.id, "login": login})
    return user


async def authenticate_superuser(login: str, password: str) -> User:
    user = await UserDAO.find_by_login(login=login)
    if not user or not Hashing.verify_password(password, user.hashed_password):
        logger.warning("Authentication failed.", extra={"login": login})
        raise IncorrectLoginOrPasswordException
    if not user.is_superuser:
        logger.warning("User is not a superuser.", extra={"login": login})
        raise NotSuperUserException

    logger.info("Superuser authenticated.", extra={"user_id": user.id, "login": login})
    return user


async def check_verification_code(user_data: SUserVerification) -> None:
    email, code = user_data.email, user_data.code
    attempts_key = RedisKeys.ATTEMPTS_ENTER_KEY.format(email=email)
    code_key = RedisKeys.CODE_VERIFY_KEY.format(email=email)

    attempts = await redis_client.get(attempts_key)
    stored_code = await redis_client.get(code_key)
    if not stored_code:
        logger.warning("Verification code not found.", extra={"email": email})
        raise VerificationCodeExpiredException
    if attempts and int(attempts) >= Verification.MAX_ATTEMPTS_ENTER:
        await redis_client.delete(code_key)
        await redis_client.delete(attempts_key)
        logger.warning("Max attempts to enter verification code exceeded.", extra={"email": email})
        raise MaxAttemptsEnterCodeException
    if stored_code != code:
        await redis_client.incr(attempts_key)
        logger.warning("Incorrect verification code.", extra={"email": email})
        raise InvalidVerificationCodeException

    logger.debug("Verification code validated successfully.", extra={"email": email})
