# api/email_service.py
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic_settings import BaseSettings
from pydantic import EmailStr

class MailSettings(BaseSettings):
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool

    class Config:
        env_file = ".env.mail"

settings = MailSettings()

print("📧 Config de email carregada:", settings.dict())

conf = ConnectionConfig(**settings.dict())

async def send_emergency_email(to: list[EmailStr], subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=to,
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
