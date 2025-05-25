from fastapi import APIRouter
from fastapi_cache.decorator import cache

from app.config import settings
from app.constants import Pagination
from app.movie_roles.dao import MovieRoleDAO
from app.movie_roles.schemas import SMovieRoleRead

router = APIRouter(prefix="/movie/roles", tags=["Movie Roles"])


@router.get("/{movie_id}", response_model=list[SMovieRoleRead])
@cache(expire=settings.CACHE_TTL)
async def get_movie_roles(
    movie_id: int, limit: int = Pagination.PAG_LIMIT, offset: int = Pagination.PAG_OFFSET
) -> list[SMovieRoleRead]:
    roles = await MovieRoleDAO.get_movie_roles(movie_id=movie_id, limit=limit, offset=offset)
    return [SMovieRoleRead.model_validate(role) for role in roles]
