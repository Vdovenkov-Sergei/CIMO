import uuid
from datetime import UTC, datetime
from typing import Optional

from fastapi import APIRouter, Depends

from app.exceptions import (
    MaxParticipantsInSessionException,
    ParticipantsNotEnoughException,
    SessionAlreadyInProgressException,
    SessionNotFoundException,
    UserAlreadyInSessionException,
    UserNotInSessionException,
)
from app.sessions.dao import SessionDAO
from app.sessions.models import Session, SessionStatus
from app.sessions.schemas import SSessionCreate, SSessionRead, SStatusUpdate
from app.users.dependencies import get_current_user
from app.users.models import User

PAIR, SOLO = 2, 1

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.get("/me")
async def get_user_session(user: User = Depends(get_current_user)) -> Optional[SSessionRead]:
    return await SessionDAO.find_existing_session(user_id=user.id)


@router.post("/")
async def create_session(data: SSessionCreate, user: User = Depends(get_current_user)) -> SSessionRead:
    existing_session = await SessionDAO.find_existing_session(user_id=user.id)
    if existing_session and existing_session.is_pair == data.is_pair:
        return existing_session
    if existing_session:
        raise UserAlreadyInSessionException(user_id=user.id, session_id=existing_session.id)
    session = await SessionDAO.add_record(user_id=user.id, is_pair=data.is_pair)
    return session


@router.post("/join/{session_id}")
async def join_session(session_id: uuid.UUID, user: User = Depends(get_current_user)) -> SSessionRead:
    existing_session = await SessionDAO.find_existing_session(user_id=user.id)
    if existing_session and existing_session.id == session_id:
        return existing_session
    if existing_session:
        raise UserAlreadyInSessionException(user_id=user.id, session_id=existing_session.id)

    participants = await SessionDAO.get_participants(session_id=session_id)
    if not participants:
        raise SessionNotFoundException(session_id=session_id)
    max_participants = PAIR if next(iter(participants)).is_pair else SOLO
    if len(participants) >= max_participants:
        raise MaxParticipantsInSessionException

    joined_session = await SessionDAO.add_record(id=session_id, user_id=user.id, is_pair=True)
    return joined_session


@router.get("/ready/{session_id}")
async def check_ready_participants(session_id: uuid.UUID) -> bool:
    participants = await SessionDAO.get_participants(session_id=session_id)
    if not participants:
        raise SessionNotFoundException(session_id=session_id)
    max_participants = PAIR if next(iter(participants)).is_pair else SOLO
    if len(participants) < max_participants:
        raise ParticipantsNotEnoughException
    return all(p.status == SessionStatus.PREPARED for p in participants)


@router.patch("/status")
async def change_session_status(data: SStatusUpdate, user: User = Depends(get_current_user)) -> None:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)

    update_fields = {"status": data.status}
    if (session.status, data.status) == (SessionStatus.PREPARED, SessionStatus.ACTIVE.value):
        update_fields["started_at"] = datetime.now(UTC)
    elif (session.status, data.status) == (SessionStatus.REVIEW, SessionStatus.COMPLETED.value):
        update_fields["ended_at"] = datetime.now(UTC)

    await SessionDAO.update_record(
        filters=[Session.id == session.id, Session.user_id == user.id], update_data=update_fields
    )


@router.delete("/leave")
async def leave_session(user: User = Depends(get_current_user)) -> dict[str, str]:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)

    if session.status in [SessionStatus.ACTIVE, SessionStatus.REVIEW, SessionStatus.COMPLETED]:
        raise SessionAlreadyInProgressException(session_id=session.id)

    await SessionDAO.delete_record(filters=[Session.id == session.id, Session.user_id == user.id])
    return {"detail": "You left the session successfully."}
