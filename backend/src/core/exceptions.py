from fastapi import HTTPException, status

class DomainException(HTTPException):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    code: str = "SERVER_ERROR"
    detail: str = "An unexpected server error occurred."
    def __init__(self, detail: str | None = None, code: str | None = None, status_code: int | None = None):
        if detail is None:
            detail = self.detail
        if code is None:
            code = self.code
        if status_code is None:
            status_code = self.status_code
        self.detail = detail
        self.code = code
        self.status_code = status_code
        super().__init__(status_code=self.status_code, detail=self.detail)

class ConflictError(DomainException):
    status_code = status.HTTP_409_CONFLICT
    code = "RESOURCE_CONFLICT"
    detail = "The request could not be processed due to a data conflict or unique constraint violation."

class NotFoundError(DomainException):
    # 404: Used when the requested resource does not exist
    status_code = status.HTTP_404_NOT_FOUND
    code = "RESOURCE_NOT_FOUND"
    detail = "The requested resource could not be found."

class AuthenticationFailed(DomainException):
    # 401: Used when credentials (token) are invalid or missing
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "AUTH_FAILED"
    detail = "Authentication failed. Invalid or missing credentials."

class ForbiddenError(DomainException):
    # 403: Used when the user is authenticated but lacks permission
    status_code = status.HTTP_403_FORBIDDEN
    code = "ACCESS_FORBIDDEN"
    detail = "You are authenticated but lack the necessary permissions to perform this action."

class BadRequestError(DomainException):
    # 400: Used when the client sends a syntactically correct request that violates a fundamental business rule
    status_code = status.HTTP_400_BAD_REQUEST
    code = "BAD_REQUEST"
    detail = "The request data violates a fundamental business rule or format requirement."

class UnprocessableEntityError(DomainException):
    # 422: Used for semantic validation failures (e.g., logically inconsistent data)
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    code = "INVALID_DATA"
    detail = "The request was well-formed but could not be processed due to invalid or inconsistent data."

class LockedError(DomainException):
    # 423: Used when a resource is temporarily locked and cannot be processed
    status_code = status.HTTP_423_LOCKED
    code = "RESOURCE_LOCKED"
    detail = "The resource is currently locked and cannot be modified."

class TooManyRequestsError(DomainException):
    # 429: Used for rate limiting
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    code = "RATE_LIMIT_EXCEEDED"
    detail = "You have sent too many requests in a given amount of time. Please try again later."