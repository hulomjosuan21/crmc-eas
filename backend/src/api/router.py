from fastapi import APIRouter

from src.api.routes.department_router import DepartmentRouter
from src.api.routes.officer_router import OfficerRouter
from src.api.routes.student_router import StudentRouter

api_router = APIRouter()

routers = [
    DepartmentRouter(),
    OfficerRouter(),
    StudentRouter()
]

for router in routers:
    api_router.include_router(router.get_router())
