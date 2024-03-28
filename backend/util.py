from datetime import timedelta, datetime, timezone
import bcrypt
from fastapi import HTTPException
import jwt
from config import ACCESS_TOKEN_TIME, HASH_ALGORITHM, JWT_SECRET_KEY, ENCRYPT_KEY
from cryptography.fernet import Fernet
import models


def hash_password(password, salt):
    return bcrypt.hashpw(
        password.encode("utf-8"),
        salt=salt,
    )


def authenticate_user(email, password, db):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Account does not exist.")
    print(db_user)
    hashed_password = hash_password(password=password, salt=db_user.salt)
    if str(hashed_password, "utf-8") != db_user.password:
        raise HTTPException(status_code=400, detail="Invalid email or password.")
    return db_user


def create_token(data, expires: timedelta = ACCESS_TOKEN_TIME):
    delta = timedelta(minutes=expires)
    adjusted_time = datetime.now(timezone.utc) + delta
    encode = {
        "sub": {
            "email": data.email,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "created_at": data.created_at.isoformat(),
        },
        "id": str(data.id),
        "exp": adjusted_time,
    }
    token = jwt.encode(
        encode,
        JWT_SECRET_KEY,
        algorithm=HASH_ALGORITHM,
    )
    return token


def encrypt(message):
    fernet = Fernet(key=ENCRYPT_KEY)
    encMessage = fernet.encrypt(message.encode())
    return encMessage


def decrypt(encoded_message):
    fernet = Fernet(key=ENCRYPT_KEY)
    message = fernet.decrypt(encoded_message)
    decoded_message = message.decode()
    return decoded_message
