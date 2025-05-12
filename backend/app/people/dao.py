from typing import Optional

from app.dao.base import BaseDAO
from app.dao.decorators import log_db_find_one
from app.people.models import Person


class PersonDAO(BaseDAO):
    model = Person

    @classmethod
    @log_db_find_one("Fetch person")
    async def find_person_by_id(cls, *, person_id: int) -> Optional[Person]:
        return await cls.find_by_id(person_id)
