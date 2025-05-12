from celery import Celery
from celery.schedules import crontab

from app.config import settings
from app.logger import logger

celery_app = Celery("tasks", broker=settings.redis_url, include=["app.tasks.tasks"])
celery_app.conf.broker_connection_retry_on_startup = True

celery_app.conf.timezone = "UTC"
celery_app.conf.beat_schedule = {
    "clean-completed-sessions-every-12-hours": {
        "task": "app.tasks.clean_completed_sessions",
        "schedule": crontab(minute=0, hour="*/12"),
    },
    "clean-old-sessions-every-hour": {
        "task": "app.tasks.tasks.clean_old_sessions",
        "schedule": crontab(minute=0, hour="*"),
    },
}

logger.info("Celery app initialized with Redis broker at `%s`", settings.redis_url)
logger.info("Celery beat schedule loaded with %d periodic tasks", len(celery_app.conf.beat_schedule))
