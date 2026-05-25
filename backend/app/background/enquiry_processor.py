import logging

from fastapi import BackgroundTasks

from app import database
from app.logging_config import log_event
from app.services.enquiry_service import EnquiryService

logger = logging.getLogger("signaldesk.background")


def process_enquiry_task(enquiry_id: str) -> None:
    """Run SOP matching in a request-scoped background task with its own DB session."""
    log_event(
        logger,
        "task_started",
        "Background SOP task started",
        enquiry_id=enquiry_id,
    )
    db = database.SessionLocal()
    try:
        EnquiryService(db).process_enquiry(enquiry_id)
    except Exception as exc:
        log_event(
            logger,
            "task_failed",
            "Background SOP task failed",
            level=logging.ERROR,
            enquiry_id=enquiry_id,
            error=str(exc),
        )
        raise
    finally:
        db.close()


def schedule_enquiry_processing(background_tasks: BackgroundTasks, enquiry_id: str) -> None:
    """Queue `process_enquiry_task` on FastAPI's in-process background task runner."""
    log_event(
        logger,
        "task_scheduled",
        "Background SOP task queued",
        enquiry_id=enquiry_id,
    )
    background_tasks.add_task(process_enquiry_task, enquiry_id)
