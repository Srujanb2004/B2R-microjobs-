from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.job import Job
from ..models.user import User
from ..models.application import Application
from ..schemas.job import JobCreate, JobResponse, JobUpdate
from ..schemas.application import ApplicationResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.get("/", response_model=List[JobResponse])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.status == "open").offset(skip).limit(limit).all()
    return jobs

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_job = Job(**job.model_dump(), poster_id=current_user.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job_update: JobUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.poster_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.poster_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    db.delete(job)
    db.commit()
    return None

@router.post("/{job_id}/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.poster_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot apply for your own job")
    if job.status != "open":
        raise HTTPException(status_code=400, detail="Job is no longer open")
        
    # Check if already applied
    existing_application = db.query(Application).filter(Application.job_id == job_id, Application.worker_id == current_user.id).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied to this job")
        
    application = Application(job_id=job_id, worker_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.post("/{job_id}/accept", response_model=JobResponse)
def accept_worker(job_id: int, worker_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.poster_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept workers for this job")
    if job.status != "open":
        raise HTTPException(status_code=400, detail="Job is no longer open")
        
    application = db.query(Application).filter(Application.job_id == job_id, Application.worker_id == worker_id).first()
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Update job and application status
    job.worker_id = worker_id
    job.status = "assigned"
    application.status = "accepted"
    
    # Optionally reject other applications
    db.query(Application).filter(Application.job_id == job_id, Application.worker_id != worker_id).update({"status": "rejected"})
    
    db.commit()
    db.refresh(job)
    return job
