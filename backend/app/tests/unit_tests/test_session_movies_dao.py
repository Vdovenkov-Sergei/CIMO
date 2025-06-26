import uuid

import pytest

from app.session_movies.dao import SessionMovieDAO


@pytest.mark.parametrize(
    "session_id, movie_id, expected_match",
    [
        (uuid.UUID("fcb4a5c8-573d-4b60-ae91-b6572dbb7d58"), 5, True),
        (uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), 1, False),
    ],
)
async def test_check_movie_match(session_id, movie_id, expected_match, prepare_database):
    result = await SessionMovieDAO.check_movie_match(session_id=session_id, movie_id=movie_id)
    assert result == expected_match


@pytest.mark.parametrize(
    "session_id, movie_id, expected_affected",
    [
        (uuid.UUID("fcb4a5c8-573d-4b60-ae91-b6572dbb7d58"), 5, 2),
        (uuid.UUID("fcb4a5c8-573d-4b60-ae91-b6572dbb7d58"), 999, 0),
    ],
)
async def test_update_movie_match(session_id, movie_id, expected_affected, prepare_database):
    affected = await SessionMovieDAO.update_movie_match(session_id=session_id, movie_id=movie_id)
    assert affected == expected_affected


@pytest.mark.parametrize(
    "session_id, user_id, movie_id, should_exist",
    [
        (uuid.UUID("f8d2e1a1-5b89-4c3e-bd09-5e7b0f81ac8b"), 1, 1, True),
        (uuid.UUID("f8d2e1a1-5b89-4c3e-bd09-5e7b0f81ac8b"), 1, 999, False),
    ],
)
async def test_find_by_session_user_movie_id(session_id, user_id, movie_id, should_exist, prepare_database):
    movie = await SessionMovieDAO.find_by_session_user_movie_id(
        session_id=session_id, user_id=user_id, movie_id=movie_id
    )
    if should_exist:
        assert movie is not None
        assert movie.session_id == session_id
        assert movie.user_id == user_id
        assert movie.movie_id == movie_id
    else:
        assert movie is None


async def test_delete_movie(prepare_database):
    session_id = uuid.UUID("f8d2e1a1-5b89-4c3e-bd09-5e7b0f81ac8b")
    user_id = 1
    movie_id = 1

    deleted = await SessionMovieDAO.delete_movie(session_id=session_id, user_id=user_id, movie_id=movie_id)
    assert deleted == 1

    deleted_again = await SessionMovieDAO.delete_movie(session_id=session_id, user_id=user_id, movie_id=movie_id)
    assert deleted_again == 0
