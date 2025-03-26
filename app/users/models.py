from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    chat = relationship("Chat", back_populates="user", uselist=False, cascade="all, delete-orphan")
    viewed_movies = relationship("ViewedMovie", back_populates="user", cascade="all, delete-orphan")
    watch_later_movies = relationship("WatchLaterMovie", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")

    def __str__(self):
        return self.user_name
