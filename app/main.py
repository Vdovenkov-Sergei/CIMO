# type: ignore

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
from app.database import engine, redis_client
from app.users.router import router_auth, router_user


async def on_shutdown():
    await redis_client.close()


app = FastAPI(title="CIMO", on_shutdown=[on_shutdown])
app.include_router(router_user)
app.include_router(router_auth)

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
