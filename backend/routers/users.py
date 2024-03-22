from http.client import HTTPException
from typing import Annotated
import uuid
from fastapi import Depends, APIRouter, Path
from sqlalchemy.orm import Session
from dependencies import get_current_user, get_db
import crud


router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_db), Depends(get_current_user)],
)


@router.get("/")
def get_user(
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = crud.get_user(db=db, user_id=req.get("user_id"))
    return {"user": user}


@router.delete("/")
def delete(
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user = req.get("user_id")
    try:
        user = crud.delete_user(db=db, user_id=current_user)
        return {"deleted user": user}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
