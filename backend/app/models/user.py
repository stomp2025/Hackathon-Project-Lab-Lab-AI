from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, Enum as SQLEnum
from enum import Enum
from typing import Optional
from app.database import Base

class UserRole(str, Enum):
    athlete = "athlete"
    coach = "coach"
    teammate = "teammate"
    referee = "referee"

# SQLAlchemy ORM Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole, name="user_role"), nullable=False)

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True