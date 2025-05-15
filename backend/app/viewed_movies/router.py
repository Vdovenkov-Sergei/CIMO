from fastapi import APIRouter, Depends

from app.config import settings
from app.users.dependencies import get_current_user
from app.users.models import User
from app.viewed_movies.dao import ViewedMovieDAO
from app.viewed_movies.schemas import SViewedMovieCreate, SViewedMovieRead, SViewedMovieUpdate

router = APIRouter(prefix="/movies/viewed", tags=["Viewed Movies"])


@router.post("/", response_model=dict[str, str])
async def add_to_viewed_list(data: SViewedMovieCreate, user: User = Depends(get_current_user)) -> dict[str, str]:
    existing_movie = await ViewedMovieDAO.find_by_user_movie_id(user_id=user.id, movie_id=data.movie_id)
    if existing_movie:
        await ViewedMovieDAO.update_movie(user_id=user.id, movie_id=data.movie_id, update_data={"review": data.review})
        return {"message": "The movie review was successfully updated."}

    await ViewedMovieDAO.add_movie(user_id=user.id, movie_id=data.movie_id, review=data.review)
    return {"message": "The movie was successfully added."}


@router.get("/", response_model=list[SViewedMovieRead])
async def get_viewed_list(
    limit: int = settings.DEFAULT_PAG_LIMIT,
    offset: int = settings.DEFAULT_PAG_OFFSET,
    order_review: bool = False,
    user: User = Depends(get_current_user),
) -> list[SViewedMovieRead]:
    movies = await ViewedMovieDAO.find_movies(user_id=user.id, limit=limit, offset=offset, order_review=order_review)
    return [SViewedMovieRead.model_validate(movie) for movie in movies]


@router.delete("/{movie_id}", response_model=dict[str, str])
async def delete_from_viewed_list(movie_id: int, user: User = Depends(get_current_user)) -> dict[str, str]:
    await ViewedMovieDAO.delete_movie(user_id=user.id, movie_id=movie_id)
    return {"message": "The movie was successfully deleted."}


@router.patch("/{movie_id}", response_model=dict[str, str])
async def update_viewed_list(
    movie_id: int, data: SViewedMovieUpdate, user: User = Depends(get_current_user)
) -> dict[str, str]:
    await ViewedMovieDAO.update_movie(user_id=user.id, movie_id=movie_id, update_data=data.model_dump())
    return {"message": "The review was successfully updated."}
