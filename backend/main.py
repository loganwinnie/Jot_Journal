from fastapi import FastAPI

import models
from models import engine
from routers import auth, entries, prompts, users
from fastapi.middleware.cors import CORSMiddleware
from config import ALLOWED_ORIGIN

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=ALLOWED_ORIGIN,    
    allow_methods=["*"],
    allow_headers=["*"]
    )
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(entries.router)
app.include_router(prompts.router)
