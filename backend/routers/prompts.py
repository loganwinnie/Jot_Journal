from typing import Annotated
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dependencies import get_current_user, get_db
import schemas, crud
from util import authenticate_user, create_token


router = APIRouter(
    prefix="/prompts",
    tags=["prompts"],
    dependencies=[Depends(get_db), Depends(get_current_user)],
)


@router.post("/")
def create_prompt(
    prompt: schemas.Prompt,
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        response = crud.generate_prompt(
            db=db, prompt=prompt.prompt, user_id=req["user_id"]
        )
        return {"response": response}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
