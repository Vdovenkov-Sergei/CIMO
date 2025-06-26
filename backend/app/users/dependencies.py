from typing import Optional
from fastapi import Cookie

from app.exceptions import UserIsNotPresentException, UserNotFoundException
from app.logger import logger
from app.users.auth import check_jwt_token
from app.users.dao import UserDAO
from app.users.models import User
from app.config import settings


def get_cookie_params() -> dict[str, Optional[str | bool]]:
    return {
        "httponly": True,
        "secure": settings.MODE == "PROD",
        "samesite": "None" if settings.MODE == "PROD" else "Lax",
        "domain": settings.COOKIE_DOMAIN if settings.MODE == "PROD" else None,
    }


async def get_current_user(access_token: str = Cookie(include_in_schema=False, default=None)) -> User:
    payload = check_jwt_token(access_token)

    user_id = payload.get("sub")
    if not user_id:
        logger.warning("User ID not found in token.")
        raise UserIsNotPresentException

    logger.debug("User ID extracted from token.", extra={"user_id": user_id})
    user = await UserDAO.find_user_by_id(user_id=int(user_id))
    if not user:
        raise UserNotFoundException

    return user
