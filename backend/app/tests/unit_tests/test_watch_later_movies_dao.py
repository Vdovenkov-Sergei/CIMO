import pytest

from app.watch_later_movies.dao import WatchLaterMovieDAO


@pytest.mark.parametrize(
    "user_id, expected_count, expected_last_movie_id",
    [
        (1, 2, 4),
        (999, 0, None),
    ],
)
async def test_find_movies(prepare_database, user_id, expected_count, expected_last_movie_id):
    movies = await WatchLaterMovieDAO.find_movies(user_id=user_id, limit=10, offset=0)
    assert len(movies) == expected_count
    if movies:
        assert movies[0].movie_id == expected_last_movie_id


@pytest.mark.parametrize(
    "user_id, movie_id, expected_deleted",
    [
        (1, 3, 1),
        (1, 999, 0),
    ],
)
async def test_delete_movie(prepare_database, user_id, movie_id, expected_deleted):
    deleted = await WatchLaterMovieDAO.delete_movie(user_id=user_id, movie_id=movie_id)
    assert deleted == expected_deleted
