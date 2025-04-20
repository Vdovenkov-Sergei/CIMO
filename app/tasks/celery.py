from celery import Celery

from app.config import settings

celery_app = Celery("tasks", broker=settings.redis_url, include=["app.tasks.tasks"])
celery_app.conf.broker_connection_retry_on_startup = True

celery_app.conf.timezone = "UTC"
celery_app.conf.beat_schedule = {}

import app.tasks.celeryconfig as celeryconfig

celery_app.conf.update(vars(celeryconfig))
