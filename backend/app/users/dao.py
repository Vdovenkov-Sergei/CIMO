from typing import Optional

from app.dao.base import BaseDAO
from app.users.models import User


class UserDAO(BaseDAO):
    model = User

    @classmethod
    async def get_by_login(cls, login: str) -> Optional[User]:
        user = await cls.find_one_or_none(filters=[cls.model.email == login]) or await cls.find_one_or_none(
            filters=[cls.model.user_name == login]
        )
        return user  # type: ignore
