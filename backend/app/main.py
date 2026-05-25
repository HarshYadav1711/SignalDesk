from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import init_db
from app.exceptions import (
    DuplicateActionError,
    EnquiryNotFoundError,
    InvalidEnquiryStateError,
)
from app.http_errors import error_response
from app.logging_config import configure_logging
from app.middleware import RequestLoggingMiddleware
from app.routers import enquiry, health


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging(get_settings().log_level)
    init_db()
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "SignalDesk enquiry workflow API. Accepts inbound messages, matches hardcoded SOP "
        "playbooks via keyword logic, and maintains an append-only operational timeline."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(RequestLoggingMiddleware)
app.include_router(health.router)
app.include_router(enquiry.router)


def _validation_detail(exc: RequestValidationError) -> str:
    errors = exc.errors()
    first = errors[0] if errors else {}
    loc = " → ".join(str(part) for part in first.get("loc", ("body",)))
    msg = first.get("msg", "Invalid request")
    return f"{loc}: {msg}" if loc else msg


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response(_validation_detail(exc)),
    )


@app.exception_handler(EnquiryNotFoundError)
async def enquiry_not_found_handler(_: Request, exc: EnquiryNotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=error_response(str(exc)),
    )


@app.exception_handler(DuplicateActionError)
@app.exception_handler(InvalidEnquiryStateError)
async def enquiry_conflict_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content=error_response(str(exc)),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(detail),
    )
