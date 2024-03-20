from fastapi import Depends, HTTPException, status
from config import HASH_ALGORITHM, JWT_SECRET_KEY
from crud import get_user
from models import SessionLocal
from fastapi.security import OAuth2PasswordBearer
import jwt
from typing import Annotated

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    print("TOKEN: ", token)
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[HASH_ALGORITHM])
        user = payload.get("sub")
        user_id = payload.get("id")
        if not user or not user_id:
            raise HTTPException(status_code=401, detail="Failed to authenticate user.")
        return {"user": user, "user_id": user_id}
    except:
        raise HTTPException(status_code=401, detail="Failed to authenticate user.")
