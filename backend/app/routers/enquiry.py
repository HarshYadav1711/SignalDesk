from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy.orm import Session

from app.background import schedule_enquiry_processing
from app.database import get_db
from app.exceptions import (
    DuplicateActionError,
    EnquiryNotFoundError,
    InvalidEnquiryStateError,
)
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


def get_enquiry_service(db: Session = Depends(get_db)) -> EnquiryService:
    return EnquiryService(db)


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new enquiry",
    description=(
        "Accepts an inbound customer enquiry, persists it, records a timeline event, "
        "and queues asynchronous SOP keyword matching via a background task."
    ),
    responses={
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
)
def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryCreatedResponse:
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
        "Appends a follow-up message to the enquiry thread, resets SOP match fields, "
        "records a timeline event, and re-queues background SOP matching."
    ),
    responses={
        404: {"model": ErrorResponse, "description": "Enquiry not found"},
        409: {"model": ErrorResponse, "description": "Invalid state for follow-up"},
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
)
def add_follow_up(
    enquiry_id: str,
    payload: FollowUpCreate,
    background_tasks: BackgroundTasks,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryResponse:
    try:
        enquiry = service.add_follow_up(enquiry_id, payload)
    except EnquiryNotFoundError as exc:
        _raise_not_found(exc)
    except InvalidEnquiryStateError as exc:
        _raise_conflict(str(exc))
    schedule_enquiry_processing(background_tasks, enquiry.id)
    return EnquiryResponse.model_validate(enquiry)


@router.post(
    "/{enquiry_id}/escalate",
    response_model=EnquiryResponse,
    summary="Manually escalate an enquiry",
    description="Marks the enquiry as escalated and appends an operator escalation event.",
    responses={
        404: {"model": ErrorResponse, "description": "Enquiry not found"},
        409: {"model": ErrorResponse, "description": "Already escalated or closed"},
        422: {"model": ErrorResponse, "description": "Validation error"},
    },
)
def escalate_enquiry(
    enquiry_id: str,
    payload: EscalateRequest,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryResponse:
    try:
        enquiry = service.escalate_manually(enquiry_id, payload)
    except EnquiryNotFoundError as exc:
        _raise_not_found(exc)
    except (DuplicateActionError, InvalidEnquiryStateError) as exc:
        _raise_conflict(str(exc))
    return EnquiryResponse.model_validate(enquiry)


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    summary="Get enquiry and timeline history",
    description="Returns the current enquiry snapshot and append-only operational events.",
    responses={
        404: {"model": ErrorResponse, "description": "Enquiry not found"},
    },
)
def get_enquiry_history(
    enquiry_id: str,
    service: EnquiryService = Depends(get_enquiry_service),
) -> EnquiryHistoryResponse:
    try:
        enquiry = service.get_history(enquiry_id)
    except EnquiryNotFoundError as exc:
        _raise_not_found(exc)
    return EnquiryHistoryResponse(
        enquiry=EnquiryResponse.model_validate(enquiry),
        events=[HistoryEvent.model_validate(e) for e in enquiry.events],
    )


def _raise_not_found(exc: EnquiryNotFoundError) -> None:
    from fastapi import HTTPException

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=str(exc),
    ) from exc


def _raise_conflict(message: str) -> None:
    from fastapi import HTTPException

    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=message,
    )
