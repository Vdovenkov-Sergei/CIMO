import random
import uuid
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends

from app.constants import General, RedisKeys
from app.database import redis_client
from app.exceptions import (
    ActiveSessionNotFoundException,
    MaxParticipantsInSessionException,
    ParticipantsNotEnoughException,
    SessionAlreadyStartedException,
    SessionNotFoundException,
    UserAlreadyInSessionException,
)
from app.logger import logger
from app.recommendation.service import recommender
from app.sessions.dao import SessionDAO
from app.sessions.dependencies import get_current_session
from app.sessions.models import Session, SessionStatus
from app.sessions.schemas import SSessionCreate, SSessionRead, SSessionUpdate
from app.users.dependencies import get_current_user
from app.users.models import User

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.get("/me", response_model=SSessionRead)
async def get_user_session(user: User = Depends(get_current_user)) -> SSessionRead:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise ActiveSessionNotFoundException(user_id=user.id)
    return SSessionRead.model_validate(session)


@router.post("/", response_model=SSessionRead)
async def create_session(data: SSessionCreate, user: User = Depends(get_current_user)) -> SSessionRead:
    existing_session = await SessionDAO.find_existing_session(user_id=user.id)
    if existing_session:
        logger.warning("User already in a session.", extra={"session_id": existing_session.id, "user_id": user.id})
        raise UserAlreadyInSessionException(user_id=user.id, session_id=str(existing_session.id))

    session = await SessionDAO.add_session(user_id=user.id, is_pair=data.is_pair, is_onboarding=data.is_onboarding)
    session_users_key = RedisKeys.SESSION_USERS_KEY.format(session_id=session.id)
    user_session_swipes = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session.id, user_id=user.id)
    user_session_likes = RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session.id, user_id=user.id)
    await redis_client.sadd(session_users_key, user.id)
    await redis_client.set(user_session_swipes, 0)
    await redis_client.set(user_session_likes, 0)
    logger.debug("Session keys set in Redis.", extra={"user_id": user.id, "session_id": session.id})

    return SSessionRead.model_validate(session)


@router.post("/join/{session_id}", response_model=SSessionRead)
async def join_session(session_id: uuid.UUID, user: User = Depends(get_current_user)) -> SSessionRead:
    existing_session = await SessionDAO.find_existing_session(user_id=user.id)
    if existing_session and existing_session.id == session_id:
        logger.info("User rejoining same session.")
        return SSessionRead.model_validate(existing_session)
    if existing_session:
        logger.warning("User already in a session.", extra={"session_id": existing_session.id, "user_id": user.id})
        raise UserAlreadyInSessionException(user_id=user.id, session_id=str(existing_session.id))

    participants = await SessionDAO.get_participants(session_id=session_id)
    if not participants:
        raise SessionNotFoundException(session_id=str(session_id))

    session_record = next(iter(participants))
    if session_record.started_at is not None:
        logger.warning("Session already started.", extra={"session_id": session_id})
        raise SessionAlreadyStartedException(session_id=str(session_id))
    max_participants = General.PAIR if session_record.is_pair else General.SOLO
    if len(participants) >= max_participants:
        logger.warning("Session is full.", extra={"session_id": session_id, "count": len(participants)})
        raise MaxParticipantsInSessionException

    joined_session = await SessionDAO.add_session(session_id=session_id, user_id=user.id, is_pair=True)
    session_users_key = RedisKeys.SESSION_USERS_KEY.format(session_id=session_id)
    user_session_swipes = RedisKeys.USER_SESSION_SWIPES_KEY.format(session_id=session_id, user_id=user.id)
    user_session_likes = RedisKeys.USER_SESSION_LIKES_KEY.format(session_id=session_id, user_id=user.id)
    await redis_client.sadd(session_users_key, user.id)
    await redis_client.set(user_session_swipes, 0)
    await redis_client.set(user_session_likes, 0)
    logger.debug("Session keys set in Redis.", extra={"user_id": user.id, "session_id": session_id})

    return SSessionRead.model_validate(joined_session)


@router.get("/ready/{session_id}", response_model=bool)
async def check_ready_participants(session_id: uuid.UUID) -> bool:
    participants = await SessionDAO.get_participants(session_id=session_id)
    if not participants:
        raise SessionNotFoundException(session_id=str(session_id))
    max_participants = General.PAIR if next(iter(participants)).is_pair else General.SOLO
    if len(participants) < max_participants:
        logger.warning("Not enough participants.", extra={"session_id": session_id, "count": len(participants)})
        raise ParticipantsNotEnoughException

    ready_flag = all(p.status == SessionStatus.PREPARED for p in participants)
    if ready_flag:
        logger.info("All participants are ready.")
    else:
        logger.warning("Not all participants are ready.", extra={"session_id": session_id})
    return ready_flag


@router.patch("/status", response_model=dict[str, str | int])
async def change_session_status(
    data: SSessionUpdate, session: Session = Depends(get_current_session)
) -> dict[str, str | int]:
    new_status = data.status
    update_fields: dict[str, Any] = {"status": new_status}

    if (session.status, new_status) in [(SessionStatus.PENDING, SessionStatus.ACTIVE), (SessionStatus.PREPARED, SessionStatus.ACTIVE)]:
        update_fields["started_at"] = datetime.now(UTC)
        logger.info("User started session.", extra={"time": update_fields["started_at"], "user_id": session.user_id})
    elif (session.status, new_status) == (SessionStatus.REVIEW, SessionStatus.COMPLETED):
        update_fields["ended_at"] = datetime.now(UTC)
        logger.info("User ended session.", extra={"time": update_fields["ended_at"], "user_id": session.user_id})

    await SessionDAO.update_session(session_id=session.id, user_id=session.user_id, update_data=update_fields)

    response_data: dict[str, str | int] = {"message": "Session status updated successfully."}
    if new_status == SessionStatus.ACTIVE:
        first_movie_id = await recommender.get_recommendation(
            session_id=session.id, user_id=session.user_id, is_pair=session.is_pair, is_onboarding=session.is_onboarding
        )
        response_data["movie_id"] = first_movie_id
    return response_data


@router.delete("/leave", response_model=dict[str, str])
async def leave_session(session: Session = Depends(get_current_session)) -> dict[str, str]:
    await SessionDAO.leave_session(session_id=session.id, user_id=session.user_id)
    return {"message": "You left the session successfully."}
