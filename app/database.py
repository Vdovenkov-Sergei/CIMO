from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

engine = create_async_engine(settings.database_url)
async_session_maker = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)  # type: ignore


class Base(DeclarativeBase):
    pass
