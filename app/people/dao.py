from app.dao.base import BaseDAO
from app.movies.models import Person


class PersonDAO(BaseDAO):
    model = Person
