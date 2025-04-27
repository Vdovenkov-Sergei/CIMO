import asyncio
import smtplib
from email.message import EmailMessage

from celery import shared_task
from pydantic import EmailStr

from app.config import settings
from app.tasks.celery import celery_app
from app.tasks.email_templates import create_verification_template
from app.sessions.dao import SessionDAO


@celery_app.task  # type: ignore
def send_verification_email(email_to: EmailStr, code: str) -> None:
    msg_content: EmailMessage = create_verification_template(email_to, code)

    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg_content)


@shared_task  # type: ignore
def clean_completed_sessions() -> None:
    asyncio.run(_clean_completed_sessions())


@shared_task  # type: ignore
def clean_old_sessions() -> None:
    asyncio.run(_clean_old_sessions())


async def _clean_completed_sessions() -> None:
    await SessionDAO.clean_completed_sessions()


async def _clean_old_sessions() -> None:
    await SessionDAO.clean_old_sessions()
