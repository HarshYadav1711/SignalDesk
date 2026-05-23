from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
    description="Returns API and database connectivity status for load balancers and monitors.",
)
def health_check(db: Session = Depends(get_db)) -> HealthResponse:
    database = "unavailable"
    try:
        db.execute(text("SELECT 1"))
        database = "connected"
    except Exception:
        database = "unavailable"

    return HealthResponse(status="ok", service=settings.app_name, database=database)
