from app.movie_roles.models import RoleType
from app.people.schemas import SPersonRead
from app.schemas.base import BaseSchema


class SMovieRoleRead(BaseSchema):
    person: SPersonRead
    role: RoleType
