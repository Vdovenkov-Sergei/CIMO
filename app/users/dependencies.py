from fastapi import Cookie
from sqlalchemy import RowMapping

from app.exceptions import UserIsNotPresentException
from app.users.auth import check_jwt_token
from app.users.dao import UserDAO


async def get_current_user(access_token: str = Cookie(None, include_in_schema=False)) -> RowMapping:
    payload = check_jwt_token(access_token)

    user_id = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException

    user = await UserDAO.find_by_id(model_id=int(user_id))
    if not user:
        raise UserIsNotPresentException

    return user
