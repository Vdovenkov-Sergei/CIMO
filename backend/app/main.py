# type: ignore

import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncIterator

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
from sqladmin import Admin
from sqlalchemy import select

from app.admin.auth import auth_backend
from app.admin.views import (
    ChatAdmin,
    MessageAdmin,
    MovieAdmin,
    MovieRoleAdmin,
    PersonAdmin,
    SessionAdmin,
    SessionMovieAdmin,
    UserAdmin,
    ViewedMovieAdmin,
    WatchLaterMovieAdmin,
)
from app.chats.router import router as router_chat
from app.config import settings
from app.database import async_engine, async_session_maker, redis_bin_client, redis_client
from app.logger import logger
from app.messages.router import router as router_message
from app.movie_roles.router import router as router_movie_roles
from app.movies.router import router as router_movies
from app.people.router import router as router_people
from app.recommendation.index import faiss_index
from app.session_movies.router import router as router_session_movies
from app.sessions.router import router as router_sessions
from app.users.router import router_auth, router_user
from app.viewed_movies.router import router as router_viewed_movies
from app.watch_later_movies.router import router as router_watch_later_movies


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    logger.info("Starting application...")

    try:
        async with async_session_maker() as session:
            await session.execute(select(1))
        logger.info("Successfully connected to database.")
    except Exception as err:
        logger.critical(
            "Error: failed to connect to database.",
            extra={"error": str(err), "db_url": settings.async_database_url},
            exc_info=True,
        )
        raise

    try:
        await redis_client.ping()
        await redis_bin_client.ping()
        FastAPICache.init(RedisBackend(redis_client), prefix="cache", expire=settings.CACHE_TTL)
        logger.info("Successfully connected to Redis and initialized cache.")
    except Exception as err:
        logger.critical(
            "Error: failed to connect to Redis",
            extra={"error": str(err), "redis_url": settings.redis_url},
            exc_info=True,
        )
        raise

    faiss_index.load()
    yield

    logger.info("Shutting down application...")
    try:
        await redis_client.close()
        logger.info("Redis client connection closed.")
    except Exception as err:
        logger.warning("Error: failed to close Redis client connection.", extra={"error": str(err)}, exc_info=True)


sentry_sdk.init(
    settings.SENTRY_DSN,
    integrations=[
        LoggingIntegration(level=logging.INFO, event_level=logging.ERROR),
        FastApiIntegration(),
    ],
    traces_sample_rate=1.0,
    send_default_pii=True,
)

app = FastAPI(title="CIMO", docs_url="/docs", lifespan=lifespan)

app.include_router(router_user)
app.include_router(router_auth)
app.include_router(router_chat)
app.include_router(router_message)
app.include_router(router_people)
app.include_router(router_movie_roles)
app.include_router(router_movies)
app.include_router(router_sessions)
app.include_router(router_session_movies)
app.include_router(router_viewed_movies)
app.include_router(router_watch_later_movies)

origins = [settings.FRONTEND_URL]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=[
        "Content-Type",
        "Set-Cookie",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
        "Authorization",
    ],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info("Request handling time", extra={"process_time": round(process_time, 4)})
    return response


"""@app.middleware("http")
async def redirect_http_to_https(request: Request, call_next):
    if request.url.scheme == "http":
        new_url = request.url.replace(scheme="https")
        return RedirectResponse(url=new_url)
    response = await call_next(request)
    return response


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    #! Защита от атак типа clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    #! Установка Content Security Policy (CSP)
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    #! Защита от некоторых типов атак через JavaScript
    response.headers["X-XSS-Protection"] = "1; mode=block"
    #! Защита от кражи cookies (не позволять отправку cookies через небезопасные каналы)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    #! Защита от подделки запросов
    response.headers["X-Content-Type-Options"] = "nosniff"

    return response"""


BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

admin = Admin(
    app, async_engine, title="CIMO admin", logo_url="/static/images/CIMO.jpg", authentication_backend=auth_backend
)
admin.add_view(UserAdmin)
admin.add_view(ChatAdmin)
admin.add_view(MessageAdmin)
admin.add_view(MovieRoleAdmin)
admin.add_view(MovieAdmin)
admin.add_view(PersonAdmin)
admin.add_view(SessionAdmin)
admin.add_view(SessionMovieAdmin)
admin.add_view(ViewedMovieAdmin)
admin.add_view(WatchLaterMovieAdmin)
