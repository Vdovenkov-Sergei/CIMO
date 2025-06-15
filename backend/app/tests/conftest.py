import json
import pytest

from datetime import datetime
from typing import Any
from httpx import AsyncClient, ASGITransport

from app.chats.dao import ChatDAO
from app.config import settings
from app.database import Base, async_engine as engine
from app.main import app as fastapi_app
from app.messages.dao import MessageDAO
from app.movie_roles.dao import MovieRoleDAO
from app.movies.dao import MovieDAO
from app.people.dao import PersonDAO
from app.session_movies.dao import SessionMovieDAO
from app.sessions.dao import SessionDAO
from app.users.dao import UserDAO
from app.viewed_movies.dao import ViewedMovieDAO
from app.watch_later_movies.dao import WatchLaterMovieDAO


@pytest.fixture(scope="function")
async def prepare_database():
    assert settings.MODE == "TEST"

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    def open_mock_json(model: str):
        with open(f"app/tests/prepared_data/mock_{model}.json", "r") as file:
            return json.load(file)

    model_dao_map = {
        "people": PersonDAO,
        "movies": MovieDAO,
        "movie_roles": MovieRoleDAO,
        "users": UserDAO,
        "chats": ChatDAO,
        "messages": MessageDAO,
        "sessions": SessionDAO,
        "session_movies": SessionMovieDAO,
        "viewed_movies": ViewedMovieDAO,
        "watch_later_movies": WatchLaterMovieDAO,
    }

    def parse_datetime_fields(record_for_parse: dict[str, Any]) -> dict[str, Any]:
        for key, value in record_for_parse.items():
            if isinstance(value, str) and value.endswith("Z"):
                try:
                    record_for_parse[key] = datetime.fromisoformat(value.replace("Z", "+00:00"))
                except ValueError:
                    pass
        return record_for_parse

    for model_name, dao in model_dao_map.items():
        records = open_mock_json(model_name)
        for record in records:
            await dao.add_record(**parse_datetime_fields(record))


@pytest.fixture(scope="function")
async def clean_database():
    assert settings.MODE == "TEST"
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


@pytest.fixture(scope="function")
async def ac():
    async with AsyncClient(transport=ASGITransport(app=fastapi_app), base_url="http://test") as ac:
        yield ac
