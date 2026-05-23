from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
    description="Returns API liveness and whether the database connection is available.",
)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    settings = get_settings()
    database_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        database_status = "unavailable"
    return HealthResponse(status="ok", service=settings.app_name, database=database_status)
