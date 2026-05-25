import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any


class JsonFormatter(logging.Formatter):
    """Emit one JSON object per log line for stdout aggregators."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "event"):
            payload["event"] = record.event
        if hasattr(record, "extra_data") and record.extra_data is not None:
            payload["data"] = record.extra_data
        return json.dumps(payload, default=str)


def configure_logging(level: str = "INFO") -> None:
    root = logging.getLogger()
    root.handlers.clear()
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root.addHandler(handler)
    root.setLevel(level.upper())


def log_event(
    logger: logging.Logger,
    event: str,
    message: str,
    *,
    level: int = logging.INFO,
    **data: Any,
) -> None:
    """
    Write a structured operational log line.

    `event` is a stable machine name; `message` is human-readable; remaining kwargs
    are serialized under `data` in the JSON payload.
    """
    logger.log(level, message, extra={"event": event, "extra_data": data or None})
