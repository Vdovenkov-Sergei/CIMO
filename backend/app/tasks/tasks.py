import asyncio
import smtplib
from email.message import EmailMessage
from functools import wraps
from typing import Any, Callable

from celery import shared_task
from pydantic import EmailStr

from app.config import settings
from app.sessions.dao import SessionDAO
from app.tasks.celery import celery_app
from app.tasks.email_templates import create_reset_password_template, create_verification_template


def email_sender(func: Callable[..., EmailMessage]) -> Callable[..., None]:
    @wraps(func)
    def wrapper(*args: tuple[Any], **kwargs: dict[str, Any]) -> None:
        msg_content = func(*args, **kwargs)
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg_content)

    return wrapper


@celery_app.task  # type: ignore
@email_sender
def send_verification_email(email_to: EmailStr, code: str) -> EmailMessage:
    return create_verification_template(email_to, code)


@celery_app.task  # type: ignore
@email_sender
def send_email_with_reset_link(email_to: EmailStr, reset_link: str) -> EmailMessage:
    return create_reset_password_template(email_to, reset_link)


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
