import os

import socketio
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.exc import OperationalError, DBAPIError
from starlette.middleware.sessions import SessionMiddleware
from src.api.router import api_router
from src.core.config import settings
from src.core.exceptions import DomainException
from src.core.socket import sio

async def exception_handler(request: Request, exc: Exception):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "SERVER_ERROR"
    detail = "An unexpected error occurred on the server."
    if isinstance(exc, DomainException):
        status_code = exc.status_code
        error_code = exc.code
        detail = exc.detail
    elif isinstance(exc, (OperationalError, DBAPIError)):
        print(f"CRITICAL DB ERROR: {exc}")
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        error_code = "DB_UNAVAILABLE"
        detail = "The database service is currently unavailable."
    elif isinstance(exc, RequestValidationError):
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        error_code = "VALIDATION_ERROR"
        detail = "; ".join([f"{e['loc'][-1]}: {e['msg']}" for e in exc.errors()])
    elif isinstance(exc, HTTPException):
        status_code = exc.status_code
        error_code = "HTTP_ERROR"
        detail = exc.detail
    else:
        print(f"UNHANDLED EXCEPTION: {type(exc).__name__}: {str(exc)}")

    return JSONResponse(
        status_code=status_code,
        content={
            "code": error_code,
            "detail": detail
        },
    )

os.makedirs(settings.FILES_STORAGE_PATH, exist_ok=True)
app = FastAPI(title=settings.PROJECT_NAME,docs_url=None,redoc_url=None,openapi_url=None)

origins = [
    settings.CLIENT_WEB_URL,
    settings.CLIENT_MOBILE_SCHEMA
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="auth_session",
    same_site="lax",
    https_only=False,
    max_age=3600
)
app.add_exception_handler(HTTPException, exception_handler)
app.add_exception_handler(RequestValidationError, exception_handler)
app.add_exception_handler(DomainException, exception_handler)
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

app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=app,
    socketio_path='socket.io'
)