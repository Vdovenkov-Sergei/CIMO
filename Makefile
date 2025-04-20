MAIN_APP = app.main:app
CELERY_APP = app.tasks.celery:celery_app
SRC_CODE_DIR = app/
POETRY_CMD = poetry run
EXCLUDE = migrations

.PHONY: format run celery flower beat test lint clean

format:
	$(POETRY_CMD) black $(SRC_CODE_DIR) --exclude=$(EXCLUDE)
	$(POETRY_CMD) isort $(SRC_CODE_DIR) --skip=$(EXCLUDE)

run:
	$(POETRY_CMD) uvicorn $(MAIN_APP) --reload

celery:
	$(POETRY_CMD) celery -A $(CELERY_APP) worker --loglevel=INFO --pool=solo

flower:
	$(POETRY_CMD) celery -A $(CELERY_APP) flower

beat:
	$(POETRY_CMD) celery -A $(CELERY_APP) beat --loglevel=INFO

test:
	$(POETRY_CMD) pytest -k "$(TEST_NAME)" -m "$(MARKERS)" -q --cov=$(SRC_CODE_DIR) --cov-report=term-missing

lint:
	$(POETRY_CMD) ruff check $(SRC_CODE_DIR) --exclude=$(EXCLUDE)
	$(POETRY_CMD) mypy $(SRC_CODE_DIR) --exclude=$(EXCLUDE)

clean:
	find . -type d -name "__pycache__" ! -path "./.venv/*" -exec rm -rf {} +
	find . -type f \( -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" \) ! -path "./.venv/*" -delete
	rm -rf .coverage .pytest_cache .mypy_cache .ruff_cache
