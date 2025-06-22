from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List

from app.services.push_service import send_push_notification, mock_user_tokens
from app.services.email_service import send_emergency_email

router = APIRouter(
    tags=["Test Endpoints"],
    responses={404: {"description": "Not found"}},
)

registered_tokens: List[str] = []

class TokenData(BaseModel):
    token: str

class NotificationData(BaseModel):
    title: str
    body: str
    token: str 

@router.post("/register-token")
def register_token(data: TokenData):
    if data.token not in registered_tokens:
        registered_tokens.append(data.token)
        return {"message": "token registered successfully", "token": data.token}
    return {"message": "Token already registered", "token": data.token}

@router.post("/test-push")
def test_push():
    if not registered_tokens:
        raise HTTPException(status_code=400, detail="Any registered tokens found. Please register a token first.")
    
    send_push_notification(
        "Notification test",
        "This is a test notification from STOMP Backend",
        registered_tokens
    )
    return {"status": "Notification sent", "token sent": registered_tokens}



@router.post("/test-email")
async def test_email():
    await send_emergency_email(
        to=["olamundoempy@gmail.com"],
        subject="Email Teste STOMP",
        body="""
        <h3>Test STOMP</h3>
        <p>This is a test Email</p>
        """
    )
    return {"message": "email sent successfully"}

