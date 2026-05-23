import logging

from fastapi import BackgroundTasks

from app import database
from app.logging_config import log_event
from app.services.enquiry_service import EnquiryService

logger = logging.getLogger("signaldesk.background")


def process_enquiry_task(enquiry_id: str) -> None:
    db = database.SessionLocal()
    try:
        EnquiryService(db).process_enquiry(enquiry_id)
    except Exception:
        log_event(
            logger,
            "task_processed",
            "Background task failed",
            level=logging.ERROR,
            enquiry_id=enquiry_id,
        )
        raise
    finally:
        db.close()


def schedule_enquiry_processing(background_tasks: BackgroundTasks, enquiry_id: str) -> None:
    background_tasks.add_task(process_enquiry_task, enquiry_id)
