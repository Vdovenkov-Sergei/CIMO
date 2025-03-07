from app.dao.base import BaseDAO
from app.people.models import Person


class PersonDAO(BaseDAO):
    model = Person
