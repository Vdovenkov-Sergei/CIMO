import logging
from datetime import UTC, datetime
import os
from typing import Any

from pythonjsonlogger.jsonlogger import JsonFormatter  # type: ignore

from app.config import settings


class CustomJsonFormatter(JsonFormatter):
    def add_fields(self, log_record: dict[str, Any], record: logging.LogRecord, message_dict: dict[str, Any]) -> None:
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        if not log_record.get("timestamp"):
            log_record["timestamp"] = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        if log_record.get("level"):
            log_record["level"] = log_record["level"].upper()
        else:
            log_record["level"] = record.levelname

# --- Root Logger ---
logger = logging.getLogger()
logger.setLevel(settings.LOG_LEVEL)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

logHandler = logging.StreamHandler()
formatter = CustomJsonFormatter("%(timestamp)s %(level)s %(message)s %(module)s %(funcName)s")
formatter.json_ensure_ascii = False
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

# --- Movie Logger ---
os.makedirs("app/logs", exist_ok=True)

movie_logger = logging.getLogger("movie")
movie_logger.setLevel(logging.INFO)

movie_handler = logging.FileHandler("app/logs/movie_actions.log", encoding="utf-8")
movie_formatter = CustomJsonFormatter("%(timestamp)s %(level)s %(message)s")
movie_formatter.json_ensure_ascii = False
movie_handler.setFormatter(movie_formatter)
movie_logger.addHandler(movie_handler)
