from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache

from app.exceptions import PersonNotFoundException
from app.people.dao import PersonDAO
from app.people.schemas import SPersonRead
from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/people", tags=["People"])


@router.get("/{person_id}")
@cache(expire=120)
async def get_person(person_id: int, _: User = Depends(get_current_user)) -> SPersonRead:
    person = await PersonDAO.find_by_id(model_id=person_id)
    if not person:
        raise PersonNotFoundException(person_id=person_id)
    return SPersonRead.model_validate(person)
