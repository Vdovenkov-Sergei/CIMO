import smtplib
from pydantic import EmailStr

from app.config import settings
from app.tasks.celery import celery_app
from app.tasks.email_templates import create_verification_template


@celery_app.task
def send_verification_email(email_to: EmailStr, code: str) -> None:
    msg_content = create_verification_template(email_to, code)

    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg_content)
