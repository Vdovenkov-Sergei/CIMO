from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Person(Base):
    __tablename__ = "people"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    photo_url: Mapped[str] = mapped_column(nullable=True)

    roles = relationship("MovieRole", back_populates="person", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<id(id={self.id}, name='{self.name}', photo_url='{self.photo_url}')>"
