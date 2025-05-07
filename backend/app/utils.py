from sqlalchemy import create_engine
import pandas as pd

from app.config import settings
from app.movie_roles.models import MovieRole
from app.movies.models import Movie
from app.people.models import Person

sync_url = settings.database_url.replace("+asyncpg", "+psycopg2")
sync_engine = create_engine(sync_url)


def load_data(path_to_file, table_name):
    df = pd.read_pickle(path_to_file)
    df.to_sql(table_name, con=sync_engine, if_exists="append", index=False)


load_data(f"/app/data/{Movie.__tablename__}.pkl", Movie.__tablename__)
load_data(f"/app/data/{Person.__tablename__}.pkl", Person.__tablename__)
load_data(f"/app/data/{MovieRole.__tablename__}.pkl", MovieRole.__tablename__)
