from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import ConflictError
from src.models.event_audience_model import EventAudience
from src.models.program_model import Program
from src.repositories.event_audience_repo import EventAudienceRepository
from src.schemas.event_audience_schema import EventAudienceCreateSchema, EventAudienceRead
from sqlalchemy.exc import IntegrityError
from uuid import UUID

class EventAudienceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = EventAudienceRepository(db)

    async def create_event_audience(self, audience: EventAudienceCreateSchema) -> EventAudience:
        try:
            audience_data = audience.model_dump(by_alias=False)
            new_audience = EventAudience(**audience_data)

            await self.repo.create(new_audience)
            await self.db.flush()

            return new_audience
        except IntegrityError:
            await self.db.rollback()
            raise ConflictError(detail=f"Program '{audience.audience_name}' is already exists")

    async def get_event_audiences(self, department_id: UUID):
        stmt = (
            select(
                EventAudience.event_audience_id,
                EventAudience.event_audience_name,
                EventAudience.department_id,
                EventAudience.program_id,
                Program.program_id.label("program_id"),
                Program.program_name.label("program_name"),
                Program.program_code.label("program_code"),
                EventAudience.event_audience_created_at,
                EventAudience.event_audience_updated_at,
            )
            .outerjoin(Program, EventAudience.program_id == Program.program_id)
            .where(EventAudience.department_id == department_id)
            .order_by(EventAudience.event_audience_name)
        )

        result = await self.db.execute(stmt)
        rows = result.mappings().all()

        return [
            EventAudienceRead(
                eventAudienceId=str(row["event_audience_id"]),
                eventAudienceName=row["event_audience_name"],
                departmentId=str(row["department_id"]),
                programId=str(row["program_id"]) if row["program_id"] else None,
                programName=row["program_name"],
                programCode=row["program_code"],
                eventAudienceCreatedAt=row["event_audience_created_at"],
                eventAudienceUpdatedAt=row["event_audience_updated_at"],
            )
            for row in rows
        ]

    async def delete_program_by_event_audience_id(self, event_audience_id: UUID):
        target_event_audience: EventAudience | None = await self.db.get(EventAudience, event_audience_id)
        if target_event_audience is None:
            raise ConflictError(detail=f"Event Audience not found")
        await self.repo.delete(event_audience=target_event_audience)