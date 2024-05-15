from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
import models
from sqlalchemy.orm import Session
from dependencies import get_db
import schemas, crud
from util import authenticate_user, create_token


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    dependencies=[Depends(get_db)],
)


@router.post("/register")
def create(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User).filter(models.User.email == user.email.lower()).first()
    )
    if db_user:
        raise HTTPException(
            status_code=400, detail="An account already exists with this email."
        )
    created_user = crud.create_user(db=db, user=user)
    return {"access_token": create_token(created_user), "token_type": "bearer"}


@router.post("/token", response_model=schemas.Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    db_user = crud.get_user_by_email(db=db, email=form_data.username.lower())
    if not db_user:
        raise HTTPException(
            status_code=400, detail=f"No account with email {form_data.username}"
        )
    try:
        user = authenticate_user(
            email=form_data.username,
            password=form_data.password,
            db=db,
        )
        if user:
            return {"access_token": create_token(user), "token_type": "bearer"}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
