from fastapi import APIRouter

from src.api.routes.student_router import StudentRouter

api_router = APIRouter()

routers = [
    StudentRouter()
]

for router in routers:
    api_router.include_router(router.get_router())
