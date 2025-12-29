from fastapi import Request
from src.api.routes.base_router import BaseRouter
from src.schemas.audience_schema import AudienceCreateSchema
from src.services.audience_service import AudienceService
from src.models.audience_model import Audience
from uuid import UUID
from src.core.response import BaseResponse

class AudienceRouter(BaseRouter):
    prefix = "/audience"
    tags = ["Audience"]

    def _register_routes(self):
        @self.router.get("/list/{department_id}")
        async def list_programs(department_id: UUID, request: Request):
            db = request.state.db
            service = AudienceService(db)
            result = await service.get_audiences(department_id=department_id)
            return BaseResponse([item.model_dump() for item in result])

        @self.router.post("/create")
        async def create_new_audience(payload: AudienceCreateSchema, request: Request):
            db = request.state.db
            service = AudienceService(db)
            new_audience = await service.create_audience(payload)
            await db.commit()

            return BaseResponse(
                detail=f"{new_audience.audience_name} audience created successfully.",
            )

        @self.router.delete("/delete/{audience_id}")
        async def delete_audience(audience_id: UUID, request: Request):
            db = request.state.db
            service = AudienceService(db)

            await service.delete_program_by_audience_id(audience_id=audience_id)

            await db.commit()

            return BaseResponse(
                detail=f"Audience deleted successfully.",
            )