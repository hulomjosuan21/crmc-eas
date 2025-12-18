import uuid
from fastapi import Request
from src.api.routes.base_router import BaseRouter
from src.services.department_service import DepartmentService
from src.core.response import BaseResponse


class DepartmentRouter(BaseRouter):
    prefix = "/department"
    tags = ["Department"]

    def _register_routes(self):
        @self.router.delete("/{department_id}", name="delete_department")
        async def delete_department(
                request: Request,
                department_id: uuid.UUID
        ):

            db = request.state.db
            service = DepartmentService(db)

            try:
                await service.delete_department(department_id)
                await db.commit()
                return BaseResponse({
                    "message": "Department deleted successfully."
                })
            except Exception as e:
                await db.rollback()
                raise e