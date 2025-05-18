from fastapi import APIRouter
from fastapi_cache.decorator import cache

from app.config import settings
from app.exceptions import MovieNotFoundException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieDetailedRead, SMovieRead

router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/{movie_id}", response_model=SMovieRead)
@cache(expire=settings.CACHE_TTL)
async def get_movie(movie_id: int) -> SMovieRead:
    movie = await MovieDAO.find_movie_by_id(movie_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return SMovieRead.model_validate(movie)


@router.get("/{movie_id}/detailed", response_model=SMovieDetailedRead)
@cache(expire=settings.CACHE_TTL)
async def get_detailed_movie(movie_id: int) -> SMovieDetailedRead:
    movie = await MovieDAO.find_movie_by_id(movie_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return SMovieDetailedRead.model_validate(movie)
