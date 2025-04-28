import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.exceptions import InvalidSessionStatusException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieRead
from app.session_movies.dao import SessionMovieDAO
from app.session_movies.schemas import MatchNotification, SSessionMovieCreate, SSessionMovieRead
from app.sessions.dependencies import get_current_session
from app.sessions.models import Session, SessionStatus

router = APIRouter(prefix="/movies/session", tags=["Session Movies"])
active_sessions: dict[uuid.UUID, list[WebSocket]] = {}


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: uuid.UUID) -> None:
    await websocket.accept()
    if session_id not in active_sessions:
        active_sessions[session_id] = []

    active_sessions[session_id].append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_sessions[session_id].remove(websocket)
        if not active_sessions[session_id]:
            del active_sessions[session_id]


@router.post("/", response_model=dict[str, str | int])
async def swipe_session_movie(
    data: SSessionMovieCreate, session: Session = Depends(get_current_session)
) -> dict[str, str | int]:
    if session.status != SessionStatus.ACTIVE:
        raise InvalidSessionStatusException(status=session.status.value)

    existing_movie = await SessionMovieDAO.find_by_session_user_movie_id(
        session_id=session.id, user_id=session.user_id, movie_id=data.movie_id
    )
    if data.is_liked and not existing_movie:
        await SessionMovieDAO.add_record(session_id=session.id, user_id=session.user_id, movie_id=data.movie_id)

        if session.is_pair and await SessionMovieDAO.check_movie_match(session_id=session.id, movie_id=data.movie_id):
            await SessionMovieDAO.update_movie_match(session_id=session.id, movie_id=data.movie_id)
            movie = await MovieDAO.find_by_id(data.movie_id)
            notification = MatchNotification(
                movie=SMovieRead.model_validate(movie), match_time=datetime.now(UTC)
            ).model_dump_json()
            for websocket in active_sessions.get(session.id, []):
                await websocket.send_text(notification)

    # TODO Здесь будет логика обновления рекомендаций и отдачи нового movie_id

    return {"message": "The movie was successfully swipped.", "movie_id": data.movie_id}


@router.get("/", response_model=list[SSessionMovieRead])
async def get_session_list(
    limit: int = 20, offset: int = 0, session: Session = Depends(get_current_session)
) -> list[SSessionMovieRead]:
    if session.status not in (SessionStatus.REVIEW, SessionStatus.ACTIVE):
        raise InvalidSessionStatusException(status=session.status.value)

    movies = await SessionMovieDAO.find_movies(
        session_id=session.id, user_id=session.user_id, limit=limit, offset=offset
    )
    return [SSessionMovieRead.model_validate(movie) for movie in movies]


@router.delete("/{movie_id}", response_model=dict[str, str])
async def delete_from_session_list(movie_id: int, session: Session = Depends(get_current_session)) -> dict[str, str]:
    if session.status != SessionStatus.REVIEW:
        raise InvalidSessionStatusException(status=session.status.value)

    await SessionMovieDAO.delete_movie(session_id=session.id, user_id=session.user_id, movie_id=movie_id)
    return {"message": "The movie was successfully deleted."}
