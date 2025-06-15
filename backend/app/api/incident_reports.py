from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import uuid

from app.models.user import UserRole
from app.services.auth_service import decode_access_token, TokenData
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

# Mock incident data store (in a real app, this would be in a database)
incident_reports = {}

@router.post("/generate")
async def generate_incident_report(
    emergency_id: str = Body(...),
    current_user: TokenData = Depends(get_current_user)
):
    """Generate a new incident report for a completed emergency"""
    # Check if user has permission (coach or referee)
    if current_user.role not in [UserRole.coach, UserRole.referee]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches and referees can generate incident reports"
        )
    
    # In a real app, we would fetch the emergency details from the database
    # For now, we'll generate mock data
    
    # Generate a unique report ID
    report_id = str(uuid.uuid4())
    
    # Create timestamp for the report
    timestamp = datetime.now().isoformat()
    
    # Mock data for the incident report
    report = {
        "id": report_id,
        "emergency_id": emergency_id,
        "generated_by": current_user.id,
        "generated_at": timestamp,
        "athlete_data": {
            "id": random.randint(1, 100),
            "name": "John Doe",
            "age": random.randint(18, 35),
            "team": "Team Alpha"
        },
        "incident_details": {
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat(),
            "location": "Field 3, North Section",
            "initial_heart_rate": random.randint(150, 200),
            "detected_anomaly": "Ventricular Tachycardia",
            "alert_triggered_at": (datetime.now() - timedelta(hours=random.randint(1, 24), minutes=random.randint(1, 10))).isoformat(),
        },
        "response_details": {
            "first_responder": "Coach Sarah Smith",
            "response_time_seconds": random.randint(30, 180),
            "cpr_initiated": random.choice([True, False]),
            "aed_used": random.choice([True, False]),
            "emergency_services_called": random.choice([True, False]),
            "emergency_services_arrival_time": random.randint(300, 900)
        },
        "outcome": {
            "status": random.choice(["Recovered", "Hospitalized", "Critical"]),
            "notes": "Athlete was stabilized on-site and transported to Memorial Hospital."
        },
        "follow_up_actions": [
            "Schedule cardiac evaluation",
            "Review emergency response protocol",
            "Update athlete medical records"
        ]
    }
    
    # Store the report
    incident_reports[report_id] = report
    
    return {"report_id": report_id, "message": "Incident report generated successfully"}

@router.get("/list")
async def list_incident_reports(current_user: TokenData = Depends(get_current_user)):
    """List all incident reports accessible to the current user"""
    # Check if user has permission (coach or referee)
    if current_user.role not in [UserRole.coach, UserRole.referee]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches and referees can access incident reports"
        )
    
    # In a real app, we would filter reports based on the user's team/organization
    # For now, return all mock reports
    reports_list = [
        {
            "id": report_id,
            "emergency_id": report["emergency_id"],
            "athlete_name": report["athlete_data"]["name"],
            "incident_date": report["incident_details"]["timestamp"],
            "status": report["outcome"]["status"]
        }
        for report_id, report in incident_reports.items()
    ]
    
    return {"reports": reports_list}

@router.get("/{report_id}")
async def get_incident_report(
    report_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific incident report by ID"""
    # Check if user has permission (coach or referee)
    if current_user.role not in [UserRole.coach, UserRole.referee]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches and referees can access incident reports"
        )
    
    # Check if the report exists
    if report_id not in incident_reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incident report not found"
        )
    
    return incident_reports[report_id]