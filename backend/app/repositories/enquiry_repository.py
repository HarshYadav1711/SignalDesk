from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Enquiry


class EnquiryRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, enquiry_id: str) -> Enquiry | None:
        return self._db.get(Enquiry, enquiry_id)

    def get_with_events(self, enquiry_id: str) -> Enquiry | None:
        stmt = (
            select(Enquiry)
            .where(Enquiry.id == enquiry_id)
            .options(selectinload(Enquiry.events))
        )
        return self._db.scalars(stmt).first()

    def add(self, enquiry: Enquiry) -> Enquiry:
        self._db.add(enquiry)
        self._db.flush()
        return enquiry

    def save(self, enquiry: Enquiry) -> Enquiry:
        """Persist changes to an enquiry already tracked in the session."""
        return self.add(enquiry)
