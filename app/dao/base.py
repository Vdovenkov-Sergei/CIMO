from typing import Any, Optional, Sequence, Type

from sqlalchemy import RowMapping, and_, delete, insert, select, update

from app.database import Base, async_session_maker
from app.movies.models import Movie
from app.users.models import User


class BaseDAO:
    model: Type[Base]

    @classmethod
    async def find_one_or_none(cls, *, filters: list[Any], columns: Optional[list[Any]] = None) -> Optional[RowMapping]:
        selected_columns = columns if columns else cls.model.__table__.columns
        query = select(*selected_columns).where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def find_by_id(cls, *, model_id: int, columns: Optional[list[Any]] = None) -> Optional[RowMapping]:
        return await cls.find_one_or_none(filters=[cls.model.id == model_id], columns=columns)  # type: ignore

    @classmethod
    async def find_all(
        cls,
        *,
        joins: Optional[list[tuple[Type[Base], Any]]] = None,
        columns: Optional[list[Any]] = None,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[RowMapping]:
        selected_columns = columns if columns else cls.model.__table__.columns
        query = select(*selected_columns)
        if joins is not None:
            for table, condition in joins:
                query = query.join(table, condition)
        if filters is not None:
            query = query.where(and_(*filters))
        if order_by is not None:
            query = query.order_by(*order_by)
        if limit is not None:
            query = query.limit(limit)
        if offset is not None:
            query = query.offset(offset)
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.mappings().all()

    @classmethod
    async def add_record(cls, **data: Any) -> RowMapping:
        query = insert(cls.model).values(**data).returning(*cls.model.__table__.columns)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.mappings().one()

    @classmethod
    async def delete_record(cls, *, filters: list[Any]) -> int:
        query = delete(cls.model).where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount

    @classmethod
    async def update_record(cls, *, filters: list[Any], update_data: dict[str, Any]) -> int:
        if not update_data:
            raise ValueError("Parameter 'update_data' cannot be empty")
        query = update(cls.model).where(and_(*filters)).values(**update_data)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount


class MovieBaseDAO(BaseDAO):
    @classmethod
    async def find_all_movies(
        cls,
        *,
        join_users: bool = False,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[RowMapping]:
        joins: list[tuple[Type[Base], Any]] = []
        joins.append((Movie, Movie.id == cls.model.movie_id))  # type: ignore
        columns = list(cls.model.__table__.columns) + list(Movie.__table__.columns)
        if join_users:
            joins.append((User, User.id == cls.model.user_id))  # type: ignore
            columns.append(User.user_name)  # type: ignore
        return await cls.find_all(
            joins=joins, columns=columns, filters=filters, order_by=order_by, limit=limit, offset=offset
        )
