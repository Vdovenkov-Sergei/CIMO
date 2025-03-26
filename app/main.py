from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin

from app.admin.views import UserAdmin, MovieAdmin, WatchLaterMovieAdmin, ViewedMovieAdmin, SessionAdmin, \
    SessionMovieAdmin, PersonAdmin, MovieRoleAdmin, MessageAdmin, ChatAdmin
from app.database import engine


app = FastAPI(title="CIMO")

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
