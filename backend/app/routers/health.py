import logging

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.logging_config import log_event
from app.schemas import HealthResponse

router = APIRouter(tags=["health"])
logger = logging.getLogger("signaldesk.health")


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
    description=(
        "Liveness probe for the API process. Executes `SELECT 1` against the database; "
        "when that fails, `database` is `unavailable` while HTTP status remains **200**."
    ),
    responses={
        200: {
            "description": "Service is up",
            "content": {
                "application/json": {
                    "example": {
                        "status": "ok",
                        "service": "SignalDesk API",
                        "database": "connected",
                    }
                }
            },
        },
    },
)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    """Report API liveness and database connectivity."""
    settings = get_settings()
    database_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:
        database_status = "unavailable"
        log_event(
            logger,
            "health_check_failed",
            "Database health check failed",
            level=logging.WARNING,
            error=str(exc),
        )
    return HealthResponse(status="ok", service=settings.app_name, database=database_status)
