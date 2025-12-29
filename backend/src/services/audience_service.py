from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import ConflictError
from src.models.audience_model import Audience
from src.models.program_model import Program
from src.repositories.audience_repo import AudienceRepository
from src.schemas.audience_schema import AudienceCreateSchema, AudienceRead
from sqlalchemy.exc import IntegrityError
from uuid import UUID
class AudienceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AudienceRepository(db)

    async def create_audience(self, audience: AudienceCreateSchema) -> Audience:
        try:
            audience_data = audience.model_dump(by_alias=False)
            new_audience = Audience(**audience_data)

            await self.repo.create(new_audience)
            await self.db.flush()

            return new_audience
        except IntegrityError:
            await self.db.rollback()
            raise ConflictError(detail=f"Program '{audience.audience_name}' is already exists")

    async def get_audiences(self, department_id: UUID):
        stmt = (
            select(
                Audience.audience_id,
                Audience.audience_name,
                Audience.department_id,
                Audience.program_id,
                Program.program_id.label("program_id"),
                Program.program_name.label("program_name"),
                Program.program_code.label("program_code"),
                Audience.audience_created_at,
                Audience.audience_updated_at,
            )
            .outerjoin(Program, Audience.program_id == Program.program_id)
            .where(Audience.department_id == department_id)
            .order_by(Audience.audience_name)
        )

        result = await self.db.execute(stmt)
        rows = result.mappings().all()

        return [
            AudienceRead(
                audienceId=str(row["audience_id"]),
                audienceName=row["audience_name"],
                departmentId=str(row["department_id"]),
                programId=str(row["program_id"]) if row["program_id"] else None,
                programName=row["program_name"],
                programCode=row["program_code"],
                audienceCreatedAt=row["audience_created_at"],
                audienceUpdatedAt=row["audience_updated_at"],
            )
            for row in rows
        ]

    async def delete_program_by_audience_id(self, audience_id: UUID):
        target_audience: Audience | None = await self.db.get(Audience, audience_id)
        if target_audience is None:
            raise ConflictError(detail=f"Audience not found")
        await self.repo.delete(audience=target_audience)