from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    payment = Column(Float)
    location = Column(String)
    status = Column(String, default="open") # open, assigned, completed
    poster_id = Column(Integer, ForeignKey("users.id"))
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships can be defined here, but keeping it simple for now
    # poster = relationship("User", foreign_keys=[poster_id])
    # worker = relationship("User", foreign_keys=[worker_id])
