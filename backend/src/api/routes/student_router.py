from fastapi import Request
from src.api.routes.base_router import BaseRouter
from src.services.student_service import StudentService
from src.core.response import BaseResponse
from src.core.exceptions import DomainException, BadRequestError, NotFoundError

class StudentRouter(BaseRouter):
    prefix = '/student'
    tags = ['Student']

    def _register_routes(self):
        @self.router.post("/sync/{student_school_id}")
        async def sync_student_from_school_id(student_school_id: str, request: Request):
            db = request.state.db
            service = StudentService(db)

            try:
                student, action = await service.sync_student_from_school_id(student_school_id=student_school_id)
                if action == "sign-up":
                    await db.commit()
                    detail_msg = f"Student {student.firstName} {student.lastName} has been successfully sign up."
                else:
                    detail_msg = f"Welcome back, {student.firstName}! You have successfully sign in."

                return BaseResponse(
                    detail=detail_msg,
                    payload=student.model_dump()
                )
            except (BadRequestError, NotFoundError, DomainException) as de:
                await db.rollback()
                raise de
            except Exception as e:
                await db.rollback()
                raise DomainException(detail="An internal error occurred during student synchronization.")