from typing import Any, Optional
from fastapi import status
from fastapi.responses import ORJSONResponse


class BaseResponse(ORJSONResponse):
    def __init__(
            self,
            content: Any = None,
            payload: Optional[Any] = None,
            success: bool = True,
            code: str = "Success",
            detail: str = "Operation successful",
            status_code: int = status.HTTP_200_OK,
    ):
        if content is not None:
            final_response = content
        else:
            final_response = {k: v for k, v in {
                "success": success,
                "code": code,
                "detail": detail,
                "payload": payload
            }.items() if v}

        super().__init__(content=final_response, status_code=status_code)