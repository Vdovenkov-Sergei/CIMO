# ruff: noqa: F403

import asyncio
import smtplib
from email.message import EmailMessage
from functools import wraps
from typing import Any, Callable, ParamSpec, TypeVar

from celery import shared_task
from pydantic import EmailStr

from app.chats.models import *
from app.config import settings
from app.logger import logger
from app.sessions.dao import SessionDAO
from app.tasks.celery import celery_app
from app.tasks.email_templates import create_reset_password_template, create_verification_template


def run_async_safely(coro: Any) -> Any:
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return asyncio.ensure_future(coro)
        return loop.run_until_complete(coro)
    except RuntimeError:
        return asyncio.run(coro)


P = ParamSpec("P")
R = TypeVar("R")


def email_sender(func: Callable[P, EmailMessage]) -> Callable[P, EmailMessage]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> EmailMessage:
        msg_content = func(*args, **kwargs)
        try:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASS)
                server.send_message(msg_content)
            logger.info("Email successfully sent.", extra={"email": msg_content["To"]})
        except Exception as err:
            logger.error(
                "Error: failed to send email.", extra={"email": msg_content["To"], "error": str(err)}, exc_info=True
            )
            raise
        return msg_content

    return wrapper


def log_task(func: Callable[P, R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        logger.info("Task started.", extra={"task_name": func.__name__})
        try:
            result = func(*args, **kwargs)
            logger.info("Task completed.", extra={"task_name": func.__name__})
            return result
        except Exception as err:
            logger.error("Error: task failed.", extra={"task_name": func.__name__, "error": str(err)}, exc_info=True)
            raise

    return wrapper


@celery_app.task  # type: ignore
@log_task
@email_sender
def send_verification_email(email_to: EmailStr, code: str) -> EmailMessage:
    return create_verification_template(email_to, code)


@celery_app.task  # type: ignore
@log_task
@email_sender
def send_email_with_reset_link(email_to: EmailStr, reset_link: str) -> EmailMessage:
    return create_reset_password_template(email_to, reset_link)


@shared_task  # type: ignore
@log_task
def clean_completed_sessions() -> None:
    run_async_safely(_clean_completed_sessions())
    return None


@shared_task  # type: ignore
@log_task
def clean_old_sessions() -> None:
    run_async_safely(_clean_old_sessions())
    return None


async def _clean_completed_sessions() -> None:
    await SessionDAO.clean_completed_sessions()


async def _clean_old_sessions() -> None:
    await SessionDAO.clean_old_sessions()
