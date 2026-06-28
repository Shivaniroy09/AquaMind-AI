from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, usage, ai, admin
from app.core.database import engine, Base

# Create database tables safely
import logging
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logging.warning(f"Could not connect to database on startup: {e}")
    logging.warning("Please ensure DATABASE_URL is correctly set in environment variables.")

app = FastAPI(title="AquaMind AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(usage.router, prefix="/api/usage", tags=["Water Usage"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Modules"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AquaMind AI API"}
