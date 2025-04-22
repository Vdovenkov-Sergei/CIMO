from datetime import datetime, UTC
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dao.base import MovieBaseDAO
from app.viewed_movies.models import ViewedMovie
from app.viewed_movies.schemas import ViewedMovieCreate


class ViewedMovieDAO(MovieBaseDAO):
    @staticmethod
    async def create(session: AsyncSession, data: ViewedMovieCreate) -> ViewedMovie:
        new_movie = ViewedMovie(
            user_id=data.user_id,
            movie_id=data.movie_id,
            review=data.review,
            created_at=datetime.now(UTC)
        )
        session.add(new_movie)
        await session.commit()
        await session.refresh(new_movie)
        return new_movie

    @staticmethod
    async def get_by_user(session: AsyncSession, user_id: int) -> Sequence[ViewedMovie]:
        result = await session.execute(
            select(ViewedMovie)
            .where(ViewedMovie.user_id == user_id)
        )
        return result.scalars().all()
