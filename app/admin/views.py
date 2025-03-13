from sqladmin import ModelView

from app.chats.models import Chat
from app.messages.models import Message
from app.movie_roles.models import MovieRole
from app.movies.models import Movie
from app.people.models import Person
from app.session_movies.models import SessionMovie
from app.sessions.models import Session
from app.users.models import User
from app.viewed_movies.models import ViewedMovie
from app.watch_later_movies.models import WatchLaterMovie


class ChatAdmin(ModelView, model=Chat):
    column_list = Chat.__table__.columns.keys()
    can_edit = False
    can_create = False


class MessageAdmin(ModelView, model=Message):
    column_list = Message.__table__.columns.keys()
    can_edit = False
    can_create = False


class MovieRoleAdmin(ModelView, model=MovieRole):
    column_list = MovieRole.__table__.columns.keys()
    column_formatters = {
        MovieRole.movie_id: lambda v, c, m, n: m.movie.name if m.movie else "Unknown movie",
        MovieRole.person_id: lambda v, c, m, n: m.person.name if m.person else "Unknown actor"
    }
    form_excluded_columns = []


class MovieAdmin(ModelView, model=Movie):
    column_list = Movie.__table__.columns.keys()
    column_searchable_list = [Movie.name]
    column_sortable_list = [Movie.release_year, Movie.rating_kp, Movie.rating_imdb]
    column_details_list = [Movie.roles, Movie.viewed_by_users]
    form_excluded_columns = [Movie.viewed_by_users]


class PersonAdmin(ModelView, model=Person):
    column_list = Person.__table__.columns.keys()
    column_searchable_list = [Person.name]
    column_details_list = [Person.roles]


class SessionMovieAdmin(ModelView, model=SessionMovie):
    column_list = SessionMovie.__table__.columns.keys()
    can_edit = False
    can_create = False


class SessionAdmin(ModelView, model=Session):
    column_list = Session.__table__.columns.keys()
    can_edit = False
    can_delete = False
    can_create = False


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.user_name, User.email]
    column_searchable_list = [User.user_name, User.email]
    column_sortable_list = [User.id, User.user_name]
    column_details_list = [User.viewed_movies, User.watch_later_movies, User.sessions]
    form_excluded_columns = [User.sessions]
    can_delete = False
    can_edit = False
    can_create = False


class ViewedMovieAdmin(ModelView, model=ViewedMovie):
    column_list = ViewedMovie.__table__.columns.keys()
    column_formatters = {
        ViewedMovie.user_id: lambda v, c, m, n: m.user.user_name if m.user else "Unknown user",
        ViewedMovie.movie_id: lambda v, c, m, n: m.movie.name if m.movie else "Unknown movie"
    }
    form_excluded_columns = [ViewedMovie.created_at]


class WatchLaterMovieAdmin(ModelView, model=WatchLaterMovie):
    column_list = WatchLaterMovie.__table__.columns.keys()
    column_formatters = {
        WatchLaterMovie.user_id: lambda v, c, m, n: m.user.user_name if m.user else "Unknown user",
        WatchLaterMovie.movie_id: lambda v, c, m, n: m.movie.name if m.movie else "Unknown movie"
    }
    form_excluded_columns = [WatchLaterMovie.created_at]
