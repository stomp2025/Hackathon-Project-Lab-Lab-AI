from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # Import CORSMiddleware
from app.api import auth, emergency_contacts, dashboard, emergency_alerts, incident_reports, emergency_simulations, notifications # Import all routers
from app.database import engine, Base # Import engine and Base for DB creation
from app.dependencies import get_current_user
from app.models.user import User

# Create database tables (if they don't exist) - typically done with Alembic in production
Base.metadata.create_all(bind=engine)

app = FastAPI(title="STOMP Backend API", version="0.1.0")

# CORS Middleware Configuration
origins = [
    "http://localhost",
    "http://localhost:8081", # Expo Web
    "http://localhost:8082", # Expo Web (alternative port)
    "http://localhost:19006", # Expo Metro Bundler
    "http://192.168.5.247:8081", # Expo Mobile (your IP)
    "http://192.168.5.247:8082", # Expo Mobile (alternative port)
    "http://192.168.5.247:19006", # Expo Mobile Metro
    # Add your frontend production URL here when you have one
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# Include the API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(emergency_contacts.router, prefix="/api/emergency-contacts", tags=["Emergency Contacts"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(emergency_alerts.router, prefix="/api/emergency-alerts", tags=["Emergency Alerts"])
app.include_router(incident_reports.router, prefix="/api/incident-reports", tags=["Incident Reports"])
app.include_router(emergency_simulations.router, prefix="/api/emergency-simulations", tags=["Emergency Simulations"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {"message": "Welcome to STOMP Backend"}