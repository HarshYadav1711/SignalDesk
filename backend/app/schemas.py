from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.models import EnquiryStatus, EventType

Channel = Literal["email", "whatsapp", "web_chat", "phone"]


class EnquiryCreate(BaseModel):
    customer_name: str = Field(
        ...,
        min_length=1,
        max_length=120,
        examples=["Priya Sharma"],
        description="Customer or lead display name",
    )
    channel: Channel = Field(
        ...,
        examples=["whatsapp"],
        description="Inbound channel for routing analytics",
    )
    subject: str = Field(
        ...,
        min_length=1,
        max_length=200,
        examples=["Need pricing for 3 seats"],
        description="Short subject line from the inbound message",
    )
    message: str = Field(
        ...,
        min_length=1,
        examples=[
            "Hi, we're a 12-person agency evaluating SignalDesk. "
            "Can you share pricing for three seats on the Growth plan?"
        ],
        description="Full inbound message body used for SOP keyword matching",
    )


class FollowUpCreate(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        examples=["Also need SSO — is that on Growth?"],
        description="Additional customer message appended to the enquiry thread",
    )


class EscalateRequest(BaseModel):
    reason: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["Customer requests legal review before contract"],
        description="Operator reason for manual escalation",
    )


class EnquiryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(examples=["550e8400-e29b-41d4-a716-446655440000"])
    customer_name: str
    channel: str
    subject: str
    message: str
    status: EnquiryStatus
    matched_sop_id: str | None
    matched_sop_title: str | None
    suggested_response: str | None
    created_at: datetime
    updated_at: datetime


class EnquiryCreatedResponse(BaseModel):
    enquiry: EnquiryResponse
    processing: bool = Field(
        description="True when SOP matching is queued in a background task"
    )


class HistoryEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_type: EventType
    summary: str
    detail: str | None
    created_at: datetime


class EnquiryHistoryResponse(BaseModel):
    enquiry: EnquiryResponse
    events: list[HistoryEvent]


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    service: str = Field(examples=["SignalDesk API"])
    database: Literal["connected", "unavailable"]


class ErrorResponse(BaseModel):
    detail: str
