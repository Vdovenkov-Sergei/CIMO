import time
from functools import wraps

from sqlalchemy.exc import SQLAlchemyError

from app.logger import logger
from app.dao.utils import orm_to_dict, to_gerund


def log_query_time(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            duration = round(time.time() - start, 4)
            logger.debug(f"Database query executed.", extra={"duration": duration})

    return wrapper


def log_db_errors(action: str):
    verb, noun = action.strip().capitalize().split(" ", 1)

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            logger.info(f"{to_gerund(verb)} {noun.lower()}...")
            try:
                return await func(*args, **kwargs)
            except (SQLAlchemyError, Exception) as err:
                type_error = "Database" if isinstance(err, SQLAlchemyError) else "Unknown"
                logger.error(
                    f"{type_error} error: failed to {action.lower()}.",
                    extra={**kwargs, "error": str(err)},
                    exc_info=True,
                )
                raise

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_find_one(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"{noun.capitalize()} found.", extra={"result": orm_to_dict(result)})
            else:
                logger.warning(f"{noun.capitalize()} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_find_all(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"Retrieved {noun.lower()}.", extra={"count": len(result)})
            else:
                logger.warning(f"{noun.capitalize()} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_add(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            logger.info(f"{noun.capitalize()} added.", extra={"result": orm_to_dict(result)})
            return result

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_update(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            if result > 0:
                logger.info(f"{noun.capitalize()} updated.", extra={"count": result})
            else:
                logger.warning(f"{noun.capitalize()} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_delete(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            if result > 0:
                logger.info(f"{noun.capitalize()} deleted.", extra={"count": result})
            else:
                logger.warning(f"{noun.capitalize()} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


# Note: action = infinitive verb + noun
def log_db_action(action: str):
    noun = action.capitalize().split(" ", 1)[-1].strip()

    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"{noun.capitalize()} happened.", extra={"result": result})
            else:
                logger.warning(f"{noun.capitalize()} not happened.", extra=kwargs)
            return result

        return wrapper

    return decorator
