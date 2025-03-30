from datetime import UTC, datetime
from fastapi import Depends, Request
from jose import jwt, JWTError

from app.config import settings
from app.exceptions import IncorrectTokenFormatException, TokenExpiredException, TokenNotFoundException, UserIsNotPresentException
from app.users.dao import UserDAO


def get_token(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise TokenNotFoundException
    return token


async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
    except JWTError:
        raise IncorrectTokenFormatException

    expire = payload.get("exp")
    if expire and expire < int(datetime.now(UTC).timestamp()):
        raise TokenExpiredException
    
    user_id = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException

    user = await UserDAO.find_by_id(model_id=int(user_id))
    if not user:
        raise UserIsNotPresentException

    return user
