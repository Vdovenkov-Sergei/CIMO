import pytest

from app.movie_roles.dao import MovieRoleDAO


@pytest.mark.parametrize("movie_id, expected_found", [(1, True), (9999, False)])
async def test_get_movie_roles(movie_id, expected_found, prepare_database):
    roles = await MovieRoleDAO.get_movie_roles(movie_id=movie_id, limit=10, offset=0)

    if expected_found:
        assert roles, f"Expected roles for movie_id {movie_id} but they are not found"

        for role in roles:
            assert role.movie_id == movie_id
            assert hasattr(role, "person")
    else:
        assert roles == [], f"Expected empty list for movie_id {movie_id} but something was found"
