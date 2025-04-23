from fastapi import APIRouter
from fastapi_cache.decorator import cache

from app.exceptions import MovieNotFoundException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieDetailedRead, SMovieRead

router = APIRouter(prefix="/movies", tags=["Movies"])


async def get_movie_by_id(movie_id: int):
    movie = await MovieDAO.find_by_id(movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return movie


@router.get("/{movie_id}")
@cache(expire=120)
async def get_movie(movie_id: int) -> SMovieRead:
    movie = await get_movie_by_id(movie_id)
    return SMovieRead.model_validate(movie)


@router.get("/{movie_id}/detailed")
@cache(expire=120)
async def get_detailed_movie(movie_id: int) -> SMovieDetailedRead:
    movie = await get_movie_by_id(movie_id)
    return SMovieDetailedRead.model_validate(movie)
