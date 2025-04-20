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
from app.chats.router import router_chat
from app.database import engine, redis_client
from app.messages.router import router_message
from app.users.router import router_auth, router_user
from app.viewed_movies.router import router_viewed_movie
from app.watch_later_movies.router import router_watch_later_movie
from app.people.router import router as router_people
from app.movies.router import router as router_movies
from app.people.router import router as router_people
from app.users.router import router_auth, router_user
from app.sessions.router import router as router_sessions
from app.session_movies.router import router as router_session_movies


async def on_shutdown():
    await redis_client.close()


app = FastAPI(title="CIMO", on_shutdown=[on_shutdown])
app.include_router(router_chat)
app.include_router(router_message)
app.include_router(router_user)
app.include_router(router_auth)
app.include_router(router_viewed_movie)
app.include_router(router_watch_later_movie)
app.include_router(router_people)
app.include_router(router_movies)
app.include_router(router_sessions)
app.include_router(router_session_movies)

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
