import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.logging_config import log_event
from app.models import Enquiry, EnquiryEvent, EnquiryStatus, EventType
from app.services.sop_matcher import match_sop

logger = logging.getLogger("signaldesk.enquiry")


def _add_event(
    db: Session,
    enquiry: Enquiry,
    event_type: EventType,
    summary: str,
    detail: str | None = None,
) -> None:
    db.add(
        EnquiryEvent(
            enquiry_id=enquiry.id,
            event_type=event_type,
            summary=summary,
            detail=detail,
        )
    )


def create_enquiry(
    db: Session,
    *,
    customer_name: str,
    channel: str,
    subject: str,
    message: str,
) -> Enquiry:
    enquiry = Enquiry(
        id=str(uuid.uuid4()),
        customer_name=customer_name,
        channel=channel,
        subject=subject,
        message=message,
        status=EnquiryStatus.RECEIVED,
    )
    db.add(enquiry)
    _add_event(
        db,
        enquiry,
        EventType.CREATED,
        "Inbound enquiry received",
        detail=message[:500],
    )
    db.commit()
    db.refresh(enquiry)

    log_event(
        logger,
        "enquiry_created",
        "Enquiry created",
        enquiry_id=enquiry.id,
        channel=channel,
        customer_name=customer_name,
    )
    return enquiry


def process_enquiry_background(enquiry_id: str) -> None:
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        enquiry = db.get(Enquiry, enquiry_id)
        if not enquiry:
            log_event(
                logger,
                "task_failed",
                "Enquiry not found for background task",
                level=logging.ERROR,
                enquiry_id=enquiry_id,
            )
            return

        enquiry.status = EnquiryStatus.PROCESSING
        _add_event(db, enquiry, EventType.TASK_STARTED, "Background SOP matching started")
        db.commit()

        log_event(logger, "task_processed", "Background task started", enquiry_id=enquiry_id)

        matched = match_sop(enquiry.message)
        if matched:
            enquiry.status = EnquiryStatus.MATCHED
            enquiry.matched_sop_id = matched.id
            enquiry.matched_sop_title = matched.title
            enquiry.suggested_response = matched.suggested_response
            enquiry.updated_at = datetime.now(timezone.utc)
            _add_event(
                db,
                enquiry,
                EventType.SOP_MATCHED,
                f"Matched SOP: {matched.title}",
                detail=matched.id,
            )
            _add_event(
                db,
                enquiry,
                EventType.RESPONSE_SUGGESTED,
                "Suggested response generated",
                detail=matched.suggested_response,
            )
            db.commit()
            log_event(
                logger,
                "sop_matched",
                "SOP matched for enquiry",
                enquiry_id=enquiry_id,
                sop_id=matched.id,
                sop_title=matched.title,
            )
            return

        enquiry.status = EnquiryStatus.ESCALATED
        enquiry.updated_at = datetime.now(timezone.utc)
        _add_event(
            db,
            enquiry,
            EventType.AUTO_ESCALATED,
            "No SOP matched — auto-escalated to human queue",
            detail="Keyword scan returned no hits across active SOPs",
        )
        db.commit()
        log_event(
            logger,
            "escalation_triggered",
            "Enquiry auto-escalated",
            enquiry_id=enquiry_id,
            reason="no_sop_match",
        )
    except Exception:
        db.rollback()
        logger.exception("Background processing failed", extra={"event": "task_failed"})
        raise
    finally:
        db.close()


def add_follow_up(db: Session, enquiry_id: str, message: str) -> Enquiry:
    enquiry = db.get(Enquiry, enquiry_id)
    if not enquiry:
        return None  # type: ignore[return-value]

    enquiry.message = f"{enquiry.message}\n\n--- follow-up ---\n{message}"
    enquiry.updated_at = datetime.now(timezone.utc)
    _add_event(
        db,
        enquiry,
        EventType.FOLLOW_UP,
        "Customer follow-up recorded",
        detail=message,
    )
    db.commit()
    db.refresh(enquiry)

    log_event(
        logger,
        "follow_up_added",
        "Follow-up added",
        enquiry_id=enquiry_id,
    )
    return enquiry


def escalate_enquiry(db: Session, enquiry_id: str, reason: str) -> Enquiry:
    enquiry = db.get(Enquiry, enquiry_id)
    if not enquiry:
        return None  # type: ignore[return-value]

    enquiry.status = EnquiryStatus.ESCALATED
    enquiry.updated_at = datetime.now(timezone.utc)
    _add_event(
        db,
        enquiry,
        EventType.MANUAL_ESCALATED,
        "Manually escalated",
        detail=reason,
    )
    db.commit()
    db.refresh(enquiry)

    log_event(
        logger,
        "escalation_triggered",
        "Manual escalation",
        enquiry_id=enquiry_id,
        reason=reason,
    )
    return enquiry


def get_enquiry_history(db: Session, enquiry_id: str) -> Enquiry | None:
    return db.get(Enquiry, enquiry_id)
