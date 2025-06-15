from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from pydantic import BaseModel
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from the backend directory if not already set
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    backend_dir = Path(__file__).parent.parent.parent
    env_path = backend_dir / ".env"
    load_dotenv(env_path)
    SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

# Configuration - Require JWT secret key, fail if not set
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable is required and must be set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TokenData(BaseModel):
    email: Optional[str] = None
    id: Optional[int] = None
    role: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        user_id: Optional[int] = payload.get("id")
        user_role: Optional[str] = payload.get("role")
        if email is None or user_id is None or user_role is None:
            return None # Or raise an exception
        return TokenData(email=email, id=user_id, role=user_role)
    except JWTError:
        return None # Or raise an exception