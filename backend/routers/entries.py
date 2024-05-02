from typing import Annotated
import uuid
from fastapi import Depends, HTTPException, Path, APIRouter
from sqlalchemy.orm import Session
from dependencies import get_db, get_current_user
import schemas, crud


router = APIRouter(
    prefix="/entries",
    tags=["entries"],
    dependencies=[Depends(get_db), Depends(get_current_user)],
)


@router.get("/")
def get_entries(
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entries = crud.get_all_user_entries(db=db, user_id=req.get("user_id"))
    return {"entries": entries}


@router.get("/{entry_id}")
def get_entry(
    entry_id: Annotated[uuid.UUID, Path(title="The entry ID of the entry to get")],
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        entry = crud.get_entry(db=db, user_id=req.get("user_id"), entry_id=entry_id)
        return {"entry": entry}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@router.post("/")
def create(
    entry: schemas.EntryCreate,
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = crud.create_user_entry(db=db, entry=entry, user_id=req["user_id"])
    return {"entry": entry}


@router.patch("/{entry_id}")
def patch_entry(
    entry_id: Annotated[uuid.UUID, Path(title="The entry ID of the entry to patch")],
    entry: schemas.EntryCreate,
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        patched_entry = crud.patch_user_entry(
            db=db, entry=entry, user_id=req.get("user_id"), entry_id=entry_id
        )
        return {"entry": patched_entry}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@router.delete("/{entry_id}")
def delete(
    entry_id: Annotated[uuid.UUID, Path(title="The entry ID of the entry to delete")],
    req=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        entry = crud.delete_user_entry(
            db=db, user_id=req.get("user_id"), entry_id=entry_id
        )
        return {"deleted entry": entry}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
