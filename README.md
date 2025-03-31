# Development of a web application for personalized movie selection

## Creating a virtual environment

To create a virtual environment via `poetry`, follow these steps:

- Run `pip install poetry` to install poetry;
- Run `poetry config virtualenvs.in-project true` to set the flag to create the `.venv` folder (by default, the environment is set to **_poetry cache_**);
- Run `poetry install --no-root` to download dependencies (use **_poetry.lock_** and **_pyproject.toml_** files);
- When new dependencies or dependency version updates are introduced, update all packages via `poetry update`;
- Useful commands: `poetry check`, `poetry run`, `poetry env info`, `poetry shell`, `poetry add [--dev]`;

Click [here](https://python-poetry.org/docs/) for more information about **poetry**


## Creating migrations

To create a new migration, follow these steps:

- Run the command `alembic revision --autogenerate -m "<message>"` with some *message*. After that, new file is created in the folder **_migrations/versions_**.
- To apply all current migrations, run the command `alembic upgrade head`.
- To roll back the migration, run the command `alembic downgrade -1`.


## Checking column properties in PostgreSQL table

To check the properties of columns in a specific table in PostgreSQL, you can use the following SQL query. This query retrieves metadata information from the `information_schema.columns` system catalog:

```sql
SELECT column_name, data_type, character_maximum_length, 
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'table_name'
ORDER BY ordinal_position;
```