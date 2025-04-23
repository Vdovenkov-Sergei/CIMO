from pydantic import BaseModel

from app.movie_roles.models import RoleType
from app.people.schemas import SPersonRead


class SMovieRoleRead(BaseModel):
    person: SPersonRead
    role: RoleType

    model_config = {"use_enum_values": True}
