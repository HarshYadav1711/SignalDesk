class AppError(Exception):
    """Base domain error; mapped to HTTP responses in app.main exception handlers."""


class EnquiryNotFoundError(AppError):
    """Raised when an enquiry id does not exist."""

    def __init__(self, enquiry_id: str) -> None:
        self.enquiry_id = enquiry_id
        super().__init__(f"Enquiry '{enquiry_id}' was not found")


class InvalidEnquiryStateError(AppError):
    """Raised when an action is incompatible with the enquiry's current status."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class DuplicateActionError(AppError):
    """Raised when an idempotent guard blocks a repeated mutation (e.g. double escalate)."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)
