FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    build-essential libpq-dev git postgresql-client redis-tools\
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_VERSION=2.0.0
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

WORKDIR /backend

COPY pyproject.toml poetry.lock ./

RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

COPY . .

RUN chmod a+x /backend/docker/*.sh || true

CMD ["gunicorn", "app.main:app", "--workers", "1", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind=0.0.0.0:8000"]
