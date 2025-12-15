import os
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.staticfiles import StaticFiles

from src.api.router import api_router
from src.core.config import settings
from src.core.socket import socketio_asgi

os.makedirs(settings.FILES_STORAGE_PATH, exist_ok=True)
app = FastAPI(title=settings.PROJECT_NAME,docs_url=None,redoc_url=None,openapi_url=None)
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

