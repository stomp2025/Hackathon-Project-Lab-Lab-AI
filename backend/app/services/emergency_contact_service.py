from sqlalchemy.orm import Session
from app.models.emergency_contact import EmergencyContactCreate, EmergencyContact as EmergencyContactModel
from typing import List

def create_emergency_contact(db: Session, contact: EmergencyContactCreate, user_id: int) -> EmergencyContactModel:
    db_contact = EmergencyContactModel(**contact.model_dump(), user_id=user_id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_emergency_contacts_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[EmergencyContactModel]:
    return db.query(EmergencyContactModel).filter(EmergencyContactModel.user_id == user_id).offset(skip).limit(limit).all()

def get_emergency_contact(db: Session, contact_id: int, user_id: int) -> EmergencyContactModel:
    return db.query(EmergencyContactModel).filter(EmergencyContactModel.id == contact_id, EmergencyContactModel.user_id == user_id).first()

def update_emergency_contact(db: Session, contact_id: int, contact_update: EmergencyContactCreate, user_id: int) -> EmergencyContactModel:
    db_contact = db.query(EmergencyContactModel).filter(EmergencyContactModel.id == contact_id, EmergencyContactModel.user_id == user_id).first()
    if db_contact:
        update_data = contact_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_contact, key, value)
        db.commit()
        db.refresh(db_contact)
    return db_contact

def delete_emergency_contact(db: Session, contact_id: int, user_id: int) -> EmergencyContactModel:
    db_contact = db.query(EmergencyContactModel).filter(EmergencyContactModel.id == contact_id, EmergencyContactModel.user_id == user_id).first()
    if db_contact:
        db.delete(db_contact)
        db.commit()
    return db_contact