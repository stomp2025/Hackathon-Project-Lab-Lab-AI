from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import asyncio
from fastapi import WebSocket

# Store active WebSocket connections
class ConnectionManager:
    def __init__(self):
        # Store connections by user_id and role
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Track emergency alerts
        self.active_emergencies: Dict[str, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, role: str):
        await websocket.accept()
        # Create a connection key that includes both user_id and role
        connection_key = f"{user_id}:{role}"
        
        if connection_key not in self.active_connections:
            self.active_connections[connection_key] = []
        
        self.active_connections[connection_key].append(websocket)
    
    def disconnect(self, websocket: WebSocket, user_id: str, role: str):
        connection_key = f"{user_id}:{role}"
        
        if connection_key in self.active_connections:
            if websocket in self.active_connections[connection_key]:
                self.active_connections[connection_key].remove(websocket)
            
            # Clean up empty lists
            if not self.active_connections[connection_key]:
                del self.active_connections[connection_key]
    
    async def send_personal_message(self, message: Dict[str, Any], user_id: str, role: str):
        connection_key = f"{user_id}:{role}"
        
        if connection_key in self.active_connections:
            for connection in self.active_connections[connection_key]:
                await connection.send_json(message)
    
    async def broadcast_by_role(self, message: Dict[str, Any], role: str):
        # Send to all connections with the specified role
        for connection_key, connections in self.active_connections.items():
            if connection_key.endswith(f":{role}"):
                for connection in connections:
                    await connection.send_json(message)
    
    async def broadcast_emergency_alert(self, emergency_data: Dict[str, Any]):
        # Store the emergency
        emergency_id = str(emergency_data.get("id", datetime.now().timestamp()))
        self.active_emergencies[emergency_id] = emergency_data
        
        # Prepare different messages based on role
        athlete_message = {
            "type": "emergency_alert",
            "severity": "critical",
            "message": "Medical emergency detected. Help is on the way.",
            "data": emergency_data
        }
        
        medical_message = {
            "type": "emergency_alert",
            "severity": "critical",
            "message": f"URGENT: Athlete {emergency_data.get('athlete_name', 'Unknown')} needs immediate assistance!",
            "data": emergency_data
        }
        
        # Send to the affected athlete
        if "athlete_id" in emergency_data:
            await self.send_personal_message(athlete_message, emergency_data["athlete_id"], "athlete")
        
        # Send to all coaches, referees, and medical staff
        await self.broadcast_by_role(medical_message, "coach")
        await self.broadcast_by_role(medical_message, "referee")
        await self.broadcast_by_role(medical_message, "teammate")
    
    def get_active_emergencies(self) -> Dict[str, Dict[str, Any]]:
        return self.active_emergencies
    
    def resolve_emergency(self, emergency_id: str) -> bool:
        if emergency_id in self.active_emergencies:
            del self.active_emergencies[emergency_id]
            return True
        return False

# Create a global instance of the connection manager
manager = ConnectionManager()

# Simulate cardiac anomaly detection
async def simulate_cardiac_anomaly(athlete_id: str, athlete_name: str, location: Dict[str, float]):
    # Create emergency data
    emergency_data = {
        "id": f"emergency_{datetime.now().timestamp()}",
        "type": "cardiac_anomaly",
        "athlete_id": athlete_id,
        "athlete_name": athlete_name,
        "timestamp": datetime.now().isoformat(),
        "location": location,
        "vital_signs": {
            "heart_rate": 180,  # Elevated heart rate
            "blood_pressure": "160/100",  # Elevated blood pressure
            "oxygen_saturation": 88,  # Low oxygen
            "respiratory_rate": 28  # Elevated respiratory rate
        },
        "status": "active"
    }
    
    # Broadcast the emergency alert
    await manager.broadcast_emergency_alert(emergency_data)
    
    return emergency_data