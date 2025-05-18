from fastapi import Depends

from app.exceptions import UserNotInSessionException
from app.sessions.dao import SessionDAO
from app.sessions.models import Session
from app.users.dependencies import get_current_user
from app.users.models import User


async def get_current_session(user: User = Depends(get_current_user)) -> Session:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)
    return session  # type: ignore
