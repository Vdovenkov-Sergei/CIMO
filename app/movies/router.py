from fastapi import APIRouter, Depends
from fastapi_cache.decorator import cache

from app.exceptions import MovieNotFoundException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieDetailedRead, SMovieRead
from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/{movie_id}")
@cache(expire=120)
async def get_movie(movie_id: int, _: User = Depends(get_current_user)) -> SMovieRead:
    movie = await MovieDAO.find_by_id(model_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return SMovieRead.model_validate(movie)


@router.get("/{movie_id}/detailed")
@cache(expire=120)
async def get_detailed_movie(movie_id: int, _: User = Depends(get_current_user)) -> SMovieDetailedRead:
    movie = await MovieDAO.find_movie_with_roles(movie_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return movie  # type: ignore
