from typing import Any, Generic, Optional, Sequence, Type, TypeVar

from sqlalchemy import and_, delete, insert, select, update
from sqlalchemy.orm.strategy_options import _AbstractLoad

from app.dao.decorators import log_query_time
from app.database import Base, async_session_maker

T = TypeVar("T", bound=Base)


class BaseDAO(Generic[T]):
    model: Type[T]

    @classmethod
    @log_query_time
    async def find_one_or_none(
        cls,
        *,
        options: Optional[list[_AbstractLoad]] = None,
        filters: Optional[list[Any]] = None,
    ) -> Optional[T]:
        query = select(cls.model)
        if options is not None:
            query = query.options(*options)
        if filters is not None:
            query = query.where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().one_or_none()  # type: ignore

    @classmethod
    @log_query_time
    async def find_by_id(cls, model_id: int, *, options: Optional[list[_AbstractLoad]] = None) -> Optional[T]:
        return await cls.find_one_or_none(options=options, filters=[cls.model.id == model_id])

    @classmethod
    @log_query_time
    async def find_all(
        cls,
        *,
        options: Optional[list[_AbstractLoad]] = None,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[T]:
        query = select(cls.model)
        if options is not None:
            query = query.options(*options)
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
            return result.scalars().all()  # type: ignore

    @classmethod
    @log_query_time
    async def add_record(cls, **data: Any) -> T:
        query = insert(cls.model).values(**data).returning(cls.model)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.scalars().one()  # type: ignore

    @classmethod
    @log_query_time
    async def delete_record(cls, *, filters: list[Any]) -> int:
        query = delete(cls.model).where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount

    @classmethod
    @log_query_time
    async def update_record(cls, *, filters: list[Any], update_data: dict[str, Any]) -> int:
        query = update(cls.model).where(and_(*filters)).values(**update_data)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount
