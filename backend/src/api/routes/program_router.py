from uuid import UUID

from src.api.routes.base_router import BaseRouter
from src.core.response import BaseResponse
from src.schemas.program_schema import ProgramCreateSchema
from fastapi import Request
from src.services.program_service import ProgramService

class ProgramRouter(BaseRouter):
    prefix = "/program"
    tags = ["Program"]

    def _register_routes(self):
        @self.router.get("/list/{department_id}")
        async def list_programs(department_id: UUID, request: Request):
            db = request.state.db
            service = ProgramService(db)
            result = await service.get_programs_by_department_id(department_id=department_id)
            return BaseResponse([item.model_dump() for item in result])

        @self.router.get("/select-options/{department_id}")
        async def select_options(department_id: UUID, request: Request):
            db = request.state.db
            service = ProgramService(db)
            result = await service.get_programs_for_select_options(department_id=department_id)
            return BaseResponse([item.model_dump() for item in result])

        @self.router.post("/create")
        async def create_new_program(payload: ProgramCreateSchema, request: Request):
            db = request.state.db
            service = ProgramService(db)

            new_program = await service.create_program(payload)

            await db.commit()

            return BaseResponse(
                detail=f"{new_program.program_name} program created successfully.",
            )

        @self.router.delete("/delete/{program_id}")
        async def delete_program(program_id: UUID, request: Request):
            db = request.state.db
            service = ProgramService(db)

            await service.delete_program_by_program_id(program_id=program_id)

            await db.commit()

            return BaseResponse(
                detail=f"Program deleted successfully.",
            )
