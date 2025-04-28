from typing import Any, Optional, Sequence, Type

from sqlalchemy import and_, delete, insert, select, update
from sqlalchemy.orm.strategy_options import _AbstractLoad

from app.database import Base, async_session_maker


class BaseDAO:
    model: Type[Base]

    @classmethod
    async def find_one_or_none(
        cls,
        *,
        options: Optional[list[_AbstractLoad]] = None,
        filters: Optional[list[Any]] = None,
    ) -> Optional[Base]:
        query = select(cls.model)
        if options is not None:
            query = query.options(*options)
        if filters is not None:
            query = query.where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def find_by_id(cls, model_id: int, *, options: Optional[list[_AbstractLoad]] = None) -> Optional[Base]:
        return await cls.find_one_or_none(options=options, filters=[cls.model.id == model_id])  # type: ignore

    @classmethod
    async def find_all(
        cls,
        *,
        options: Optional[list[_AbstractLoad]] = None,
        filters: Optional[list[Any]] = None,
        order_by: Optional[list[Any]] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
    ) -> Sequence[Base]:
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
            return result.scalars().all()

    @classmethod
    async def add_record(cls, **data: Any) -> Base:
        query = insert(cls.model).values(**data).returning(cls.model)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.scalars().one()

    @classmethod
    async def delete_record(cls, *, filters: list[Any]) -> int:
        query = delete(cls.model).where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount

    @classmethod
    async def update_record(cls, *, filters: list[Any], update_data: dict[str, Any]) -> int:
        query = update(cls.model).where(and_(*filters)).values(**update_data)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount
