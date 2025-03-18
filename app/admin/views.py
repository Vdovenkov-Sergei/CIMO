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
    column_list = [Chat.id, Chat.user, Chat.bot_name, Chat.messages, Chat.created_at]
    icon = "fa-solid fa-comments"


class MessageAdmin(ModelView, model=Message):
    column_list = [Message.chat, Message.sender, Message.created_at, Message.content]
    icon = "fa-solid fa-message"


class MovieRoleAdmin(ModelView, model=MovieRole):
    column_list = [MovieRole.movie, MovieRole.person, MovieRole.role]
    icon = "fa-solid fa-address-card"


class MovieAdmin(ModelView, model=Movie):
    column_list = [Movie.name, Movie.type, Movie.release_year, Movie.age_rating,
                   Movie.rating_kp, Movie.rating_imdb, Movie.description, Movie.roles,
                   Movie.runtime, Movie.genres, Movie.countries, Movie.poster_url]
    column_searchable_list = [Movie.name, Movie.release_year]
    column_sortable_list = [Movie.name, Movie.release_year, Movie.rating_kp, Movie.rating_imdb]
    icon = "fa-solid fa-video"


class PersonAdmin(ModelView, model=Person):
    column_list = [Person.name, Person.roles, Person.photo_url]
    column_searchable_list = [Person.name]
    column_sortable_list = [Person.name]
    icon = "fa-solid fa-user-tie"


class SessionMovieAdmin(ModelView, model=SessionMovie):
    column_list = "__all__"
    icon = "fa-solid fa-bookmark"


class SessionAdmin(ModelView, model=Session):
    column_list = "__all__"
    icon = "fa-solid fa-handshake-simple"


class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.user_name, User.email]
    column_searchable_list = [User.user_name, User.email]
    column_sortable_list = [User.id, User.user_name]
    column_details_list = [User.viewed_movies, User.watch_later_movies, User.sessions, User.chats]
    icon = "fa-solid fa-circle-user"


class ViewedMovieAdmin(ModelView, model=ViewedMovie):
    column_list = [ViewedMovie.movie, ViewedMovie.user, ViewedMovie.review, ViewedMovie.created_at]
    icon = "fa-solid fa-eye"


class WatchLaterMovieAdmin(ModelView, model=WatchLaterMovie):
    column_list = [WatchLaterMovie.movie, WatchLaterMovie.user, WatchLaterMovie.created_at]
    icon = "fa-solid fa-clock"
