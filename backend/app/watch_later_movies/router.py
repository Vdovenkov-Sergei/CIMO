from fastapi import APIRouter, Depends

from app.config import settings
from app.users.dependencies import get_current_user
from app.users.models import User
from app.watch_later_movies.dao import WatchLaterMovieDAO
from app.watch_later_movies.schemas import SWatchLaterMovieCreate, SWatchLaterMovieRead

from app.logger import logger

router = APIRouter(prefix="/movies/later", tags=["Watch Later Movies"])


@router.post("/", response_model=dict[str, str])
async def add_to_watch_later_list(
    data: SWatchLaterMovieCreate, user: User = Depends(get_current_user)
) -> dict[str, str]:
    existing_movie = await WatchLaterMovieDAO.find_by_user_movie_id(user_id=user.id, movie_id=data.movie_id)
    if existing_movie:
        logger.warning(
            "Movie already exists in watch later list.", extra={"user_id": user.id, "movie_id": data.movie_id}
        )
        return {"message": "The movie is already in the watch later list."}

    await WatchLaterMovieDAO.add_movie(user_id=user.id, movie_id=data.movie_id)
    return {"message": "The movie was successfully added."}


@router.get("/", response_model=list[SWatchLaterMovieRead])
async def get_watch_later_list(
    limit: int = settings.DEFAULT_PAG_LIMIT,
    offset: int = settings.DEFAULT_PAG_OFFSET,
    user: User = Depends(get_current_user),
) -> list[SWatchLaterMovieRead]:
    movies = await WatchLaterMovieDAO.find_movies(user_id=user.id, limit=limit, offset=offset)
    return [SWatchLaterMovieRead.model_validate(movie) for movie in movies]


@router.delete("/{movie_id}", response_model=dict[str, str])
async def delete_from_watch_later_list(movie_id: int, user: User = Depends(get_current_user)) -> dict[str, str]:
    await WatchLaterMovieDAO.delete_movie(user_id=user.id, movie_id=movie_id)
    return {"message": "The movie was successfully deleted."}
