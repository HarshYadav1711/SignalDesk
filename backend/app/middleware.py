import logging
import time
from collections.abc import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.logging_config import log_event

logger = logging.getLogger("signaldesk.http")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Emit one structured JSON log line per HTTP request."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        enquiry_id = _enquiry_id_from_path(request.url.path)
        try:
            response = await call_next(request)
        except Exception:
            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            log_event(
                logger,
                "http_request_failed",
                "HTTP request failed",
                level=logging.ERROR,
                method=request.method,
                path=request.url.path,
                duration_ms=elapsed_ms,
                enquiry_id=enquiry_id,
            )
            raise

        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        log_event(
            logger,
            "http_request",
            "HTTP request completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=elapsed_ms,
            enquiry_id=enquiry_id,
        )
        return response


def _enquiry_id_from_path(path: str) -> str | None:
    # /enquiry/{uuid}/...
    parts = path.strip("/").split("/")
    if len(parts) >= 2 and parts[0] == "enquiry" and parts[1]:
        candidate = parts[1]
        if candidate not in ("", "health"):
            return candidate
    return None
