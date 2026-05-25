import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.exceptions import (
    DuplicateActionError,
    EnquiryNotFoundError,
    InvalidEnquiryStateError,
)
from app.logging_config import log_event
from app.models import Enquiry, EnquiryEvent, EnquiryStatus, EventType
from app.repositories import EnquiryRepository, EventRepository
from app.schemas import EnquiryCreate, EscalateRequest, FollowUpCreate
from app.services.sop_matcher import SopMatcherService

logger = logging.getLogger("signaldesk.enquiry")

FOLLOW_UP_SEPARATOR = "\n\n--- follow-up ---\n"
RESPONSE_DETAIL_MAX_LEN = 500


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class EnquiryService:
    """Enquiry lifecycle, timeline events, and background SOP processing."""

    def __init__(self, db: Session) -> None:
        self._db = db
        self._enquiries = EnquiryRepository(db)
        self._events = EventRepository(db)
        self._matcher = SopMatcherService()

    def create_enquiry(self, payload: EnquiryCreate) -> Enquiry:
        """Persist a new enquiry in `received` state with an `enquiry_created` event."""
        enquiry = Enquiry(
            id=str(uuid.uuid4()),
            customer_name=payload.customer_name.strip(),
            channel=payload.channel,
            subject=payload.subject.strip(),
            message=payload.message.strip(),
            status=EnquiryStatus.RECEIVED,
        )
        self._enquiries.add(enquiry)
        self._record_event(
            enquiry,
            EventType.ENQUIRY_CREATED,
            "Enquiry received",
            detail=f"Channel: {enquiry.channel}",
        )
        self._db.commit()
        self._db.refresh(enquiry)

        log_event(
            logger,
            "enquiry_created",
            "Enquiry created",
            enquiry_id=enquiry.id,
            channel=enquiry.channel,
            status=enquiry.status.value,
        )
        return enquiry

    def add_follow_up(self, enquiry_id: str, payload: FollowUpCreate) -> Enquiry:
        """Append a follow-up, reset SOP fields, and return the enquiry for reprocessing."""
        enquiry = self._require_enquiry(enquiry_id)
        self._ensure_open(enquiry, action="follow-up")

        follow_up_text = payload.message.strip()
        enquiry.message = f"{enquiry.message}{FOLLOW_UP_SEPARATOR}{follow_up_text}"
        self._reset_sop_fields(enquiry)
        enquiry.status = EnquiryStatus.RECEIVED
        self._touch(enquiry)

        self._record_event(
            enquiry,
            EventType.FOLLOW_UP,
            "Customer follow-up received",
            detail=follow_up_text,
        )
        self._enquiries.save(enquiry)
        self._db.commit()
        self._db.refresh(enquiry)

        log_event(
            logger,
            "follow_up_scheduled",
            "Follow-up recorded; reprocessing queued",
            enquiry_id=enquiry.id,
            status=enquiry.status.value,
        )
        return enquiry

    def escalate_manually(self, enquiry_id: str, payload: EscalateRequest) -> Enquiry:
        """Mark an enquiry escalated and record the operator reason on the timeline."""
        enquiry = self._require_enquiry(enquiry_id)
        if enquiry.status == EnquiryStatus.ESCALATED:
            raise DuplicateActionError("Enquiry is already escalated")
        if enquiry.status == EnquiryStatus.CLOSED:
            raise InvalidEnquiryStateError("Cannot escalate a closed enquiry")

        reason = payload.reason.strip()
        enquiry.status = EnquiryStatus.ESCALATED
        self._touch(enquiry)
        self._record_event(
            enquiry,
            EventType.MANUAL_ESCALATED,
            "Manually escalated by operator",
            detail=reason,
        )
        self._enquiries.save(enquiry)
        self._db.commit()
        self._db.refresh(enquiry)

        log_event(
            logger,
            "escalation_triggered",
            "Manual escalation",
            enquiry_id=enquiry.id,
            reason=reason,
            trigger="manual",
            status=enquiry.status.value,
        )
        return enquiry

    def get_history(self, enquiry_id: str) -> Enquiry:
        """Load enquiry and timeline events (ascending by `created_at`, then `id`)."""
        enquiry = self._enquiries.get_with_events(enquiry_id)
        if enquiry is None:
            raise EnquiryNotFoundError(enquiry_id)
        return enquiry

    def process_enquiry(self, enquiry_id: str) -> None:
        """
        Background SOP matching: transition to `processing`, then `matched` or `escalated`.

        Closed enquiries are ignored. Terminal states (`matched`, `escalated`) may be
        re-entered when a follow-up resets status to `received` and re-queues this task.
        """
        enquiry = self._require_enquiry(enquiry_id)
        if enquiry.status == EnquiryStatus.CLOSED:
            log_event(
                logger,
                "task_skipped",
                "Background task skipped — enquiry closed",
                enquiry_id=enquiry_id,
                status=enquiry.status.value,
            )
            return

        enquiry.status = EnquiryStatus.PROCESSING
        self._touch(enquiry)
        self._record_event(
            enquiry,
            EventType.TASK_STARTED,
            "SOP matching started",
        )
        self._enquiries.save(enquiry)
        self._db.commit()
        self._db.refresh(enquiry)

        sop = self._matcher.match(enquiry.message)

        if sop:
            enquiry.status = EnquiryStatus.MATCHED
            enquiry.matched_sop_id = sop.id
            enquiry.matched_sop_title = sop.title
            enquiry.suggested_response = sop.suggested_response
            self._touch(enquiry)
            self._record_event(
                enquiry,
                EventType.SOP_MATCHED,
                f"Matched SOP: {sop.title}",
                detail=sop.id,
            )
            self._record_event(
                enquiry,
                EventType.RESPONSE_SUGGESTED,
                "Suggested response ready",
                detail=sop.suggested_response[:RESPONSE_DETAIL_MAX_LEN],
            )
            self._enquiries.save(enquiry)
            self._db.commit()

            log_event(
                logger,
                "sop_matched",
                "SOP keyword match",
                enquiry_id=enquiry.id,
                sop_id=sop.id,
                sop_title=sop.title,
                status=enquiry.status.value,
            )
        else:
            enquiry.status = EnquiryStatus.ESCALATED
            self._touch(enquiry)
            self._record_event(
                enquiry,
                EventType.AUTO_ESCALATED,
                "No SOP match — escalated automatically",
                detail="No playbook keywords found in message",
            )
            self._enquiries.save(enquiry)
            self._db.commit()

            log_event(
                logger,
                "escalation_triggered",
                "Auto escalation — no SOP match",
                enquiry_id=enquiry.id,
                trigger="auto",
                status=enquiry.status.value,
            )

        log_event(
            logger,
            "task_processed",
            "Background SOP task finished",
            enquiry_id=enquiry_id,
            status=enquiry.status.value,
        )

    def _require_enquiry(self, enquiry_id: str) -> Enquiry:
        enquiry = self._enquiries.get_by_id(enquiry_id)
        if enquiry is None:
            raise EnquiryNotFoundError(enquiry_id)
        return enquiry

    def _ensure_open(self, enquiry: Enquiry, *, action: str) -> None:
        """Reject follow-ups while processing or closed; allow on escalated threads."""
        if enquiry.status == EnquiryStatus.CLOSED:
            raise InvalidEnquiryStateError(f"Cannot add {action} to a closed enquiry")
        if enquiry.status == EnquiryStatus.PROCESSING:
            raise InvalidEnquiryStateError(
                f"Enquiry is still being processed; retry {action} shortly"
            )
        # Escalated enquiries may still receive customer follow-ups.

    @staticmethod
    def _touch(enquiry: Enquiry) -> None:
        enquiry.updated_at = _utc_now()

    @staticmethod
    def _reset_sop_fields(enquiry: Enquiry) -> None:
        enquiry.matched_sop_id = None
        enquiry.matched_sop_title = None
        enquiry.suggested_response = None

    def _record_event(
        self,
        enquiry: Enquiry,
        event_type: EventType,
        summary: str,
        *,
        detail: str | None = None,
    ) -> EnquiryEvent:
        event = EnquiryEvent(
            enquiry_id=enquiry.id,
            event_type=event_type,
            summary=summary,
            detail=detail,
        )
        return self._events.add(event)
