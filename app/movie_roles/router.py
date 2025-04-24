from fastapi import APIRouter

from app.movie_roles.dao import MovieRoleDAO
from app.movie_roles.schemas import SMovieRoleRead

router = APIRouter(prefix="/movie/roles", tags=["Movie Roles"])


@router.get("/{movie_id}", response_model=list[SMovieRoleRead])
async def get_movie_roles(movie_id: int, limit: int = 20, offset: int = 0) -> list[SMovieRoleRead]:
    roles = await MovieRoleDAO.get_movie_roles(movie_id=movie_id, limit=limit, offset=offset)
    return [SMovieRoleRead.model_validate(role) for role in roles]
