from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.emergency_contact import EmergencyContactCreate, EmergencyContactResponse, EmergencyContact as EmergencyContactModel
from app.models.user import User as UserModel
from app.services.emergency_contact_service import (
    create_emergency_contact,
    get_emergency_contacts_by_user,
    get_emergency_contact,
    update_emergency_contact,
    delete_emergency_contact
)
from app.services.auth_service import decode_access_token, TokenData
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login") # Adjusted tokenUrl to match auth router

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_access_token(token)
    if token_data is None or token_data.id is None:
        raise credentials_exception
    
    # Validate that the user still exists and is active
    user = db.query(UserModel).filter(UserModel.id == token_data.id).first()
    if user is None:
        raise credentials_exception
    
    return token_data

@router.post("/", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED)
def add_emergency_contact(
    contact: EmergencyContactCreate, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.id is None: # Should be caught by get_current_user, but as a safeguard
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User ID not found in token")
    return create_emergency_contact(db=db, contact=contact, user_id=current_user.id)

@router.get("/", response_model=List[EmergencyContactResponse])
def read_emergency_contacts(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User ID not found in token")
    contacts = get_emergency_contacts_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return contacts

@router.get("/{contact_id}", response_model=EmergencyContactResponse)
def read_single_emergency_contact(
    contact_id: int, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User ID not found in token")
    db_contact = get_emergency_contact(db, contact_id=contact_id, user_id=current_user.id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Emergency contact not found")
    return db_contact

@router.put("/{contact_id}", response_model=EmergencyContactResponse)
def edit_emergency_contact(
    contact_id: int, 
    contact: EmergencyContactCreate, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User ID not found in token")
    db_contact = update_emergency_contact(db, contact_id=contact_id, contact_update=contact, user_id=current_user.id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Emergency contact not found or not authorized to update")
    return db_contact

@router.delete("/{contact_id}", response_model=EmergencyContactResponse)
def remove_emergency_contact(
    contact_id: int, 
    db: Session = Depends(get_db), 
    current_user: TokenData = Depends(get_current_user)
):
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User ID not found in token")
    db_contact = delete_emergency_contact(db, contact_id=contact_id, user_id=current_user.id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="Emergency contact not found or not authorized to delete")
    return db_contact