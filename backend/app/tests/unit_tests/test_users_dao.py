import pytest
from app.users.dao import UserDAO


@pytest.mark.parametrize(
    "id, email, is_exist",
    [
        (1, "user1@example.com", True),
        (15, ".....", False)
    ]
)
async def test_find_user_by_id(id, email, is_exist, prepare_database):
    user = await UserDAO.find_by_id(id)

    if is_exist:
        assert user
        assert user.id == id
        assert user.email == email
    else:
        assert not user


@pytest.mark.parametrize(
    "user_name, is_exist",
    [
        ("userone", True),
        ("bebra", False)
    ]
)
async def test_find_user_by_username(user_name, is_exist, prepare_database):
    user = await UserDAO.find_by_login(login=user_name)

    if is_exist:
        assert user
        assert user.user_name == user_name
    else:
        assert not user
