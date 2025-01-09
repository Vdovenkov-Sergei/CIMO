# Edit if need
APP_NAME = main
CODE = app/ tests/ $(APP_NAME).py

# PEP8 - 79 symbols
MAX_LINE_LENGTH = 120
FAILS = 1

.PHONY: format run test update lint clean

format:
	black --line-length $(MAX_LINE_LENGTH) $(CODE)

run:
	poetry run uvicorn $(APP_NAME):app --reload

test:
	poetry run pytest -k "$(TEST_NAME)" -m "$(MARKERS)" --maxfail=$(FAILS) -q --cov=app/ --cov-report=term-missing

update:
	poetry update

lint:
	flake8 $(CODE) --max-line-length=$(MAX_LINE_LENGTH) --exclude=$(EXCLUDE) --verbose

clean:
	rm -rf **/__pycache__ **/*.pyc **/*.pyo .coverage .pytest_cache