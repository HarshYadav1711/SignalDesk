from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    EnquiryHistoryResponse,
    EnquiryResponse,
    EscalateRequest,
    FollowUpCreate,
    HistoryEvent,
)
from app.services import enquiry_service

router = APIRouter(prefix="/enquiry", tags=["Enquiries"])


@router.post(
    "",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create enquiry",
    description=(
        "Accepts a new inbound enquiry, persists it immediately, and queues "
        "asynchronous SOP keyword matching. Returns before processing completes."
    ),
)
def create_enquiry(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> EnquiryCreatedResponse:
    enquiry = enquiry_service.create_enquiry(
        db,
        customer_name=payload.customer_name,
        channel=payload.channel,
        subject=payload.subject,
        message=payload.message,
    )
    background_tasks.add_task(enquiry_service.process_enquiry_background, enquiry.id)
    return EnquiryCreatedResponse(
        enquiry=EnquiryResponse.model_validate(enquiry),
        processing=True,
    )


@router.post(
    "/{enquiry_id}/follow-up",
    response_model=EnquiryResponse,
    summary="Add follow-up message",
    description="Appends a customer follow-up to the enquiry thread and records a timeline event.",
)
def add_follow_up(
    enquiry_id: str,
    payload: FollowUpCreate,
    db: Session = Depends(get_db),
) -> EnquiryResponse:
    enquiry = enquiry_service.add_follow_up(db, enquiry_id, payload.message)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    return EnquiryResponse.model_validate(enquiry)


@router.post(
    "/{enquiry_id}/escalate",
    response_model=EnquiryResponse,
    summary="Escalate enquiry",
    description="Manually moves an enquiry to the human escalation queue with an operator reason.",
)
def escalate_enquiry(
    enquiry_id: str,
    payload: EscalateRequest,
    db: Session = Depends(get_db),
) -> EnquiryResponse:
    enquiry = enquiry_service.escalate_enquiry(db, enquiry_id, payload.reason)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    return EnquiryResponse.model_validate(enquiry)


@router.get(
    "/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    summary="Get enquiry history",
    description="Returns the enquiry record and chronological operational event timeline.",
)
def get_history(
    enquiry_id: str,
    db: Session = Depends(get_db),
) -> EnquiryHistoryResponse:
    enquiry = enquiry_service.get_enquiry_history(db, enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry {enquiry_id} not found",
        )
    return EnquiryHistoryResponse(
        enquiry=EnquiryResponse.model_validate(enquiry),
        events=[HistoryEvent.model_validate(e) for e in enquiry.events],
    )
