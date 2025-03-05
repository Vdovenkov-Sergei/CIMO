from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Enum, ForeignKey
from enum import Enum as PyEnum

from app.database import Base


class RoleType(PyEnum):
    ACTOR = "ACTOR"
    DIRECTOR = "DIRECTOR"
    BOTH = "BOTH"


class MovieRole(Base):
    __tablename__ = "movie_roles"

    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), primary_key=True, autoincrement=False)
    person_id: Mapped[int] = mapped_column(ForeignKey("people.id"), primary_key=True, autoincrement=False)
    priority: Mapped[int] = mapped_column(nullable=False)
    role: Mapped[RoleType] = mapped_column(Enum(RoleType), nullable=False)
