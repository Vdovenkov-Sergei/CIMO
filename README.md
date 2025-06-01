# CIMO

## Project Configuration

To run the project correctly, you need to create a `.env` file in both the `backend` and `frontend` directories.

This `.env` file should contain the necessary environment variables. For reference on which variables to include, please check the following example files:

- Backend: `backend/.env.example`
- Frontend: `frontend/.env.example`

Make sure to replace placeholder values with your actual credentials and keys.

---

## Backend

### Creating a virtual environment

To create a virtual environment via `poetry`, follow these steps:

- Run `pip install poetry` to install poetry;
- Run `poetry config virtualenvs.in-project true` to set the flag to create the `.venv` folder (by default, the environment is set to **_poetry cache_**);
- Run `poetry install --no-root` to download dependencies (use **_poetry.lock_** and **_pyproject.toml_** files);
- When new dependencies or dependency version updates are introduced, update all packages via `poetry update`;
- Useful commands: `poetry check`, `poetry run`, `poetry env info`, `poetry shell`, `poetry add [--dev]`;

Click [here](https://python-poetry.org/docs/) for more information about **poetry**


### Creating migrations

To create a new migration, follow these steps:

- Run the command `alembic revision --autogenerate -m "<message>"` with some *message*. After that, new file is created in the folder **_migrations/versions_**.
- To apply all current migrations, run the command `alembic upgrade head`.
- To roll back the migration, run the command `alembic downgrade -1`.


### Checking column properties in PostgreSQL table

To check the properties of columns in a specific table in PostgreSQL, you can use the following SQL query. This query retrieves metadata information from the `information_schema.columns` system catalog:

```sql
SELECT column_name, data_type, character_maximum_length, 
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'table_name'
ORDER BY ordinal_position;
```

---

## Running with Docker

### Basic Startup of All Services

To build and start all main containers, run command below and replace `{ENV_FILE}` with the desired environment file name:

```bash
ENV_FILE={ENV_FILE} docker compose up -d
```

This will start the following services:

* `db` — PostgreSQL;
* `redis` — Redis;
* `backend` — Main application server (`/docs` - OpenAPI documentation, `/admin` - Admin panel);
* `celery`, `beat`, `flower` — Workers and monitoring;
* `frontend` — Frontend;

The `load-data` container is not started automatically — it's launched manually.

---

### Manual Data Loading

The `load-data` container is configured with the `manual` profile — it doesn't run automatically to prevent reloading data on each start.

```bash
ENV_FILE={ENV_FILE} docker compose --profile manual up
```

* The data will be loaded using an Alembic / Python script.
* The container will be removed after execution.

To show real-time logs from all running containers, you can use command below:

```bash
ENV_FILE={ENV_FILE} docker compose logs -f
```
