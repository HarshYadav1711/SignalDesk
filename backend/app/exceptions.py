class AppError(Exception):
    """Base application error with HTTP mapping in routers."""


class EnquiryNotFoundError(AppError):
    def __init__(self, enquiry_id: str) -> None:
        self.enquiry_id = enquiry_id
        super().__init__(f"Enquiry '{enquiry_id}' was not found")


class InvalidEnquiryStateError(AppError):
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class DuplicateActionError(AppError):
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)
