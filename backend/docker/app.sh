#!/bin/bash

source /backend/docker/wait-for.sh

if [[ "${1}" == "app" ]]; then
  gunicorn app.main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000
elif [[ "${1}" == "celery" ]]; then
  celery --app=app.tasks.celery:celery_app worker --loglevel=INFO --pool=solo -n worker@%h
elif [[ "${1}" == "flower" ]]; then
  celery --app=app.tasks.celery:celery_app flower
elif [[ "${1}" == "beat" ]]; then
    celery --app=app.tasks.celery:celery_app beat --loglevel=INFO
fi
