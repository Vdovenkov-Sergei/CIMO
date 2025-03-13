from enum import Enum as PyEnum

from sqlalchemy import Enum, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RoleType(PyEnum):
    ACTOR = "ACTOR"
    DIRECTOR = "DIRECTOR"
    BOTH = "BOTH"


class MovieRole(Base):
    __tablename__ = "movie_roles"

    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    person_id: Mapped[int] = mapped_column(ForeignKey("people.id"))
    priority: Mapped[int] = mapped_column(nullable=False)
    role: Mapped[RoleType] = mapped_column(Enum(RoleType), nullable=False)

    __table_args__ = (PrimaryKeyConstraint("movie_id", "person_id", name="movie_roles_pkey"),)

    movie = relationship("Movie", back_populates="roles")
    person = relationship("Person", back_populates="roles")
