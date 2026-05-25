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

    id: str = Field(
        examples=["550e8400-e29b-41d4-a716-446655440000"],
        description="Stable enquiry UUID",
    )
    customer_name: str = Field(description="Display name from the inbound message")
    channel: str = Field(
        description="Inbound channel (`email`, `whatsapp`, `web_chat`, `phone`)"
    )
    subject: str = Field(description="Short subject line")
    message: str = Field(
        description="Full message thread (initial body plus follow-ups when appended)"
    )
    status: EnquiryStatus = Field(description="Current lifecycle status")
    matched_sop_id: str | None = Field(
        default=None, description="SOP catalog id when keyword match succeeded"
    )
    matched_sop_title: str | None = Field(
        default=None, description="Human-readable matched playbook title"
    )
    suggested_response: str | None = Field(
        default=None, description="Template reply from the matched SOP"
    )
    created_at: datetime = Field(description="UTC timestamp when the enquiry was created")
    updated_at: datetime = Field(description="UTC timestamp of the last mutation")


class EnquiryCreatedResponse(BaseModel):
    enquiry: EnquiryResponse
    processing: bool = Field(
        description="True when SOP matching is queued in a background task",
        examples=[True],
    )


class HistoryEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(description="Monotonic timeline event id")
    event_type: EventType = Field(description="Append-only event category")
    summary: str = Field(description="Short human-readable line for the operations UI")
    detail: str | None = Field(
        default=None, description="Optional longer context (reason, SOP id, message excerpt)"
    )
    created_at: datetime = Field(description="UTC timestamp when the event was recorded")


class EnquiryHistoryResponse(BaseModel):
    enquiry: EnquiryResponse = Field(description="Current enquiry snapshot")
    events: list[HistoryEvent] = Field(
        description="Timeline events ordered oldest-first by `created_at`"
    )


class HealthResponse(BaseModel):
    status: Literal["ok"] = Field(
        default="ok",
        description="API process liveness",
    )
    service: str = Field(
        examples=["SignalDesk API"],
        description="Configured application name",
    )
    database: Literal["connected", "unavailable"] = Field(
        description="Result of a lightweight database connectivity check"
    )


class ErrorResponse(BaseModel):
    detail: str = Field(
        description="Single human-readable error message",
        examples=["Enquiry '550e8400-e29b-41d4-a716-446655440000' was not found"],
    )
