from datetime import timedelta, datetime, timezone
import bcrypt
from fastapi import HTTPException
import jwt
from config import ACCESS_TOKEN_TIME, HASH_ALGORITHM, JWT_SECRET_KEY, ENCRYPT_KEY
from cryptography.fernet import Fernet
import models


def hash_password(password, salt):
    """
    params:
        password: Password to hash
        salt: Salt for encoding
    returns;
        hashed_password: Password hashed
    """
    return bcrypt.hashpw(
        password.encode("utf-8"),
        salt=salt,
    )


def authenticate_user(email, password, db):
    """
    params:
        email: User email
        password: User password
        db: active database
    returns:
        db_user: user from database
    """
    db_user = db.query(models.User).filter(models.User.email == email.lower()).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Account does not exist.")
    print(db_user)
    hashed_password = hash_password(password=password, salt=db_user.salt)
    if str(hashed_password, "utf-8") != db_user.password:
        raise HTTPException(status_code=400, detail="Invalid email or password.")
    return db_user


def create_token(
    data: dict["email":str, "first_name":str, "last_name":str, "id" : int or str],
    expires: int | str = ACCESS_TOKEN_TIME,
):
    """
    params:
        data: User data to be tokenized
        expires: Integer or string(converted to int) for minutes to expiration
    returns:
        token: JWT encoded token
    """
    delta = timedelta(minutes=expires)
    adjusted_time = datetime.now(timezone.utc) + delta
    encode = {
        "sub": {
            "email": data.email,
            "first_name": data.first_name,
            "last_name": data.last_name,
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
    """
    params:
        message: String to be encrypted using Fernet encryption
    returns:
        encMessage: Encrypted message
    """
    fernet = Fernet(key=ENCRYPT_KEY)
    encMessage = fernet.encrypt(message.encode())
    return encMessage


def decrypt(encrypted_message):
    """
    params:
        encrypted_message: String to be decrypted using Fernet encryption
    returns:
        decrypted_message: Decrypted message
    """
    fernet = Fernet(key=ENCRYPT_KEY)
    message = fernet.decrypt(encrypted_message)
    decrypted_message = message.decode()
    return decrypted_message
