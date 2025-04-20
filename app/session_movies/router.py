import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from app.exceptions import UserNotInSessionException
from app.movies.dao import MovieDAO
from app.movies.schemas import SMovieRead
from app.session_movies.dao import SessionMovieDAO
from app.session_movies.models import SessionMovie
from app.session_movies.schemas import MatchNotification, SSessionMovieCreate, SSessionMovieRead
from app.sessions.dao import SessionDAO
from app.users.dependencies import get_current_user
from app.users.models import User

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


@router.get("/")
async def get_session_movies(
    limit: int = 20, offset: int = 0, user: User = Depends(get_current_user)
) -> list[SSessionMovieRead]:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)

    movies = await SessionMovieDAO.get_movies(session_id=session.id, user_id=user.id, limit=limit, offset=offset)
    return movies  # type: ignore


@router.post("/")
async def create_session_movie(data: SSessionMovieCreate, user: User = Depends(get_current_user)) -> None:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)
    await SessionMovieDAO.add_record(session_id=session.id, user_id=user.id, movie_id=data.movie_id)

    if session.is_pair and await SessionMovieDAO.check_movie_match(session_id=session.id, movie_id=data.movie_id):
        await SessionMovieDAO.update_record(
            filters=[SessionMovie.session_id == session.id, SessionMovie.movie_id == data.movie_id],
            update_data={"is_matched": True},
        )
        movie = await MovieDAO.find_by_id(model_id=data.movie_id)
        notification = MatchNotification(
            movie=SMovieRead.model_validate(movie), match_time=datetime.now(UTC)
        ).model_dump_json()
        for websocket in active_sessions.get(session.id, []):
            await websocket.send_text(notification)


@router.delete("/{movie_id}")
async def delete_session_movie(movie_id: int, user: User = Depends(get_current_user)) -> None:
    session = await SessionDAO.find_existing_session(user_id=user.id)
    if not session:
        raise UserNotInSessionException(user_id=user.id)
    await SessionMovieDAO.delete_record(
        filters=[
            SessionMovie.session_id == session.id,
            SessionMovie.user_id == user.id,
            SessionMovie.movie_id == movie_id,
        ]
    )
