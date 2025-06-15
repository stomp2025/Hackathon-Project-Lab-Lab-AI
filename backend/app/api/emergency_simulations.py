from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
import random
import uuid
import asyncio

from app.models.user import UserRole
from app.services.auth_service import decode_access_token, TokenData
from app.services.emergency_alert_service import manager
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

# Store active simulations
active_simulations = {}

@router.post("/start")
async def start_emergency_simulation(
    simulation_data: Dict[str, Any] = Body(...),
    current_user: TokenData = Depends(get_current_user)
):
    """Start a new emergency simulation drill"""
    # Check if user has permission (coach only)
    if current_user.role != UserRole.coach:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can start emergency simulations"
        )
    
    # Generate a unique simulation ID
    simulation_id = str(uuid.uuid4())
    
    # Create timestamp for the simulation
    timestamp = datetime.now().isoformat()
    
    # Extract data from request
    athlete_id = simulation_data.get("athlete_id", str(random.randint(1, 100)))
    athlete_name = simulation_data.get("athlete_name", "Simulated Athlete")
    location = simulation_data.get("location", "Training Field")
    anomaly_type = simulation_data.get("anomaly_type", "Ventricular Fibrillation")
    
    # Create the simulation emergency data
    emergency_data = {
        "id": simulation_id,
        "type": "simulation",  # Mark as simulation
        "athlete_id": athlete_id,
        "athlete_name": athlete_name,
        "detected_at": timestamp,
        "anomaly_type": anomaly_type,
        "heart_rate": random.randint(150, 220),
        "location": {
            "latitude": simulation_data.get("latitude", 37.7749),
            "longitude": simulation_data.get("longitude", -122.4194),
            "description": location
        },
        "initiated_by": {
            "id": current_user.id,
            "role": current_user.role
        },
        "responders": []
    }
    
    # Store the simulation
    active_simulations[simulation_id] = {
        **emergency_data,
        "start_time": timestamp,
        "end_time": None,
        "status": "active",
        "response_times": {}
    }
    
    # Broadcast the emergency alert to all relevant users
    # In a real app, we would filter by team/organization
    asyncio.create_task(
        manager.broadcast_emergency_alert({
            "type": "emergency_alert",
            "emergency": emergency_data,
            "is_simulation": True
        })
    )
    
    return {
        "simulation_id": simulation_id,
        "message": "Emergency simulation started successfully",
        "started_at": timestamp
    }

@router.post("/end/{simulation_id}")
async def end_emergency_simulation(
    simulation_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """End an active emergency simulation drill"""
    # Check if user has permission (coach only)
    if current_user.role != UserRole.coach:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can end emergency simulations"
        )
    
    # Check if the simulation exists
    if simulation_id not in active_simulations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Check if the simulation was started by the current user
    if active_simulations[simulation_id]["initiated_by"]["id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only end simulations that you started"
        )
    
    # Update the simulation status
    active_simulations[simulation_id]["status"] = "completed"
    active_simulations[simulation_id]["end_time"] = datetime.now().isoformat()
    
    # Broadcast the end of the simulation
    asyncio.create_task(
        manager.broadcast_emergency_alert({
            "type": "emergency_resolved",
            "emergency_id": simulation_id,
            "is_simulation": True,
            "resolved_at": active_simulations[simulation_id]["end_time"],
            "resolved_by": {
                "id": current_user.id,
                "role": current_user.role
            }
        })
    )
    
    return {
        "simulation_id": simulation_id,
        "message": "Emergency simulation ended successfully",
        "ended_at": active_simulations[simulation_id]["end_time"],
        "duration_seconds": calculate_duration(active_simulations[simulation_id]["start_time"], active_simulations[simulation_id]["end_time"]),
        "responders": active_simulations[simulation_id]["responders"]
    }

@router.get("/active")
async def list_active_simulations(current_user: TokenData = Depends(get_current_user)):
    """List all active emergency simulations"""
    # Check if user has permission (coach only)
    if current_user.role != UserRole.coach:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can view emergency simulations"
        )
    
    # Filter simulations by status and initiated_by
    user_simulations = [
        {
            "id": sim_id,
            "athlete_name": sim["athlete_name"],
            "started_at": sim["start_time"],
            "location": sim["location"]["description"],
            "responder_count": len(sim["responders"])
        }
        for sim_id, sim in active_simulations.items()
        if sim["status"] == "active" and sim["initiated_by"]["id"] == current_user.id
    ]
    
    return {"simulations": user_simulations}

@router.get("/{simulation_id}")
async def get_simulation_details(
    simulation_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get details of a specific emergency simulation"""
    # Check if user has permission (coach only)
    if current_user.role != UserRole.coach:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can view emergency simulations"
        )
    
    # Check if the simulation exists
    if simulation_id not in active_simulations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Simulation not found"
        )
    
    # Check if the simulation was started by the current user
    if active_simulations[simulation_id]["initiated_by"]["id"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view simulations that you started"
        )
    
    return active_simulations[simulation_id]

# Helper function to calculate duration between two ISO timestamps
def calculate_duration(start_time: str, end_time: str) -> int:
    """Calculate the duration in seconds between two ISO timestamps"""
    start = datetime.fromisoformat(start_time)
    end = datetime.fromisoformat(end_time)
    return int((end - start).total_seconds())