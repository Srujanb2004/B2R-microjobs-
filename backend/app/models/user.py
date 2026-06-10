from sqlalchemy import Boolean, Column, Integer, String
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    is_verified = Column(Boolean, default=False)
    role = Column(String, default="user") # Can be 'worker', 'poster', etc.
