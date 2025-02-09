# Development of a web service for personalized movie selection

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
- To roll back the migration, run the command `alembic downgrade -1`