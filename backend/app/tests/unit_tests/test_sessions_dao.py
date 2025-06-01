import uuid
import pytest
from app.sessions.dao import SessionDAO
from app.sessions.models import Session, SessionStatus


@pytest.mark.parametrize(
    "user_id, expected_exists",
    [
        (3, True),
        (9999, False)
    ]
)
async def test_find_existing_session(user_id, expected_exists, prepare_database):
    session = await SessionDAO.find_existing_session(user_id=user_id)
    if expected_exists:
        assert session is not None
        assert session.user_id == user_id
        assert session.status != SessionStatus.COMPLETED
    else:
        assert session is None


@pytest.mark.parametrize(
    "session_id, expected_count",
    [
        (uuid.UUID("f8d2e1a1-5b89-4c3e-bd09-5e7b0f81ac8b"), 1),
        (uuid.UUID("99999999-9999-9999-9999-999999999999"), 0)
    ]
)
async def test_get_participants(session_id, expected_count, prepare_database):
    sessions = await SessionDAO.get_participants(session_id=session_id)
    assert len(sessions) == expected_count
    for s in sessions:
        assert s.id == session_id


async def test_update_and_delete_session(prepare_database):
    session_id = uuid.UUID("64c90a82-96ea-4d59-8f2e-60fa670d5e80")
    user_id = 4
    affected = await SessionDAO.update_session(
        session_id=session_id, user_id=user_id, update_data={"status": SessionStatus.COMPLETED}
    )
    assert affected == 1

    deleted = await SessionDAO.delete_session(session_id=session_id, user_id=user_id)
    assert deleted == 1

    deleted_none = await SessionDAO.delete_session(session_id=session_id, user_id=user_id)
    assert deleted_none == 0


async def test_clean_sessions(prepare_database):
    deleted_completed = await SessionDAO.clean_completed_sessions()
    assert isinstance(deleted_completed, int)

    deleted_old = await SessionDAO.clean_old_sessions()
    assert isinstance(deleted_old, int)
