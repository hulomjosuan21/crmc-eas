from fastapi import Request
from src.api.routes.base_router import BaseRouter
from src.schemas.event_audience_schema import EventAudienceCreateSchema
from src.services.event_audience_service import EventAudienceService
from uuid import UUID
from src.core.response import BaseResponse

class EventAudienceRouter(BaseRouter):
    prefix = "/event-audience"
    tags = ["Audience"]

    def _register_routes(self):
        @self.router.get("/list/{department_id}")
        async def list_programs(department_id: UUID, request: Request):
            db = request.state.db
            service = EventAudienceService(db)
            result = await service.get_event_audiences(department_id=department_id)
            return BaseResponse([item.model_dump() for item in result])

        @self.router.post("/create")
        async def create_new_event_audience(payload: AudienceCreateSchema, request: Request):
            db = request.state.db
            service = EventAudienceService(db)
            new_event_audience = await service.create_event_audience(payload)
            await db.commit()

            return BaseResponse(
                detail=f"{new_event_audience.event_audience_name} audience created successfully.",
            )

        @self.router.delete("/delete/{event_audience_id}")
        async def delete_event_audience(event_audience_id: UUID, request: Request):
            db = request.state.db
            service = EventAudienceService(db)

            await service.delete_program_by_event_audience_id(event_audience_id=event_audience_id)

            await db.commit()

            return BaseResponse(
                detail=f"Audience deleted successfully.",
            )