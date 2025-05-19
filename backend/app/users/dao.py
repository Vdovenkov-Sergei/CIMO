from typing import Any, Optional

from pydantic import EmailStr
from sqlalchemy import or_

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_add, log_db_find_one, log_db_update
from app.users.models import User


class UserDAO(BaseDAO[User]):
    model = User

    @classmethod
    @log_db_find_one("Fetch user (by login)")
    async def find_by_login(cls, *, login: str) -> Optional[User]:
        return await cls.find_one_or_none(filters=[or_(cls.model.email == login, cls.model.user_name == login)])

    @classmethod
    @log_db_find_one("Fetch user (by id)")
    async def find_user_by_id(cls, *, user_id: int) -> Optional[User]:
        return await cls.find_by_id(user_id)

    @classmethod
    @log_db_find_one("Fetch user (by email)")
    async def find_by_email(cls, *, email: EmailStr) -> Optional[User]:
        return await cls.find_one_or_none(filters=[cls.model.email == email])

    @classmethod
    @log_db_find_one("Fetch user (by user_name)")
    async def find_by_user_name(cls, *, user_name: str) -> Optional[User]:
        return await cls.find_one_or_none(filters=[cls.model.user_name == user_name])

    @classmethod
    @log_db_add("Add user")
    async def add_user(cls, *, email: EmailStr, hashed_password: str) -> User:
        return await cls.add_record(email=email, hashed_password=hashed_password)

    @classmethod
    @log_db_update("Update user")
    async def update_user(cls, *, user_id: int, update_data: dict[str, Any]) -> int:
        return await cls.update_record(filters=[cls.model.id == user_id], update_data=update_data)
