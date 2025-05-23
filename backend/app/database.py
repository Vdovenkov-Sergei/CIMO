import uuid
from datetime import date, datetime

from redis import asyncio as aioredis
from sqlalchemy import ARRAY, TIMESTAMP, UUID, BigInteger, Boolean, Date, Float, String, Text, create_engine
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

sync_engine = create_engine(settings.sync_database_url, echo=False)
async_engine = create_async_engine(settings.async_database_url, echo=False)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False)

redis_client = aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)


class Base(DeclarativeBase):
    type_annotation_map = {
        int: BigInteger,
        float: Float,
        str: String,
        bool: Boolean,
        datetime: TIMESTAMP(timezone=True),
        date: Date,
        list[str]: ARRAY(Text),
        uuid.UUID: UUID(as_uuid=True),
    }
