from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.background import schedule_enquiry_processing
from app.database import get_db
from app.schemas import (
    EnquiryCreatedResponse,
    EnquiryCreate,
    EnquiryHistoryResponse,
    EnquiryResponse,
    ErrorResponse,
    EscalateRequest,
    FollowUpCreate,
    HistoryEvent,
)
from app.services.enquiry_service import EnquiryService

router = APIRouter(prefix="/enquiry", tags=["enquiry"])

_ERROR_EXAMPLE = {"detail": "Enquiry '550e8400-e29b-41d4-a716-446655440000' was not found"}
_CONFLICT_EXAMPLE = {
    "detail": "Enquiry is still being processed; retry follow-up shortly"
}
_VALIDATION_EXAMPLE = {"detail": "body → customer_name: String should have at least 1 character"}


def get_enquiry_service(db: Session = Depends(get_db)) -> EnquiryService:
    return EnquiryService(db)


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new enquiry",
    description=(
        "Accepts an inbound customer enquiry, persists it with status `received`, "
        "records an `enquiry_created` timeline event, and queues asynchronous SOP keyword "
        "matching. The response includes `processing: true` while the background task runs."
    ),
    responses={
        422: {
            "model": ErrorResponse,
            "description": "Request body failed validation",
            "content": {"application/json": {"example": _VALIDATION_EXAMPLE}},
        },
    },
)
def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryCreatedResponse:
    """Create enquiry and schedule background SOP matching."""
    enquiry = service.create_enquiry(payload)
    schedule_enquiry_processing(background_tasks, enquiry.id)
    return EnquiryCreatedResponse(
        enquiry=EnquiryResponse.model_validate(enquiry),
        processing=True,
    )


@router.post(
    "/{enquiry_id}/follow-up",
    response_model=EnquiryResponse,
    summary="Append a customer follow-up",
    description=(
        "Appends the follow-up to the enquiry message thread, resets SOP match fields, "
        "sets status to `received`, records a `follow_up` event, and re-queues background "
        "matching. Returns **409** while status is `processing` or `closed`."
    ),
    responses={
        404: {
            "model": ErrorResponse,
            "description": "Enquiry not found",
            "content": {"application/json": {"example": _ERROR_EXAMPLE}},
        },
        409: {
            "model": ErrorResponse,
            "description": "Invalid state for follow-up",
            "content": {"application/json": {"example": _CONFLICT_EXAMPLE}},
        },
        422: {
            "model": ErrorResponse,
            "description": "Request body failed validation",
            "content": {"application/json": {"example": _VALIDATION_EXAMPLE}},
        },
    },
)
def add_follow_up(
    enquiry_id: str,
    payload: FollowUpCreate,
    background_tasks: BackgroundTasks,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryResponse:
    """Append follow-up and re-queue SOP processing."""
    enquiry = service.add_follow_up(enquiry_id, payload)
    schedule_enquiry_processing(background_tasks, enquiry.id)
    return EnquiryResponse.model_validate(enquiry)


@router.post(
    "/{enquiry_id}/escalate",
    response_model=EnquiryResponse,
    summary="Manually escalate an enquiry",
    description=(
        "Sets status to `escalated` and records a `manual_escalated` event with the operator "
        "reason. Returns **409** if already escalated or if the enquiry is `closed`."
    ),
    responses={
        404: {
            "model": ErrorResponse,
            "description": "Enquiry not found",
            "content": {"application/json": {"example": _ERROR_EXAMPLE}},
        },
        409: {
            "model": ErrorResponse,
            "description": "Already escalated or closed",
            "content": {
                "application/json": {"example": {"detail": "Enquiry is already escalated"}}
            },
        },
        422: {
            "model": ErrorResponse,
            "description": "Request body failed validation",
            "content": {"application/json": {"example": _VALIDATION_EXAMPLE}},
        },
    },
)
def escalate_enquiry(
    enquiry_id: str,
    payload: EscalateRequest,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryResponse:
    """Manually escalate; idempotent guard rejects duplicate escalation."""
    enquiry = service.escalate_manually(enquiry_id, payload)
    return EnquiryResponse.model_validate(enquiry)


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    summary="Get enquiry and timeline history",
    description=(
        "Returns the current enquiry snapshot and append-only timeline events ordered by "
        "`created_at` ascending (oldest first)."
    ),
    responses={
        404: {
            "model": ErrorResponse,
            "description": "Enquiry not found",
            "content": {"application/json": {"example": _ERROR_EXAMPLE}},
        },
    },
)
def get_enquiry_history(
    enquiry_id: str,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryHistoryResponse:
    """Fetch enquiry plus chronologically ordered timeline events."""
    enquiry = service.get_history(enquiry_id)
    return EnquiryHistoryResponse(
        enquiry=EnquiryResponse.model_validate(enquiry),
        events=[HistoryEvent.model_validate(e) for e in enquiry.events],
    )
