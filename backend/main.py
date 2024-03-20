from fastapi import Depends, FastAPI, HTTPException, status, APIRouter
import crud
import schemas
import models
from dependencies import SessionLocal
from models import engine
from routers import auth, entries, prompts

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router)
app.include_router(entries.router)
app.include_router(prompts.router)
