import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.constants import Pagination
from app.exceptions import InvalidSessionStatusException
from app.logger import logger, movie_logger
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieRead
from app.recommendation.service import recommender
from app.session_movies.dao import SessionMovieDAO
from app.session_movies.schemas import MatchNotification, SSessionMovieCreate, SSessionMovieRead
from app.sessions.dependencies import get_current_session
from app.sessions.models import Session, SessionStatus

router = APIRouter(prefix="/movies/session", tags=["Session Movies"])
active_sessions: dict[uuid.UUID, list[WebSocket]] = {}


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: uuid.UUID) -> None:
    await websocket.accept()
    logger.info("WebSocket connected.", extra={"session_id": session_id})
    if session_id not in active_sessions:
        active_sessions[session_id] = []
    active_sessions[session_id].append(websocket)

    while True:
        try:
            message = await websocket.receive_text()
            if message == "ping":
                continue
            logger.debug("WebSocket message received.", extra={"session_id": session_id})
        except WebSocketDisconnect as err:
            active_sessions[session_id].remove(websocket)
            logger.info("WebSocket disconnected.", extra={"session_id": session_id, "error": str(err)})
            if not active_sessions[session_id]:
                del active_sessions[session_id]
            break


@router.post("/", response_model=dict[str, str | int])
async def swipe_session_movie(
    data: SSessionMovieCreate, session: Session = Depends(get_current_session)
) -> dict[str, str | int]:
    if session.status != SessionStatus.ACTIVE:
        logger.warning(
            "Invalid session status for swipe operation.",
            extra={"session_id": session.id, "status": session.status.value},
        )
        raise InvalidSessionStatusException(status=session.status.value)

    logger.info(
        "Swipe started.", extra={"user_id": session.user_id, "movie_id": data.movie_id, "is_liked": data.is_liked}
    )
    movie_logger.info(
        "Swipe recorded.",
        extra={
            "user_id": session.user_id,
            "movie_id": data.movie_id,
            "is_liked": data.is_liked,
            "time_swiped": data.time_swiped,
        },
    )

    existing_movie = await SessionMovieDAO.find_by_session_user_movie_id(
        session_id=session.id, user_id=session.user_id, movie_id=data.movie_id
    )
    if data.is_liked and not existing_movie:
        await SessionMovieDAO.add_movie(session_id=session.id, user_id=session.user_id, movie_id=data.movie_id)

        if session.is_pair and await SessionMovieDAO.check_movie_match(session_id=session.id, movie_id=data.movie_id):
            await SessionMovieDAO.update_movie_match(session_id=session.id, movie_id=data.movie_id)
            movie = await MovieDAO.find_movie_by_id(movie_id=data.movie_id)
            notification = MatchNotification(
                movie=SMovieRead.model_validate(movie), match_time=datetime.now(UTC)
            ).model_dump_json()
            webconnections = active_sessions.get(session.id, []).copy()
            for websocket in webconnections:
                try:
                    await websocket.send_text(notification)
                except Exception as err:
                    logger.warning("WebSocket dead connection.", extra={"session_id": session.id, "error": str(err)})
                    if websocket in active_sessions[session.id]:
                        active_sessions[session.id].remove(websocket)

            logger.info(
                "Match sent to all clients.",
                extra={
                    "session_id": session.id,
                    "movie_id": data.movie_id,
                    "clients": len(active_sessions.get(session.id, [])),
                },
            )

    await recommender.update_user_vector(session.id, session.user_id, data.movie_id, data.time_swiped, data.is_liked)
    new_movie_id = await recommender.get_recommendation(
        session.id, session.user_id, session.is_pair, session.is_onboarding
    )
    logger.info("Swipe completed.", extra={"user_id": session.user_id, "new_movie_id": new_movie_id})
    return {"message": "The movie was successfully swiped.", "movie_id": new_movie_id}


@router.get("/", response_model=list[SSessionMovieRead])
async def get_session_list(
    limit: int = Pagination.PAG_LIMIT,
    offset: int = Pagination.PAG_OFFSET,
    session: Session = Depends(get_current_session),
) -> list[SSessionMovieRead]:
    if session.status not in (SessionStatus.REVIEW, SessionStatus.ACTIVE):
        logger.warning(
            "Invalid session status for get operation.",
            extra={"session_id": session.id, "status": session.status.value},
        )
        raise InvalidSessionStatusException(status=session.status.value)

    movies = await SessionMovieDAO.find_movies(
        session_id=session.id, user_id=session.user_id, limit=limit, offset=offset
    )
    return [SSessionMovieRead.model_validate(movie) for movie in movies]


@router.delete("/{movie_id}", response_model=dict[str, str])
async def delete_from_session_list(movie_id: int, session: Session = Depends(get_current_session)) -> dict[str, str]:
    if session.status != SessionStatus.REVIEW:
        logger.warning(
            "Invalid session status for delete operation.",
            extra={"session_id": session.id, "status": session.status.value},
        )
        raise InvalidSessionStatusException(status=session.status.value)

    await SessionMovieDAO.delete_movie(session_id=session.id, user_id=session.user_id, movie_id=movie_id)
    return {"message": "The movie was successfully deleted."}
