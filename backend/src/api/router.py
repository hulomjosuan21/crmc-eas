from fastapi import APIRouter

from src.api.routes.audience_router import AudienceRouter
from src.api.routes.auth_router import AuthRouter
from src.api.routes.department_router import DepartmentRouter
from src.api.routes.officer_router import OfficerRouter
from src.api.routes.program_router import ProgramRouter
from src.api.routes.student_router import StudentRouter

api_router = APIRouter()

routers = [
    AuthRouter(),
    DepartmentRouter(),
    OfficerRouter(),
    StudentRouter(),
    ProgramRouter(),
    AudienceRouter()
]

for router in routers:
    api_router.include_router(router.get_router())
