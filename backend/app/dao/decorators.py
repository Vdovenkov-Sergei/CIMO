import time
from functools import wraps

from sqlalchemy.exc import SQLAlchemyError

from app.constants import General
from app.dao.utils import orm_to_dict, to_gerund
from app.logger import logger

# Note: action = infinitive verb + noun


def log_query_time(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            duration = round(time.time() - start, General.ROUND)
            logger.debug("Database query executed.", extra={"duration": duration})

    return wrapper


def log_db_errors(action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            verb, noun = action.strip().split(" ", 1)
            logger.info(f"{to_gerund(verb)} {noun}...")
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


def log_db_find_one(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1].capitalize()
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"{noun} found.", extra={"result": orm_to_dict(result)})
            else:
                logger.warning(f"{noun} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


def log_db_find_all(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1]
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"Retrieved {noun}.", extra={"count": len(result)})
            else:
                logger.warning(f"{noun.capitalize()} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


def log_db_add(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1].capitalize()
            result = await func(*args, **kwargs)
            logger.info(f"{noun} added.", extra={"result": orm_to_dict(result)})
            return result

        return wrapper

    return decorator


def log_db_update(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1].capitalize()
            result = await func(*args, **kwargs)
            if result > 0:
                logger.info(f"{noun} updated.", extra={"count": result})
            else:
                logger.warning(f"{noun} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


def log_db_delete(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1].capitalize()
            result = await func(*args, **kwargs)
            if result > 0:
                logger.info(f"{noun} deleted.", extra={"count": result})
            else:
                logger.warning(f"{noun} not found.", extra=kwargs)
            return result

        return wrapper

    return decorator


def log_db_action(action: str):
    def decorator(func):
        @wraps(func)
        @log_db_errors(action)
        async def wrapper(*args, **kwargs):
            noun = action.strip().split(" ", 1)[-1].capitalize()
            result = await func(*args, **kwargs)
            if result:
                logger.info(f"{noun} happened.", extra={"result": result})
            else:
                logger.warning(f"{noun} not happened.", extra=kwargs)
            return result

        return wrapper

    return decorator
