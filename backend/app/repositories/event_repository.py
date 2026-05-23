from sqlalchemy.orm import Session

from app.models import EnquiryEvent


class EventRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def add(self, event: EnquiryEvent) -> EnquiryEvent:
        self._db.add(event)
        self._db.flush()
        return event
