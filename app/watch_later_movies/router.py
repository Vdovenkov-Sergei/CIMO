from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.watch_later_movies.dao import WatchLaterMovieDAO
from app.watch_later_movies.schemas import WatchLaterRead, WatchLaterCreate

router_watch_later_movie = APIRouter(prefix="/watch_later_movies", tags=["Watch later movies"])


@router_watch_later_movie.post("/", response_model=WatchLaterRead)
async def add_to_watch_later(data: WatchLaterCreate, session: AsyncSession = Depends(get_session)):
    return await WatchLaterMovieDAO.create(session, data)


@router_watch_later_movie.get("/{user_id}", response_model=list[WatchLaterRead])
async def get_watch_later(user_id: int, session: AsyncSession = Depends(get_session)):
    return await WatchLaterMovieDAO.get_by_user(session, user_id)
