from celery.schedules import crontab

beat_schedule = {
    "clean-completed-sessions-every-12-hours": {
        "task": "app.tasks.clean_completed_sessions",
        "schedule": crontab(minute=0, hour="*/12"),
    },
}

timezone = "UTC"
