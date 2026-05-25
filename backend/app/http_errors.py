"""Consistent JSON error bodies for HTTP and validation failures."""

from app.schemas import ErrorResponse


def error_response(detail: str) -> dict[str, str]:
    return ErrorResponse(detail=detail).model_dump()
