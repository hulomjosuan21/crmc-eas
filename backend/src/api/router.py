from fastapi import APIRouter

from src.api.routes.department_router import DepartmentRouter
from src.api.routes.student_router import StudentRouter

api_router = APIRouter()

routers = [
    DepartmentRouter(),
    StudentRouter()
]

for router in routers:
    api_router.include_router(router.get_router())
