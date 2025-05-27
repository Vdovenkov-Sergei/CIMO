import pytest
from httpx import AsyncClient
from app.session_movies.dao import SessionMovieDAO
from app.sessions.dao import SessionDAO
from app.users.dao import UserDAO
from app.users.utils import Hashing
from app.sessions.models import SessionStatus
from app.movies.dao import MovieDAO


@pytest.mark.parametrize("email, password, is_pair, movie_id", [
    ("movie_user@example.com", "testmoviepass", True, 111)
])
async def test_swipe_session_movie(email, password, is_pair, movie_id, ac: AsyncClient, clean_database):
    hashed_pw = Hashing.get_password_hash(password)
    user = await UserDAO.add_record(email=email, hashed_password=hashed_pw, user_name="movie_user", is_superuser=False)

    resp = await ac.post("/auth/login", json={"login": email, "password": password})
    assert resp.status_code == 200

    session = await SessionDAO.add_record(user_id=user.id, is_pair=is_pair)
    await SessionDAO.update_session(session_id=session.id, user_id=user.id, update_data={"status": SessionStatus.ACTIVE})

    await MovieDAO.add_record(
        id=movie_id,
        type="MOVIE",
        name="Sample Movie",
        release_year=2024,
        poster_url="test_url.com"
    )

    payload = {"movie_id": movie_id, "is_liked": True}
    response = await ac.post("/movies/session/", json=payload)
    assert response.status_code == 200
    assert response.json()["movie_id"] == movie_id


async def test_get_and_delete_session_movies(ac: AsyncClient, clean_database):
    email, password = "testuser@example.com", "testpass"
    hashed_pw = Hashing.get_password_hash(password)
    user = await UserDAO.add_record(
        email=email, hashed_password=hashed_pw, user_name="testuser", is_superuser=False
    )
    await ac.post("/auth/login", json={"login": email, "password": password})

    await MovieDAO.add_record(
        id=111,
        type="MOVIE",
        name="Sample Movie 1",
        release_year=2021,
        poster_url="test_url1.com"
    )

    await MovieDAO.add_record(
        id=222,
        type="MOVIE",
        name="Sample Movie 2",
        release_year=2022,
        poster_url="test_url2.com"
    )

    session = await SessionDAO.add_record(user_id=user.id, is_pair=False)
    await SessionDAO.update_session(
        session_id=session.id, user_id=user.id, update_data={"status": SessionStatus.REVIEW}
    )

    await SessionMovieDAO.add_record(session_id=session.id, user_id=user.id, movie_id=111)
    await SessionMovieDAO.add_record(session_id=session.id, user_id=user.id, movie_id=222)

    resp = await ac.get("/movies/session/")
    assert resp.status_code == 200
    data = resp.json()
    movie_ids = {movie["movie"]["id"] for movie in data}
    assert movie_ids == {111, 222}

    delete_resp = await ac.delete("/movies/session/111")
    assert delete_resp.status_code == 200
    assert delete_resp.json()["message"] == "The movie was successfully deleted."

    resp_after_delete = await ac.get("/movies/session/")
    remaining_ids = {movie["movie"]["id"] for movie in resp_after_delete.json()}
    assert remaining_ids == {222}

