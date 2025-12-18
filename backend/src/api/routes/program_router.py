from src.api.routes.base_router import BaseRouter
from src.core.response import BaseResponse
from src.schemas.program_schema import ProgramCreateSchema
from fastapi import Request
from src.services.program_service import ProgramService

class ProgramRouter(BaseRouter):
    prefix = "/program"
    tags = ["Program"]

    def _register_routes(self):
        @self.router.post("/new", name="create_new_program")
        async def create_new_program(payload: ProgramCreateSchema, request: Request):
            db = request.state.db
            service = ProgramService(db)

            new_program = await service.create_program(payload)

            await db.commit()

            return BaseResponse(
                detail=f"{new_program.program_name} program created successfully.",
            )