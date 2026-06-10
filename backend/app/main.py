from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, jobs

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="B2R Backend",
    description="Hyperlocal Micro-Job Marketplace API",
    version="1.0.0"
)

# Setup CORS
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(jobs.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the B2R API"}
