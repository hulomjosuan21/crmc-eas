from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from src.core.exceptions import ConflictError
from src.models.program_model import Program
from src.repositories.program_repo import ProgramRepository
from src.schemas.program_schema import ProgramCreateSchema, ProgramRead, ProgramSelectOption
from sqlalchemy.exc import IntegrityError

class ProgramService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProgramRepository(db)

    async def get_programs_for_select_options(self, department_id: UUID):
        stmt = (
            select(
                Program.program_id,
                Program.program_name,
                Program.program_code
            )
            .where(Program.department_id == department_id)
        )
        result = await self.db.execute(stmt)
        rows = result.mappings().all()

        return [
            ProgramSelectOption(
                programId=str(row["program_id"]),
                programName=row["program_name"],
                programCode=row["program_code"]
            )
            for row in rows
        ]

    async def create_program(self, program: ProgramCreateSchema) -> Program:
        try:
            program_data = program.model_dump(by_alias=False)
            new_program = Program(**program_data)

            await self.repo.create(new_program)
            await self.db.flush()

            return new_program
        except IntegrityError:
            await self.db.rollback()
            raise ConflictError(detail=f"Program is already exists")

    async def get_programs_by_department_id(self, department_id: UUID):
        stmt = select(Program).where(Program.department_id == department_id)
        result = await self.db.execute(stmt)
        rows = result.scalars().all()
        return [
            ProgramRead(
                programId=str(p.program_id),
                programCode=p.program_code,
                programName=p.program_name,
                departmentId=str(p.department_id),
                programCreatedAt=p.program_created_at,
                programUpdatedAt=p.program_updated_at
            )
            for p in rows
        ]

    async def delete_program_by_program_id(self, program_id: UUID):
        target_program: Program | None = await self.db.get(Program, program_id)
        if target_program is None:
            raise ConflictError(detail=f"Program not found")
        await self.repo.delete(program=target_program)