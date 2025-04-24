BACKEND_DIR = backend
FRONTEND_DIR = frontend

.PHONY: backend-dev backend-test backend-style backend-clean \
        frontend-dev frontend-build frontend-lint frontend-clean \
        dev test style check install clean venv

## -------------------- BACKEND --------------------

backend-dev:
	cd $(BACKEND_DIR) && make dev

backend-test:
	cd $(BACKEND_DIR) && make test

backend-style:
	cd $(BACKEND_DIR) && make style

backend-clean:
	cd $(BACKEND_DIR) && make clean

## -------------------- FRONTEND --------------------

frontend-dev:
	cd $(FRONTEND_DIR) && npm run dev

frontend-build:
	cd $(FRONTEND_DIR) && npm run build

frontend-lint:
	cd $(FRONTEND_DIR) && npm run lint

frontend-clean:
	cd $(FRONTEND_DIR) && rm -rf dist node_modules .vite

## -------------------- ОБЩИЕ --------------------

dev: 
	$(MAKE) backend-dev & \
	$(MAKE) frontend-dev & \
	wait

test: backend-test

style: backend-style frontend-lint

check: style test

install:
	cd $(BACKEND_DIR) && poetry install --no-root
	cd $(FRONTEND_DIR) && npm install

clean: backend-clean frontend-clean

venv:
	@if [ "$$OS" = "Windows_NT" ]; then \
		cmd /k "$(BACKEND_DIR)\\.venv\\Scripts\\activate.bat"; \
	else \
		bash --init-file <(echo "source $(BACKEND_DIR)/.venv/bin/activate"); \
	fi
