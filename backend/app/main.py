from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routes import router

app = FastAPI(title="Expense Tracker API", version="2.0.0")

# CORS middleware
# CORS middleware
origins = [
    "https://expense-tracker-one-eta-34.vercel.app",  # ✅ your deployed frontend
    "http://localhost:5173",  # ✅ for local testing
    "http://localhost:5413",  # ✅ current frontend port
    "http://localhost:5174",  # ✅ alternative port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)
app.include_router(router)
