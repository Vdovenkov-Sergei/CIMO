import pytest
from httpx import AsyncClient

from app.sessions.dao import SessionDAO
from app.sessions.models import SessionStatus
from app.users.dao import UserDAO
from app.users.utils import Hashing
from app.constants import Tokens


@pytest.mark.parametrize("email, password, is_pair, expected_status", [
    ("sess_test@example.com", "s3ssionpass", True, 200)
])
async def test_create_session(email, password, is_pair, expected_status, ac: AsyncClient, clean_database):
    hashed_pw = Hashing.get_password_hash(password)
    user = await UserDAO.add_record(
        email=email,
        hashed_password=hashed_pw,
        user_name="session_user",
    )

    response = await ac.post("/auth/login", json={"login": email, "password": password})

    access_token = response.cookies.get(Tokens.ACCESS_TOKEN)
    refresh_token = response.cookies.get(Tokens.REFRESH_TOKEN)

    ac.cookies.set(Tokens.ACCESS_TOKEN, access_token)
    ac.cookies.set(Tokens.REFRESH_TOKEN, refresh_token)

    response = await ac.post("/sessions/", json={"is_pair": is_pair})
    assert response.status_code == expected_status
    data = response.json()
    assert data["user_id"] == user.id
    assert data["is_pair"] == is_pair


@pytest.mark.parametrize("email, password, expected_status", [
    ("sess_test@example.com", "s3ssionpass", 200)
])
async def test_get_user_session(email, password, expected_status, ac: AsyncClient, clean_database):
    hashed_pw = Hashing.get_password_hash(password)
    user = await UserDAO.add_record(
        email=email,
        hashed_password=hashed_pw,
        user_name="session_user",
    )
    await SessionDAO.add_record(user_id=user.id, is_pair=False)

    response = await ac.post("/auth/login", json={"login": user.email, "password": password})
    assert response.status_code == expected_status

    access_token = response.cookies.get(Tokens.ACCESS_TOKEN)
    refresh_token = response.cookies.get(Tokens.REFRESH_TOKEN)

    ac.cookies.set(Tokens.ACCESS_TOKEN, access_token)
    ac.cookies.set(Tokens.REFRESH_TOKEN, refresh_token)

    response = await ac.get("/sessions/me")
    assert response.status_code == expected_status
    assert response.json()["user_id"] == user.id


async def test_join_session(ac: AsyncClient, clean_database):
    user1 = await UserDAO.add_record(
        email="creator@example.com",
        hashed_password=Hashing.get_password_hash("creatorpass"),
        user_name="creator",
    )
    user2 = await UserDAO.add_record(
        email="joiner@example.com",
        hashed_password=Hashing.get_password_hash("joinerpass"),
        user_name="joiner",
    )

    session = await SessionDAO.add_record(user_id=user1.id, is_pair=True)

    response = await ac.post("/auth/login", json={"login": user2.email, "password": "joinerpass"})

    access_token = response.cookies.get(Tokens.ACCESS_TOKEN)
    refresh_token = response.cookies.get(Tokens.REFRESH_TOKEN)

    ac.cookies.set(Tokens.ACCESS_TOKEN, access_token)
    ac.cookies.set(Tokens.REFRESH_TOKEN, refresh_token)

    response = await ac.post(f"/sessions/join/{session.id}")
    assert response.status_code == 200
    assert response.json()["id"] == str(session.id)


async def test_check_ready_participants(ac: AsyncClient, clean_database):
    user1 = await UserDAO.add_record(
        email="ready1@example.com",
        hashed_password=Hashing.get_password_hash("ready123"),
        user_name="readyuser1",
    )
    user2 = await UserDAO.add_record(
        email="ready2@example.com",
        hashed_password=Hashing.get_password_hash("ready456"),
        user_name="readyuser2",
    )
    session = await SessionDAO.add_record(user_id=user1.id, is_pair=True)
    await SessionDAO.add_record(id=session.id, user_id=user2.id, is_pair=True)

    await SessionDAO.update_session(
        session_id=session.id,
        user_id=user1.id,
        update_data={"status": SessionStatus.PREPARED}
    )

    await SessionDAO.update_session(
        session_id=session.id,
        user_id=user2.id,
        update_data={"status": SessionStatus.PREPARED}
    )

    response = await ac.get(f"/sessions/ready/{session.id}")
    assert response.status_code == 200
    assert response.json() is True


async def test_change_session_status(ac: AsyncClient, clean_database):
    user = await UserDAO.add_record(
        email="status@example.com",
        hashed_password=Hashing.get_password_hash("status123"),
        user_name="statususer",
    )
    session = await SessionDAO.add_record(user_id=user.id, is_pair=False)
    await SessionDAO.update_session(
        session_id=session.id,
        user_id=user.id,
        update_data={"status": SessionStatus.PREPARED}
    )

    response = await ac.post("/auth/login", json={"login": user.email, "password": "status123"})

    access_token = response.cookies.get(Tokens.ACCESS_TOKEN)
    refresh_token = response.cookies.get(Tokens.REFRESH_TOKEN)

    ac.cookies.set(Tokens.ACCESS_TOKEN, access_token)
    ac.cookies.set(Tokens.REFRESH_TOKEN, refresh_token)

    response = await ac.patch("/sessions/status", json={"status": "ACTIVE"})
    assert response.status_code == 200
    assert response.json()["message"] == "Session status updated successfully."


async def test_leave_session(ac: AsyncClient, clean_database):
    user = await UserDAO.add_record(
        email="leave@example.com",
        hashed_password=Hashing.get_password_hash("leavepass"),
        user_name="leaveuser",
    )
    session = await SessionDAO.add_record(user_id=user.id, is_pair=False)

    response = await ac.post("/auth/login", json={"login": user.email, "password": "leavepass"})

    access_token = response.cookies.get(Tokens.ACCESS_TOKEN)
    refresh_token = response.cookies.get(Tokens.REFRESH_TOKEN)

    ac.cookies.set(Tokens.ACCESS_TOKEN, access_token)
    ac.cookies.set(Tokens.REFRESH_TOKEN, refresh_token)

    response = await ac.delete("/sessions/leave")
    assert response.status_code == 200
    assert response.json()["message"] == "You left the session successfully."

    assert await SessionDAO.find_existing_session(user_id=user.id) is None
