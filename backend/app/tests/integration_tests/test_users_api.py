import pytest
from httpx import AsyncClient
from app.users.dao import UserDAO
from app.database import redis_client
from app.users.models import User
from app.users.utils import USER_EMAIL_KEY, ATTEMPTS_SEND_KEY, MAX_TIME_PENDING_VERIFICATION, Hashing, CODE_VERIFY_KEY, \
    ATTEMPTS_ENTER_KEY, ACCESS_TOKEN, REFRESH_TOKEN


@pytest.mark.parametrize("email, password, code, status_code", [
    ("new_testik_user@gmain.com", "StrongPassword123", "123456", 200)
])
async def test_full_register_flow(email, password, code, status_code, ac: AsyncClient, clean_database):
    await redis_client.delete(USER_EMAIL_KEY.format(email=email))
    await redis_client.delete(CODE_VERIFY_KEY.format(email=email))
    await redis_client.delete(ATTEMPTS_SEND_KEY.format(email=email))
    await redis_client.delete(ATTEMPTS_ENTER_KEY.format(email=email))

    existing_user = await UserDAO.find_one_or_none(filters=[User.email == email])
    if existing_user:
        await UserDAO.delete_record(filters=[User.email == email])

    payload = {
        "email": email,
        "password": password
    }

    response = await ac.post("auth/register/email", json=payload)

    assert response.status_code == status_code
    assert response.json() == {"message": "Verification email sent."}

    hashed_password = Hashing.get_password_hash(password)
    await redis_client.setex(USER_EMAIL_KEY.format(email=email), MAX_TIME_PENDING_VERIFICATION, hashed_password)
    await redis_client.setex(CODE_VERIFY_KEY.format(email=email), MAX_TIME_PENDING_VERIFICATION, code)
    await redis_client.setex(ATTEMPTS_ENTER_KEY.format(email=email), MAX_TIME_PENDING_VERIFICATION, 0)
    await redis_client.setex(ATTEMPTS_SEND_KEY.format(email=email), MAX_TIME_PENDING_VERIFICATION, 0)

    payload = {
        "id": 11,
        "email": email,
        "code": code
    }

    response = await ac.post("auth/register/verify", json=payload)
    assert response.status_code == status_code, f"Ошибка {response.status_code}, ответ: {response.json()}"
    assert "message" in response.json()
    user_id = response.json()["id"]

    user = await UserDAO.find_by_id(user_id)
    assert user is not None
    assert user.email == email


@pytest.mark.parametrize("email, password, status_code", [
    ("bebrov@example.com", "bebra12345678", 200)
])
async def test_login_after_registration(email, password, status_code, ac: AsyncClient, clean_database):
    hashed_pw = Hashing.get_password_hash(password)
    await UserDAO.add_record(
        email=email,
        hashed_password=hashed_pw,
        user_name="testik_bebra",
        is_superuser=True
    )

    payload = {
        "login": email,
        "password": password
    }

    response = await ac.post("/auth/login", json=payload)

    assert response.status_code == status_code
    assert response.json()["message"] == "Login successful."

    cookies = response.cookies
    assert ACCESS_TOKEN in cookies
    assert REFRESH_TOKEN in cookies

    access_token = cookies.get(ACCESS_TOKEN)
    refresh_token = cookies.get(REFRESH_TOKEN)
    assert isinstance(access_token, str) and len(access_token) > 20
    assert isinstance(refresh_token, str) and len(refresh_token) > 20


@pytest.mark.parametrize("email, password, old_username, new_username, status_code", [
    ("bebrov@example.com", "bebra12345678", "user_old", "user_new", 200)
])
async def test_update_users_me(
        email, password, status_code, old_username, new_username, ac: AsyncClient, clean_database
):
    hashed_pw = Hashing.get_password_hash(password)
    await UserDAO.add_record(
        email=email,
        hashed_password=hashed_pw,
        user_name=old_username,
        is_superuser=False
    )

    login_payload = {
        "login": email,
        "password": password
    }
    login_response = await ac.post("/auth/login", json=login_payload)
    assert login_response.status_code == status_code
    access_token = login_response.cookies.get(ACCESS_TOKEN)
    assert access_token

    update_payload = {
        "user_name": new_username
    }
    ac.cookies.set(ACCESS_TOKEN, access_token)
    response = await ac.patch("/users/me", json=update_payload)

    assert response.status_code == status_code
    assert response.json()["message"] == "User updated successfully."

    updated_user = await UserDAO.find_one_or_none(filters=[UserDAO.model.email == email])
    assert updated_user is not None
    assert updated_user.user_name == new_username
