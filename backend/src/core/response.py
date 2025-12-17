from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import status

class BaseResponse(JSONResponse):
    def __init__(
        self,
        content: Any = None,
        payload: Optional[Any] = None,
        success: bool = True,
        code: str = "SUCCESS",
        detail: str = "Operation successful",
        status_code: int = status.HTTP_200_OK,
    ):
        if content is not None:
            final_response = content

        else:
            final_response = {
                "success": success,
                "code": code,
                "detail": detail,
                "payload": payload
            }

        super().__init__(
            content=jsonable_encoder(final_response),
            status_code=status_code
        )