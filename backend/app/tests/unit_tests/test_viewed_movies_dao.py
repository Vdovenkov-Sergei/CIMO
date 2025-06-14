import pytest
from app.viewed_movies.dao import ViewedMovieDAO


@pytest.mark.parametrize(
    "user_id, order_review, expected_last_review",
    [
        (1, True, 8),
        (2, False, 7),
    ],
)
async def test_find_movies(user_id, order_review, expected_last_review, prepare_database):
    movies = await ViewedMovieDAO.find_movies(user_id=user_id, limit=10, offset=0, order_review=order_review)
    assert movies
    assert movies[0].review == expected_last_review


@pytest.mark.parametrize(
    "user_id, movie_id, expected_deleted",
    [
        (1, 1, 1),
        (2, 999, 0),
    ],
)
async def test_delete_movie(user_id, movie_id, expected_deleted, prepare_database):
    deleted = await ViewedMovieDAO.delete_movie(user_id=user_id, movie_id=movie_id)
    assert deleted == expected_deleted


@pytest.mark.parametrize(
    "user_id, movie_id, new_review, expected_updated",
    [
        (1, 1, 10, 1),
        (1, 999, 7, 0),
    ],
)
async def test_update_review(user_id, movie_id, new_review, expected_updated, prepare_database):
    updated = await ViewedMovieDAO.update_review(user_id=user_id, movie_id=movie_id, review=new_review)
    assert updated == expected_updated
