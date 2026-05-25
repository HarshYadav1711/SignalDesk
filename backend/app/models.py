import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class EnquiryStatus(str, enum.Enum):
    RECEIVED = "received"
    PROCESSING = "processing"
    MATCHED = "matched"
    ESCALATED = "escalated"
    CLOSED = "closed"


class EventType(str, enum.Enum):
    ENQUIRY_CREATED = "enquiry_created"
    TASK_STARTED = "task_started"
    SOP_MATCHED = "sop_matched"
    AUTO_ESCALATED = "auto_escalated"
    MANUAL_ESCALATED = "manual_escalated"
    FOLLOW_UP = "follow_up"
    RESPONSE_SUGGESTED = "response_suggested"
    # Reserved for future timeline use; not emitted by the current workflow.
    TASK_PROCESSED = "task_processed"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    channel: Mapped[str] = mapped_column(String(40))
    subject: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[EnquiryStatus] = mapped_column(
        Enum(EnquiryStatus), default=EnquiryStatus.RECEIVED
    )
    matched_sop_id: Mapped[str | None] = mapped_column(String(40), nullable=True)
    matched_sop_title: Mapped[str | None] = mapped_column(String(120), nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    events: Mapped[list["EnquiryEvent"]] = relationship(
        back_populates="enquiry",
        order_by="EnquiryEvent.created_at, EnquiryEvent.id",
        cascade="all, delete-orphan",
    )


class EnquiryEvent(Base):
    __tablename__ = "enquiry_events"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    enquiry_id: Mapped[str] = mapped_column(String(36), ForeignKey("enquiries.id"))
    event_type: Mapped[EventType] = mapped_column(Enum(EventType))
    summary: Mapped[str] = mapped_column(String(255))
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="events")
