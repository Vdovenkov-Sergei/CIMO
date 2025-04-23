from typing import Any, Optional, Sequence, Type

from sqlalchemy import RowMapping, and_, delete, insert, select, update
from sqlalchemy.orm import Load

from app.database import Base, async_session_maker


class BaseDAO:
    model: Type[Base]

    @classmethod
    async def find_one_or_none(
        cls,
        *,
        columns: Optional[list[Any]] = None,
        options: Optional[list[Load]] = None,
        filters: Optional[list[Any]] = None,
    ) -> Optional[RowMapping]:
        selected_columns = columns if columns else cls.model.__table__.columns
        query = select(*selected_columns)
        if options is not None:
            query = query.options(*options)
        if filters is not None:
            query = query.where(and_(*filters))
        async with async_session_maker() as session:
            result = await session.execute(query)
            return result.mappings().one_or_none()

    @classmethod
    async def find_by_id(
        cls, model_id: int, *, columns: Optional[list[Any]] = None, options: Optional[list[Load]] = None
    ) -> Optional[RowMapping]:
        return await cls.find_one_or_none(columns=columns, options=options, filters=[cls.model.id == model_id])

    @classmethod
    async def find_all(
        cls,
        *,
        joins: Optional[list[tuple[Type[Base], Any]]] = None,
        columns: Optional[list[Any]] = None,
        options: Optional[list[Load]] = None,
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
        query = update(cls.model).where(and_(*filters)).values(**update_data)
        async with async_session_maker() as session:
            result = await session.execute(query)
            await session.commit()
            return result.rowcount
