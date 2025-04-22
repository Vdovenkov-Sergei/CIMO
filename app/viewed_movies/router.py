from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dao.base import BaseDAO
from app.database import get_session
from app.users.dependencies import get_current_user
from app.users.models import User
from app.viewed_movies.dao import ViewedMovieDAO
from app.viewed_movies.schemas import ViewedMovieRead, ViewedMovieCreate

router_viewed_movie = APIRouter(prefix="/viewed_movies", tags=["Viewed movies"])


@router_viewed_movie.post("/", response_model=ViewedMovieRead)
async def add_viewed_movie(data: ViewedMovieCreate, user: User = Depends(get_current_user)):
    return await ViewedMovieDAO.add_record(user_id=user.id, movie_id=data.movie_id, review=data.review)


@router_viewed_movie.get("/", response_model=list[ViewedMovieRead])
async def get_viewed_movies(user_id: int, session: AsyncSession = Depends(get_current_user)):
    return await ViewedMovieDAO.get_by_user(session, user_id)
