from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    description: str
    payment: float
    location: str

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    payment: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None

class JobResponse(JobBase):
    id: int
    status: str
    poster_id: int
    worker_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
