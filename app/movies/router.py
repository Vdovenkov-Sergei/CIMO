from fastapi import APIRouter

from app.exceptions import MovieNotFoundException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieDetailedRead, SMovieRead


router = APIRouter(prefix="/movies", tags=["Movies"])


@router.get("/{movie_id}")
async def get_movie(movie_id: int) -> SMovieRead:
    movie = await MovieDAO.find_by_id(model_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return movie


@router.get("/{movie_id}/detailed")
async def get_detailed_movie(movie_id: int) -> SMovieDetailedRead:
    movie = await MovieDAO.find_movie_with_roles(movie_id=movie_id)
    if not movie:
        raise MovieNotFoundException(movie_id=movie_id)
    return movie
