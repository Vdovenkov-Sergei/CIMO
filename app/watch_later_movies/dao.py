from datetime import datetime, UTC
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dao.base import MovieBaseDAO
from app.watch_later_movies.models import WatchLaterMovie
from app.watch_later_movies.schemas import WatchLaterCreate


class WatchLaterMovieDAO(MovieBaseDAO):
    @staticmethod
    async def create(session: AsyncSession, data: WatchLaterCreate) -> WatchLaterMovie:
        new_movie = WatchLaterMovie(
            user_id=data.user_id,
            movie_id=data.movie_id,
            created_at=datetime.now(UTC)
        )
        session.add(new_movie)
        await session.commit()
        await session.refresh(new_movie)
        return new_movie

    @staticmethod
    async def get_by_user(session: AsyncSession, user_id: int) -> Sequence[WatchLaterMovie]:
        result = await session.execute(select(WatchLaterMovie).where(WatchLaterMovie.user_id == user_id))
        return result.scalars().all()
