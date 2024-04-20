from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy import desc, func
from sqlalchemy.orm import Session
import uuid
from config import OPEN_AI_KEY, OPEN_AI_MODEL, OPEN_AI_REQUEST_PER_HOUR
import models, schemas
import bcrypt
from util import decrypt, encrypt, hash_password
from openai import OpenAI

openai_client = OpenAI(api_key=OPEN_AI_KEY)


def get_user(db: Session, user_id: uuid.UUID):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {
        "created_at": user.created_at,
        "email": user.email,
        "first_name": user.first_name,
        "id": user.id,
        "last_name": user.last_name,
    }


def get_user_by_email(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "created_at": user.created_at,
        "email": user.email,
        "first_name": user.first_name,
        "id": user.id,
        "last_name": user.last_name,
    }


def create_user(db: Session, user: schemas.UserCreate):
    print(user)
    salt = bcrypt.gensalt()
    hashed_password = hash_password(user["password"], salt=salt)

    db_user = models.User(
        email=user["email"],
        password=str(hashed_password, "utf-8"),
        first_name=user["first_name"],
        last_name=user["last_name"],
        salt=salt,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: uuid.UUID):
    db_user = (
        db.query(models.Entry)
        .filter(
            models.User.id == user_id,
        )
        .first()
    )
    if not db_user:
        raise HTTPException(status_code=404, detail=f"Entry not found.")
    db.delete(db_user)
    db.commit()
    return user_id


def create_user_entry(db: Session, entry, user_id):

    content = encrypt(entry.content) if entry.content else None
    db_entry = models.Entry(
        title=entry.title,
        content=content,
        emoji=entry.emoji,
        emoji_name=entry.emoji_name,
        owner_id=user_id,
    )

    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    return {
        "id": db_entry.id,
        "created_at": db_entry.created_at,
        "updated_at": db_entry.updated_at,
        "owner_id": db_entry.owner_id,
        "emoji": db_entry.emoji,
        "emoji_name": db_entry.emoji_name,
        "content": decrypt(entry.content) if entry.content else None,
        "title": entry.title,
    }


def get_all_user_entries(db: Session, user_id):
    entries = (
        db.query(models.Entry)
        .order_by(desc(models.Entry.updated_at))
        .filter(models.Entry.owner_id == user_id)
        .all()
    )

    decrypted_entries = [
        {
            "id": entry.id,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "owner_id": entry.owner_id,
            "content": decrypt(entry.content) if entry.content else None,
            "emoji": entry.emoji,
            "emoji_name": entry.emoji_name,
            "title": entry.title,
        }
        for entry in entries
    ]

    return decrypted_entries


def get_entry(db: Session, user_id, entry_id):
    entry = (
        db.query(models.Entry)
        .filter(
            models.Entry.owner_id == user_id,
            models.Entry.id == entry_id,
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail=f"Entry not found.")
    if str(entry.owner_id) != str(user_id):
        raise HTTPException(status_code=401, detail=f"Cannot view other user entries.")

    decrypted_entry = {
        "id": entry.id,
        "created_at": entry.created_at,
        "updated_at": entry.updated_at,
        "owner_id": entry.owner_id,
        "content": decrypt(entry.content) if entry.content else None,
        "emoji": entry.emoji,
        "emoji_name": entry.emoji_name,
        "title": entry.title,
    }
    return decrypted_entry


def patch_user_entry(db: Session, entry: schemas.EntryCreate, entry_id, user_id):
    db_entry = (
        db.query(models.Entry)
        .filter(
            models.Entry.id == entry_id,
        )
        .first()
    )
    if not db_entry:
        raise HTTPException(status_code=404, detail=f"Entry not found.")
    if str(db_entry.owner_id) != str(user_id):
        raise HTTPException(
            status_code=401, detail=f"Cannot modify other user entries."
        )
    db_entry.content = encrypt(entry.content) if entry.content else None
    db_entry.title = entry.title if entry.title else None
    db_entry.emoji = entry.emoji if entry.emoji else None
    db_entry.emoji_name = entry.emoji_name if entry.emoji_name else None
    db_entry.updated_at = func.now()
    db.commit()
    db.refresh(db_entry)
    decrypted_entry = {
        "id": db_entry.id,
        "created_at": db_entry.created_at,
        "updated_at": db_entry.updated_at,
        "emoji": db_entry.emoji,
        "emoji_name": db_entry.emoji_name,
        "owner_id": db_entry.owner_id,
        "content": decrypt(db_entry.content) if entry.content else None,
        "title": db_entry.title,
    }
    return decrypted_entry


def delete_user_entry(db: Session, entry_id, user_id):
    db_entry = (
        db.query(models.Entry)
        .filter(
            models.Entry.id == entry_id,
        )
        .first()
    )
    if not db_entry:
        raise HTTPException(status_code=404, detail=f"Entry not found.")
    if str(db_entry.owner_id) != str(user_id):
        raise HTTPException(
            status_code=401, detail=f"Cannot delete other user entries."
        )
    db.delete(db_entry)
    db.commit()
    return entry_id


def generate_prompt(db: Session, prompt: str, user_id):
    if len(prompt) > 1000:
        raise HTTPException(
            status_code=400, detail="Prompts cannot be longer than 1000 characters."
        )

    one_hour = timedelta(hours=1)
    last_hour = datetime.now(timezone.utc) - one_hour
    recent_prompts = (
        db.query(models.Prompt)
        .filter(
            models.Prompt.owner_id == user_id,
            models.Prompt.created_at > last_hour,
        )
        .all()
    )

    if len(recent_prompts) > OPEN_AI_REQUEST_PER_HOUR:
        raise HTTPException(
            status_code=429, detail="Too many request in past hour. Please wait."
        )

    try:
        response = openai_client.chat.completions.create(
            model=OPEN_AI_MODEL,
            temperature=0.8,
            messages=[
                {
                    "role": "system",
                    "content": """
                    Role: Therapeutic Counselor Assistant

                    Objective: Assist the user in writing journal entries by guiding their thought process.

                    Steps:
                    1. Analysis: Analyze the user input to understand the intent and the topics discussed.
                    2. Insight Identification: Identify areas of concern or topics for further exploration. If the input suggests harm to self or others, advise the user to IMMEDIATELY seek professional help do not provide prompt.
                    3. Prompt Generation:
                    - If the user's sentence is incomplete, append an open-ended prompt to encourage further   user reflection.
                    - If the sentence is complete, provide a related open-ended starter for the next sentence.

                    Prompt Constraints:
                    - Keep prompts open-ended.
                    - Limit prompts to 15 words.
                    - Non conversational.
                    - First person Point of view.
                    - Only provide prompt.
                    - You should NEVER, answer prompts.

                    Example:
                    Input: "I am feeling quite down today."
                    Output: "Something that has me feeling down today is..."

                    Input: "Today I am feeling kinda blah."
                    Output: "and one way I can try to make my day more exciting is..."
                    """,
                },
                {"role": "user", "content": prompt},
            ],
        )
        response_content = response.choices[0].message.content
        encrypted_prompt = encrypt(response_content)

        db_prompt = models.Prompt(
            id=response.id,
            content=encrypted_prompt,
            response=response_content,
            owner_id=user_id,
        )

        db.add(db_prompt)
        db.commit()
        db.refresh(db_prompt)

        return response_content
    except:
        raise HTTPException(status_code=500, detail="Error generating prompt.")
