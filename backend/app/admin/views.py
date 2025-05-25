# type: ignore

from markupsafe import Markup
from sqladmin import ModelView

from app.chats.models import Chat
from app.constants import Pagination, URLs
from app.messages.models import Message
from app.movie_roles.models import MovieRole
from app.movies.models import Movie
from app.people.models import Person
from app.session_movies.models import SessionMovie
from app.sessions.models import Session
from app.users.models import User
from app.viewed_movies.models import ViewedMovie
from app.watch_later_movies.models import WatchLaterMovie


def movie_url(m: Movie) -> str:
    return f"{URLs.BASE_POSTER_URL}{m.poster_url}"


def person_url(p: Person) -> str:
    return f"{URLs.BASE_PHOTO_URL}{p.photo_url}"


class BaseAdmin(ModelView):
    can_create = False
    can_delete = False
    can_edit = False
    can_view_details = True
    can_export = True
    page_size = Pagination.PAG_LIMIT
    column_formatters = {
        "created_at": lambda m, a: m.created_at.strftime("%Y-%m-%d %H:%M:%S") if m.created_at else "-",
        "updated_at": lambda m, a: m.updated_at.strftime("%Y-%m-%d %H:%M:%S") if m.updated_at else "-",
        "ended_at": lambda m, a: m.ended_at.strftime("%Y-%m-%d %H:%M:%S") if m.ended_at else "-",
    }
    column_formatters_detail = column_formatters.copy()


class ChatAdmin(BaseAdmin, model=Chat):
    column_list = [Chat.id, Chat.user, Chat.bot_name, Chat.created_at]
    column_sortable_list = [Chat.id, Chat.created_at]
    column_searchable_list = [Chat.id]
    column_default_sort = (Chat.id, False)
    icon = "fa-solid fa-comments"


class MessageAdmin(BaseAdmin, model=Message):
    column_list = [Message.id, Message.chat, Message.sender, Message.created_at]
    column_sortable_list = [Message.id, Message.created_at]
    column_searchable_list = [Message.id]
    column_default_sort = (Message.id, False)
    icon = "fa-solid fa-message"


class MovieRoleAdmin(BaseAdmin, model=MovieRole):
    column_list = [MovieRole.movie, MovieRole.person, MovieRole.role]
    column_default_sort = [(MovieRole.movie_id, False), (MovieRole.person_id, False), (MovieRole.priority, False)]
    icon = "fa-solid fa-address-card"


class MovieAdmin(BaseAdmin, model=Movie):
    column_list = [
        Movie.id,
        Movie.name,
        Movie.type,
        Movie.release_year,
        Movie.age_rating,
        Movie.rating_kp,
        Movie.rating_imdb,
        Movie.runtime,
        Movie.genres,
        Movie.countries,
    ]
    column_details_list = list(Movie.__table__.columns) + [Movie.roles]
    column_searchable_list = [Movie.id, Movie.name, Movie.release_year]
    column_default_sort = (Movie.id, False)
    column_sortable_list = [Movie.id, Movie.name, Movie.release_year, Movie.rating_kp, Movie.rating_imdb]
    icon = "fa-solid fa-video"

    column_formatters = {
        "genres": lambda m, a: ", ".join(m.genres) if m.genres else "-",
        "countries": lambda m, a: ", ".join(m.countries) if m.countries else "-",
        "rating_kp": lambda m, a: f"{m.rating_kp:.1f}" if m.rating_kp else "-",
        "rating_imdb": lambda m, a: f"{m.rating_imdb:.1f}" if m.rating_imdb else "-",
        "runtime": lambda m, a: f"{m.runtime} min" if m.runtime else "-",
        "age_rating": lambda m, a: f"{int(m.age_rating)}+" if m.age_rating else "-",
        "poster_url": lambda m, a: (
            Markup(f'<a href="{movie_url(m)}" target="_blank">Постер</a>') if m.poster_url else "-"
        ),
    }
    column_formatters_detail = column_formatters.copy()


class PersonAdmin(BaseAdmin, model=Person):
    column_list = [Person.id, Person.name, Person.photo_url]
    column_sortable_list = [Person.id, Person.name]
    column_searchable_list = [Person.id, Person.name]
    column_default_sort = (Person.id, False)
    icon = "fa-solid fa-user-tie"

    column_formatters = {
        "photo_url": lambda m, a: (
            Markup(f'<a href="{person_url(m)}" target="_blank">Фото</a>') if m.photo_url else "-"
        ),
    }
    column_formatters_detail = column_formatters.copy()


class SessionMovieAdmin(BaseAdmin, model=SessionMovie):
    column_list = [
        SessionMovie.session,
        SessionMovie.user_id,
        SessionMovie.movie,
        SessionMovie.created_at,
        SessionMovie.is_matched,
    ]
    column_default_sort = [
        (SessionMovie.session_id, False),
        (SessionMovie.user_id, False),
        (SessionMovie.is_matched, True),
    ]
    column_sortable_list = [SessionMovie.created_at]
    icon = "fa-solid fa-bookmark"


class SessionAdmin(BaseAdmin, model=Session):
    column_list = [Session.id, Session.user, Session.status, Session.created_at, Session.ended_at, Session.is_pair]
    column_sortable_list = [Session.id, Session.created_at, Session.ended_at]
    column_searchable_list = [Session.id]
    column_default_sort = (Session.id, False)
    icon = "fa-solid fa-handshake-simple"


class UserAdmin(BaseAdmin, model=User):
    column_list = [User.id, User.user_name, User.email, User.created_at]
    column_sortable_list = [User.id, User.user_name, User.email, User.created_at]
    column_searchable_list = [User.id, User.user_name, User.email]
    column_default_sort = (User.id, False)
    column_details_list = [User.viewed_movies, User.watch_later_movies, User.sessions, User.chat, User.is_superuser]
    icon = "fa-solid fa-circle-user"


class ViewedMovieAdmin(BaseAdmin, model=ViewedMovie):
    column_list = [ViewedMovie.user, ViewedMovie.movie, ViewedMovie.review, ViewedMovie.created_at]
    column_default_sort = [(ViewedMovie.user_id, False), (ViewedMovie.movie_id, False)]
    column_sortable_list = [ViewedMovie.review, ViewedMovie.created_at]
    icon = "fa-solid fa-eye"


class WatchLaterMovieAdmin(BaseAdmin, model=WatchLaterMovie):
    column_list = [WatchLaterMovie.user, WatchLaterMovie.movie, WatchLaterMovie.created_at]
    column_default_sort = [(WatchLaterMovie.user_id, False), (WatchLaterMovie.movie_id, False)]
    column_sortable_list = [WatchLaterMovie.created_at]
    icon = "fa-solid fa-clock"
