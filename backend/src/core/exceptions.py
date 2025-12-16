from fastapi import HTTPException, status

class DomainException(HTTPException):
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    code: str = "SERVER_ERROR"
    message: str = "An unexpected server error occurred."
    def __init__(self, message: str, code: str | None = None, status_code: int | None = None):
        self.message = message
        if code is not None:
            self.code = code
        if status_code is not None:
            self.status_code = status_code
        super().__init__(status_code=self.status_code, detail=self.message)

class ConflictError(DomainException):
    # 409: Used when an attempted creation or update violates a unique constraint
    status_code = status.HTTP_409_CONFLICT
    code = "RESOURCE_CONFLICT"
    message = "The request could not be processed due to a data conflict or unique constraint violation."

class NotFoundError(DomainException):
    # 404: Used when the requested resource does not exist
    status_code = status.HTTP_404_NOT_FOUND
    code = "RESOURCE_NOT_FOUND"
    message = "The requested resource could not be found."

class AuthenticationFailed(DomainException):
    # 401: Used when credentials (token) are invalid or missing
    status_code = status.HTTP_401_UNAUTHORIZED
    code = "AUTH_FAILED"
    message = "Authentication failed. Invalid or missing credentials."

class ForbiddenError(DomainException):
    # 403: Used when the user is authenticated but lacks permission
    status_code = status.HTTP_403_FORBIDDEN
    code = "ACCESS_FORBIDDEN"
    message = "You are authenticated but lack the necessary permissions to perform this action."

class BadRequestError(DomainException):
    # 400: Used when the client sends a syntactically correct request that violates a fundamental business rule
    status_code = status.HTTP_400_BAD_REQUEST
    code = "BAD_REQUEST"
    message = "The request data violates a fundamental business rule or format requirement."

class UnprocessableEntityError(DomainException):
    # 422: Used for semantic validation failures (e.g., logically inconsistent data)
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    code = "INVALID_DATA"
    message = "The request was well-formed but could not be processed due to invalid or inconsistent data."

class LockedError(DomainException):
    # 423: Used when a resource is temporarily locked and cannot be processed
    status_code = status.HTTP_423_LOCKED
    code = "RESOURCE_LOCKED"
    message = "The resource is currently locked and cannot be modified."

class TooManyRequestsError(DomainException):
    # 429: Used for rate limiting
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    code = "RATE_LIMIT_EXCEEDED"
    message = "You have sent too many requests in a given amount of time. Please try again later."