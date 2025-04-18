from fastapi import Cookie
from sqlalchemy import RowMapping

from app.exceptions import UserIsNotPresentException, UserNotFoundException
from app.users.auth import check_jwt_token
from app.users.dao import UserDAO
from app.users.utils import ACCESS_TOKEN


async def get_current_user(access_token: str = Cookie(ACCESS_TOKEN, include_in_schema=False)) -> RowMapping:
    payload = check_jwt_token(access_token)

    user_id = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException

    user = await UserDAO.find_by_id(model_id=int(user_id))
    if not user:
        raise UserNotFoundException

    return user
