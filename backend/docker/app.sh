#!/bin/bash

source /backend/docker/wait-for.sh

WORKERS=${WORKERS:-$(( $(nproc 2>/dev/null || echo 1) * 2 + 1 ))}
CELERY_CONCURRENCY=${CELERY_CONCURRENCY:-2}
CELERY_POOL=${CELERY_POOL:-prefork}
CELERY_AUTOSCALE=${CELERY_AUTOSCALE:-4,2}

if [[ "${1}" == "app" ]]; then
  gunicorn app.main:app \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind=0.0.0.0:8000 \
    --timeout 60 \
    --forwarded-allow-ips="*"

elif [[ "${1}" == "celery" ]]; then
  celery --app=app.tasks.celery:celery_app worker \
    --loglevel=INFO \
    -n worker_${HOSTNAME}@%h \
    -c $CELERY_CONCURRENCY \
    --pool=$CELERY_POOL \
    --autoscale=$CELERY_AUTOSCALE

elif [[ "${1}" == "flower" ]]; then
  celery --app=app.tasks.celery:celery_app flower --port=5555

elif [[ "${1}" == "beat" ]]; then
  celery --app=app.tasks.celery:celery_app beat --loglevel=INFO

else
  echo "Unknown command: $1"
  exit 1
fi
