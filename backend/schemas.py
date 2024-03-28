from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime


class EntryBase(BaseModel):
    content: str
    emoji: str
    emoji_name: str


class EntryCreate(EntryBase):
    pass


class Entry(EntryBase):
    created_at: datetime
    updated_at: datetime
    owner_id: uuid.UUID

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: EmailStr


class UserLogin(UserBase):
    password: str
    remember_me: bool = False


class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str


class User(UserBase):
    id: uuid.UUID
    created_at: datetime
    entries: list[Entry]
    first_name: str
    last_name: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class Prompt(BaseModel):
    prompt: str
