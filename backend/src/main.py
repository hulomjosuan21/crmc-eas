import os
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.exc import OperationalError, DBAPIError
from starlette.middleware.sessions import SessionMiddleware
from src.api.router import api_router
from src.core.config import settings
from src.core.exceptions import DomainException
from src.core.socket import socketio_asgi

async def exception_handler(request: Request, exc: Exception):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "SERVER_ERROR"
    message = "An unexpected error occurred on the server. Please check logs for details."

    if isinstance(exc, DomainException):
        status_code = exc.status_code
        error_code = exc.code
        message = exc.message

    elif isinstance(exc, (OperationalError, DBAPIError)):
        print(f"CRITICAL DB ERROR: {exc}")
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        error_code = "DB_UNAVAILABLE"
        message = "The database service is currently unavailable. Please try again later."

    else:
        print(f"UNHANDLED EXCEPTION: {type(exc).__name__}: {str(exc)}")
        if isinstance(exc, HTTPException):
            status_code = exc.status_code
            message = exc.detail
            error_code = "HTTP_ERROR"

    return JSONResponse(
        status_code=status_code,
        content={
            "code": error_code,
            "message": message
        },
    )

os.makedirs(settings.FILES_STORAGE_PATH, exist_ok=True)
app = FastAPI(title=settings.PROJECT_NAME,docs_url=None,redoc_url=None,openapi_url=None)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # 🔑
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="fapi_session",
    same_site="lax",
    https_only=False,
    max_age=3600
)
app.add_exception_handler(DomainException, exception_handler)
app.add_exception_handler(OperationalError, exception_handler)
app.add_exception_handler(DBAPIError, exception_handler)
app.add_exception_handler(Exception, exception_handler)

app.mount(
    settings.FILES_STATIC_URL,
    StaticFiles(directory=settings.FILES_STORAGE_PATH),
    name="static_files"
)
app.include_router(api_router)

for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"Path: {route.path} | Name: {route.name} | Methods: {route.methods}")
app.mount("/ws",socketio_asgi)

