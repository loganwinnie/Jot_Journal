import uuid
from typing import List
from sqlalchemy import String, ForeignKey, create_engine, types, text, DateTime
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    sessionmaker,
)
from sqlalchemy.sql import func
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid,
        index=True,
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    email: Mapped[str] = mapped_column(String(75), index=True, unique=True)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=func.now(),
    )
    salt: Mapped[types.LargeBinary] = mapped_column(types.LargeBinary)

    entries: Mapped[List["Entry"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )
    prompts: Mapped[List["Prompt"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return self.email


class Entry(Base):
    __tablename__ = "entry"

    id: Mapped[uuid.UUID] = mapped_column(
        types.Uuid,
        index=True,
        primary_key=True,
        default=text("gen_random_uuid()"),
    )
    content: Mapped[types.LargeBinary] = mapped_column(types.LargeBinary, nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="entries")
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=func.now(),
    )
    title: Mapped[str] = mapped_column(String(), nullable=True)
    emoji_name: Mapped[str] = mapped_column(nullable=True)
    emoji: Mapped[str] = mapped_column(nullable=True)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        nullable=True,
    )

    def __repr__(self) -> str:
        return str(self.id)


class Prompt(Base):
    __tablename__ = "prompt"

    id: Mapped[str] = mapped_column(
        String(),
        index=True,
        primary_key=True,
        default=text("gen_random_uuid()"),
    )
    content: Mapped[types.LargeBinary] = mapped_column(types.LargeBinary)
    response: Mapped[str] = mapped_column(String())
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="prompts")
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=func.now(),
    )

    def __repr__(self) -> str:
        return str(self.content)
