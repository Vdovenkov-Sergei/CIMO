from fastapi import APIRouter
from fastapi_cache.decorator import cache

from app.config import settings
from app.exceptions import PersonNotFoundException
from app.people.dao import PersonDAO
from app.people.schemas import SPersonRead

router = APIRouter(prefix="/people", tags=["People"])


@router.get("/{person_id}", response_model=SPersonRead)
@cache(expire=settings.CACHE_TTL)
async def get_person(person_id: int) -> SPersonRead:
    person = await PersonDAO.find_person_by_id(person_id=person_id)
    if not person:
        raise PersonNotFoundException(person_id=person_id)
    return SPersonRead.model_validate(person)
