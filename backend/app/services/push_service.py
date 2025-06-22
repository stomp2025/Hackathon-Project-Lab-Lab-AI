import firebase_admin
from firebase_admin import credentials, messaging
from typing import List

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate("app/firebase-adminsdk.json") 
    firebase_admin.initialize_app(cred)

mock_user_tokens = {
    "user123": ["d4ubSKwieWD-IATsATs8Hl:APA91bFqL..."],
    "user456": ["fcm_token_2"],
    "user789": ["fcm_token_3"],
}

def send_push_notification(title: str, body: str, tokens: List[str]):
    if not tokens:
        print("Token list is empty. No push notification sent.")
        return

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        tokens=tokens,
    )

    try:
        response = messaging.send_multicast(message)
        print(f"Push sent: {response.success_count} sucessefuly, {response.failure_count} failed.")
        for idx, resp in enumerate(response.responses):
            if not resp.success:
                print(f"Error token {tokens[idx]}: {resp.exception}")
    except Exception as e:
        print("Error send notificatio:", str(e))
