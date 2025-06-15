from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
import json

from app.services.auth_service import decode_access_token, TokenData
from app.services.emergency_alert_service import manager, simulate_cardiac_anomaly
from app.database import get_db
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_access_token(token)
    if token_data is None or token_data.id is None:
        raise credentials_exception
    return token_data

@router.websocket("/ws/{user_id}/{role}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, role: str):
    await manager.connect(websocket, user_id, role)
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                # Handle different message types
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": message.get("timestamp")})
                elif message.get("type") == "emergency_response":
                    # Handle emergency response messages
                    # This could be used to track who is responding to an emergency
                    response_data = {
                        "type": "emergency_update",
                        "emergency_id": message.get("emergency_id"),
                        "responder": {
                            "user_id": user_id,
                            "role": role,
                            "status": message.get("status", "responding"),
                            "eta": message.get("eta")
                        }
                    }
                    # Broadcast the response to relevant parties
                    if "athlete_id" in message:
                        await manager.send_personal_message(response_data, message["athlete_id"], "athlete")
                    await manager.broadcast_by_role(response_data, "coach")
                    await manager.broadcast_by_role(response_data, "referee")
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON format"})
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id, role)

@router.post("/trigger-emergency")
async def trigger_emergency(
    location: Dict[str, float] = Body(...),
    athlete_name: str = Body(...),
    current_user: TokenData = Depends(get_current_user)
):
    """Debug endpoint to trigger a simulated emergency alert"""
    if not current_user.id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    emergency_data = await simulate_cardiac_anomaly(
        athlete_id=str(current_user.id),
        athlete_name=athlete_name,
        location=location
    )
    
    return {"status": "Emergency alert triggered", "emergency_id": emergency_data["id"]}

@router.get("/active-emergencies")
async def get_active_emergencies(current_user: TokenData = Depends(get_current_user)):
    """Get all active emergency alerts"""
    return {"emergencies": manager.get_active_emergencies()}

@router.post("/resolve-emergency/{emergency_id}")
async def resolve_emergency(emergency_id: str, current_user: TokenData = Depends(get_current_user)):
    """Mark an emergency as resolved"""
    if manager.resolve_emergency(emergency_id):
        return {"status": "Emergency resolved", "emergency_id": emergency_id}
    raise HTTPException(status_code=404, detail="Emergency not found or already resolved")