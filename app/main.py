from contextlib import asynccontextmanager
from redis import asyncio as aioredis
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin

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
from app.config import settings
from app.database import engine
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from collections.abc import AsyncIterator

from app.users.router import router_users, router_auth


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    redis = aioredis.from_url(settings.redis_url, encoding="utf-8", decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="cache")
    yield
    await redis.close()


app = FastAPI(title="CIMO", lifespan=lifespan)
app.include_router(router_auth)
app.include_router(router_users)

app.mount("/static", StaticFiles(directory="app/static"), "static")

admin = Admin(app, engine, title="CIMO admin", logo_url="/static/images/CIMO.jpg")
admin.add_view(ChatAdmin)
admin.add_view(MessageAdmin)
admin.add_view(MovieRoleAdmin)
admin.add_view(MovieAdmin)
admin.add_view(PersonAdmin)
admin.add_view(SessionMovieAdmin)
admin.add_view(SessionAdmin)
admin.add_view(UserAdmin)
admin.add_view(ViewedMovieAdmin)
admin.add_view(WatchLaterMovieAdmin)
