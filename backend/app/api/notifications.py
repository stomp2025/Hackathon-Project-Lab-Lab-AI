# app/api/notifications.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import uuid

from ..dependencies import get_current_user
from ..models.user import User, UserRole

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
    responses={404: {"description": "Not found"}},
)

class NotificationType:
    REMINDER = "reminder"
    UPDATE = "update"
    ALERT = "alert"

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str
    target_roles: Optional[List[str]] = None  # If None, send to all users
    target_user_ids: Optional[List[str]] = None  # If provided, send only to these users

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    date: str
    read: bool = False

class NotificationPreferences(BaseModel):
    monthly_reminders: bool = True
    protocol_updates: bool = True
    training_alerts: bool = True
    emergency_drills: bool = True

# In-memory storage for notifications (would be a database in production)
notifications_db = {}
# In-memory storage for user notification preferences (would be a database in production)
user_preferences = {}

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(notification: NotificationCreate, current_user: User = Depends(get_current_user)):
    # Only coaches and referees can create notifications
    if current_user.role not in [UserRole.COACH, UserRole.REFEREE]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create notifications"
        )
    
    notification_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    new_notification = {
        "id": notification_id,
        "title": notification.title,
        "message": notification.message,
        "type": notification.type,
        "date": now,
        "created_by": current_user.id,
        "target_roles": notification.target_roles,
        "target_user_ids": notification.target_user_ids,
    }
    
    # Store in our mock database
    if "notifications" not in notifications_db:
        notifications_db["notifications"] = []
    
    notifications_db["notifications"].append(new_notification)
    
    return NotificationResponse(
        id=notification_id,
        title=notification.title,
        message=notification.message,
        type=notification.type,
        date=now,
        read=False
    )

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user)):
    if "notifications" not in notifications_db:
        return []
    
    # Filter notifications relevant to this user based on role and user ID
    user_notifications = []
    for notification in notifications_db["notifications"]:
        # Check if this notification is for all users
        if not notification.get("target_roles") and not notification.get("target_user_ids"):
            user_notifications.append(notification)
        # Check if this notification targets the user's role
        elif notification.get("target_roles") and current_user.role in notification.get("target_roles"):
            user_notifications.append(notification)
        # Check if this notification targets the user specifically
        elif notification.get("target_user_ids") and current_user.id in notification.get("target_user_ids"):
            user_notifications.append(notification)
    
    # Get user's read status for notifications
    user_read_status = {}
    if "read_status" in notifications_db and current_user.id in notifications_db["read_status"]:
        user_read_status = notifications_db["read_status"][current_user.id]
    
    # Format the response
    result = []
    for notification in user_notifications:
        is_read = user_read_status.get(notification["id"], False)
        result.append(NotificationResponse(
            id=notification["id"],
            title=notification["title"],
            message=notification["message"],
            type=notification["type"],
            date=notification["date"],
            read=is_read
        ))
    
    # Sort by date, newest first
    result.sort(key=lambda x: x.date, reverse=True)
    
    return result

@router.post("/{notification_id}/read")
def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user)):
    # Initialize read_status structure if it doesn't exist
    if "read_status" not in notifications_db:
        notifications_db["read_status"] = {}
    
    if current_user.id not in notifications_db["read_status"]:
        notifications_db["read_status"][current_user.id] = {}
    
    # Mark the notification as read
    notifications_db["read_status"][current_user.id][notification_id] = True
    
    return {"status": "success"}

@router.post("/read-all")
def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    if "notifications" not in notifications_db:
        return {"status": "success"}
    
    # Initialize read_status structure if it doesn't exist
    if "read_status" not in notifications_db:
        notifications_db["read_status"] = {}
    
    if current_user.id not in notifications_db["read_status"]:
        notifications_db["read_status"][current_user.id] = {}
    
    # Get all notifications relevant to this user
    user_notifications = []
    for notification in notifications_db["notifications"]:
        # Check if this notification is for all users
        if not notification.get("target_roles") and not notification.get("target_user_ids"):
            user_notifications.append(notification)
        # Check if this notification targets the user's role
        elif notification.get("target_roles") and current_user.role in notification.get("target_roles"):
            user_notifications.append(notification)
        # Check if this notification targets the user specifically
        elif notification.get("target_user_ids") and current_user.id in notification.get("target_user_ids"):
            user_notifications.append(notification)
    
    # Mark all as read
    for notification in user_notifications:
        notifications_db["read_status"][current_user.id][notification["id"]] = True
    
    return {"status": "success"}

@router.get("/preferences", response_model=NotificationPreferences)
def get_notification_preferences(current_user: User = Depends(get_current_user)):
    # Return default preferences if none are set
    if current_user.id not in user_preferences:
        return NotificationPreferences()
    
    return NotificationPreferences(**user_preferences[current_user.id])

@router.post("/preferences", response_model=NotificationPreferences)
def update_notification_preferences(
    preferences: NotificationPreferences, 
    current_user: User = Depends(get_current_user)
):
    # Update user preferences
    user_preferences[current_user.id] = preferences.dict()
    
    return preferences

# Endpoint to generate monthly reminder notifications
@router.post("/generate-monthly-reminders")
def generate_monthly_reminders(current_user: User = Depends(get_current_user)):
    # Only coaches can generate monthly reminders
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can generate monthly reminders"
        )
    
    # Create a monthly CPR protocol review reminder
    notification = NotificationCreate(
        title="Monthly CPR Protocol Review",
        message="It's time for your monthly review of CPR protocols. Please complete the review by the end of the week.",
        type=NotificationType.REMINDER,
        target_roles=[UserRole.ATHLETE, UserRole.TEAMMATE]
    )
    
    create_notification(notification, current_user)
    
    return {"status": "success", "message": "Monthly reminders generated successfully"}

# Endpoint to send protocol update notifications
@router.post("/send-protocol-update")
def send_protocol_update(
    title: str,
    message: str,
    current_user: User = Depends(get_current_user)
):
    # Only coaches can send protocol updates
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only coaches can send protocol updates"
        )
    
    # Create a protocol update notification
    notification = NotificationCreate(
        title=title,
        message=message,
        type=NotificationType.UPDATE
    )
    
    create_notification(notification, current_user)
    
    return {"status": "success", "message": "Protocol update sent successfully"}