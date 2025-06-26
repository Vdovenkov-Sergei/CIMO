import os
import pandas as pd

from app.database import sync_engine
from app.logger import logger
from app.movie_roles.models import MovieRole
from app.movies.models import Movie
from app.people.models import Person
from app.users.models import User


# Optional
def load_data(path_to_file: str, table_name: str) -> None:
    try:
        logger.info("Loading data into table.", extra={"table_name": table_name})
        df = pd.read_pickle(path_to_file)
        df.to_sql(table_name, con=sync_engine, if_exists="append", index=False)
        logger.info("Successfully loaded data.", extra={"rows": len(df)})
    except Exception as err:
        logger.error(
            "Error: failed to load data.",
            extra={"path_to_file": path_to_file, "table_name": table_name, "error": str(err)},
            exc_info=True,
        )
        raise


tables_and_files = [
    (Movie.__tablename__, f"./app/data/db/{Movie.__tablename__}.pkl"),
    (Person.__tablename__, f"./app/data/db/{Person.__tablename__}.pkl"),
    (MovieRole.__tablename__, f"./app/data/db/{MovieRole.__tablename__}.pkl"),
    (User.__tablename__, f"./app/data/db/{User.__tablename__}.pkl"),
]

for table_name, file_path in tables_and_files:
    if os.path.exists(file_path):
        load_data(file_path, table_name)
    else:
        logger.warning("File not found.", extra={"file_path": file_path, "table_name": table_name})
