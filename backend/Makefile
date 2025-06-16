# Run in Git Bash

MAIN_APP = app.main:app
CELERY_APP = app.tasks.celery:celery_app
SRC_CODE_DIR = app/
POETRY_CMD = poetry run
EXCLUDE = migrations

.PHONY: run celery flower beat test format lint dev style clean

run:
	$(POETRY_CMD) uvicorn $(MAIN_APP) --reload

celery:
	$(POETRY_CMD) celery -A $(CELERY_APP) worker --loglevel=INFO --pool=solo -n worker@%h

flower:
	$(POETRY_CMD) celery -A $(CELERY_APP) flower

beat:
	$(POETRY_CMD) celery -A $(CELERY_APP) beat --loglevel=INFO

test:
	MODE=TEST $(POETRY_CMD) pytest 

format:
	$(POETRY_CMD) black $(SRC_CODE_DIR) --exclude=$(EXCLUDE)
	$(POETRY_CMD) isort $(SRC_CODE_DIR) --skip=$(EXCLUDE)

lint:
	$(POETRY_CMD) ruff check $(SRC_CODE_DIR) --exclude=$(EXCLUDE)
	$(POETRY_CMD) mypy $(SRC_CODE_DIR)

style: format lint

dev:
	$(MAKE) run & \
	$(MAKE) celery & \
	# sleep 5 && $(MAKE) flower & \
	# sleep 5 && $(MAKE) beat & \
	wait

clean:
	find . -type d -name "__pycache__" ! -path "./.venv/*" -exec rm -rf {} +
	find . -type f \( -name "*.pyc" -o -name "*.pyo" -o -name "*.pyd" \) ! -path "./.venv/*" -delete
	rm -rf .coverage .pytest_cache .mypy_cache .ruff_cache