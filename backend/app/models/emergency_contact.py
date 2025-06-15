from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from typing import Optional
from app.database import Base

# SQLAlchemy ORM Model
class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    relationship = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

# Pydantic Models
class EmergencyContactBase(BaseModel):
    name: str
    phone_number: str
    relationship: str

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactResponse(EmergencyContactBase):
    id: int
    user_id: int # Foreign key to User model

    class Config:
        from_attributes = True