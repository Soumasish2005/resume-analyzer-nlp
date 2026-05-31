from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.api import auth, analysis, feedback, employer

app = FastAPI(
    title="Resume Analyzer API",
    description="NLP-powered resume analysis and job matching system",
    version="1.0.0"
)

# CORS — allow frontend origin in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Register routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(analysis.router, prefix="/api/v1", tags=["Analysis"])
app.include_router(feedback.router, prefix="/api/v1", tags=["Feedback"])
app.include_router(employer.router, prefix="/api/v1/emp", tags=["Employer"])

@app.get("/")
def root():
    return {"message": "Resume Analyzer API is running"}