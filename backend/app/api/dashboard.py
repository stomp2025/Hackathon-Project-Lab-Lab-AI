from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

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

# Mock data generators
def generate_vital_signs() -> Dict[str, Any]:
    """Generate mock vital signs data for an athlete"""
    return {
        "heart_rate": random.randint(60, 100),
        "blood_pressure": f"{random.randint(110, 140)}/{random.randint(70, 90)}",
        "body_temperature": round(random.uniform(36.1, 37.5), 1),
        "respiratory_rate": random.randint(12, 20),
        "oxygen_saturation": random.randint(95, 100),
        "timestamp": datetime.now().isoformat()
    }

def generate_cpr_status() -> Dict[str, Any]:
    """Generate mock CPR system status"""
    return {
        "device_status": random.choice(["active", "standby"]),
        "battery_level": random.randint(70, 100),
        "last_checked": (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat(),
        "firmware_version": "v2.1.3"
    }

def generate_athlete_status(athlete_id: int) -> Dict[str, Any]:
    """Generate mock status data for a single athlete"""
    status = random.choice(["normal", "normal", "normal", "elevated", "warning"])
    return {
        "id": athlete_id,
        "name": f"Athlete {athlete_id}",
        "status": status,
        "last_updated": datetime.now().isoformat(),
        "heart_rate": random.randint(60, 100) if status == "normal" else random.randint(100, 140),
        "location": "Field Zone A" if status != "warning" else "Medical Tent"
    }

# API Endpoints
@router.get("/athlete")
async def get_athlete_dashboard(current_user: TokenData = Depends(get_current_user)):
    """Get dashboard data for an athlete user"""
    if current_user.role != UserRole.athlete.value:
        raise HTTPException(status_code=403, detail="Access denied: Athlete role required")
    
    return {
        "vital_signs": generate_vital_signs(),
        "cpr_system": generate_cpr_status(),
        "emergency_contacts": [
            {"id": 1, "name": "Team Doctor", "phone": "555-123-4567", "relationship": "Medical Staff"},
            {"id": 2, "name": "Head Coach", "phone": "555-987-6543", "relationship": "Coach"},
            {"id": 3, "name": "Emergency Contact", "phone": "555-456-7890", "relationship": "Family"}
        ]
    }

@router.get("/coach")
async def get_coach_dashboard(current_user: TokenData = Depends(get_current_user)):
    """Get dashboard data for a coach user"""
    if current_user.role != UserRole.coach.value:
        raise HTTPException(status_code=403, detail="Access denied: Coach role required")
    
    # Generate mock data for multiple athletes
    athletes = [generate_athlete_status(i) for i in range(1, 11)]
    
    return {
        "team_overview": {
            "total_athletes": len(athletes),
            "status_summary": {
                "normal": sum(1 for a in athletes if a["status"] == "normal"),
                "elevated": sum(1 for a in athletes if a["status"] == "elevated"),
                "warning": sum(1 for a in athletes if a["status"] == "warning"),
            }
        },
        "athletes": athletes
    }

@router.get("/coach/athlete/{athlete_id}")
async def get_athlete_details(athlete_id: int, current_user: TokenData = Depends(get_current_user)):
    """Get detailed data for a specific athlete (coach view)"""
    if current_user.role != UserRole.coach.value:
        raise HTTPException(status_code=403, detail="Access denied: Coach role required")
    
    # In a real app, we would check if this coach has permission to view this athlete's data
    
    return {
        "athlete_info": {
            "id": athlete_id,
            "name": f"Athlete {athlete_id}",
            "age": random.randint(18, 35),
            "position": random.choice(["Forward", "Midfielder", "Defender", "Goalkeeper"]),
            "jersey_number": random.randint(1, 99)
        },
        "vital_signs": generate_vital_signs(),
        "cpr_system": generate_cpr_status(),
        "training_load": {
            "today": random.randint(300, 800),
            "weekly_average": random.randint(400, 700),
            "status": random.choice(["normal", "high", "low"])
        },
        "recent_history": [
            {"date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"), 
             "status": random.choice(["normal", "normal", "elevated"]), 
             "notes": ""} 
            for i in range(1, 8)
        ]
    }

@router.get("/teammate")
async def get_teammate_dashboard(current_user: TokenData = Depends(get_current_user)):
    """Get dashboard data for a teammate user"""
    if current_user.role != UserRole.teammate.value:
        raise HTTPException(status_code=403, detail="Access denied: Teammate role required")
    
    return {
        "team_status": {
            "alerts": [],  # Empty if no emergencies
            "practice_schedule": {
                "today": "3:00 PM - Field A",
                "tomorrow": "Rest Day",
                "day_after": "10:00 AM - Gym Session"
            },
            "team_announcements": [
                {"title": "Team Meeting", "content": "Team meeting scheduled for Friday at 2 PM", "date": "2023-06-15"}
            ]
        }
    }

@router.get("/referee")
async def get_referee_dashboard(current_user: TokenData = Depends(get_current_user)):
    """Get dashboard data for a referee user"""
    if current_user.role != UserRole.referee.value:
        raise HTTPException(status_code=403, detail="Access denied: Referee role required")
    
    return {
        "match_info": {
            "current_match": {
                "teams": "Team A vs Team B",
                "location": "Main Stadium",
                "time": "3:00 PM",
                "status": "Upcoming"
            },
            "alerts": [],  # Empty if no emergencies
            "emergency_protocol": {
                "medical_staff_location": "North Entrance",
                "emergency_exits": ["East Gate", "West Gate", "South Tunnel"],
                "emergency_contacts": [
                    {"role": "Medical Director", "name": "Dr. Smith", "phone": "555-111-2222"}
                ]
            }
        }
    }