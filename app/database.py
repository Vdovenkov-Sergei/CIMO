import uuid
from datetime import date, datetime

from sqlalchemy import ARRAY, TIMESTAMP, UUID, BigInteger, Date, Float, String, Text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(settings.database_url, echo=True)

async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    type_annotation_map = {
        int: BigInteger,
        float: Float,
        str: String,
        datetime: TIMESTAMP(timezone=True),
        date: Date,
        list[str]: ARRAY(Text),
        uuid.UUID: UUID(as_uuid=True),
    }
