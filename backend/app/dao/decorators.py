import time
from functools import wraps

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.inspection import inspect

from app.logger import logger


def orm_to_dict(obj):
    try:
        return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}
    except Exception:
        return {"repr": repr(obj)}


def log_query_time(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start = time.time()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            duration = round(time.time() - start, 4)
            logger.debug(f"Database query executed in {duration}s.")

    return wrapper


def log_db_errors(action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            logger.info(f"{action.capitalize()}", extra=kwargs)
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
                extra = {**kwargs, "result": orm_to_dict(result)}
                logger.debug(f"{noun.capitalize()} found.", extra=extra)
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
            logger.debug(f"Retrieved {noun.lower()}.", extra={**kwargs, "count": len(result)})
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
            logger.debug(f"{noun.capitalize()} added.", extra={**kwargs, "result": orm_to_dict(result)})
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
                logger.debug(f"{noun.capitalize()} updated.", extra={**kwargs, "count": result})
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
                logger.debug(f"{noun.capitalize()} deleted.", extra={**kwargs, "count": result})
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
                logger.debug(f"{noun.capitalize()} happened.", extra=kwargs)
            else:
                logger.debug(f"{noun.capitalize()} not happened.", extra=kwargs)
            return result

        return wrapper

    return decorator
