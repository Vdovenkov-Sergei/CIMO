import asyncio
import smtplib
from datetime import UTC, datetime
from email.message import EmailMessage

from celery import shared_task
from pydantic import EmailStr
from sqlalchemy import delete

from app.config import settings
from app.database import async_session_maker
from app.sessions.models import Session, SessionStatus
from app.tasks.celery import celery_app
from app.tasks.email_templates import create_verification_template


@celery_app.task  # type: ignore
def send_verification_email(email_to: EmailStr, code: str) -> None:
    msg_content: EmailMessage = create_verification_template(email_to, code)

    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg_content)


@shared_task
def clean_completed_sessions():
    asyncio.run(_clean_completed_sessions())


async def _clean_completed_sessions():
    query = delete(Session).where(
        Session.status == SessionStatus.COMPLETED,
        Session.ended_at != None,
        Session.ended_at < datetime.now(UTC),
    )
    async with async_session_maker() as session:
        await session.execute(query)
        await session.commit()
