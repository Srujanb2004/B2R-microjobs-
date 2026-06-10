from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    pass

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    job_id: int
    worker_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
