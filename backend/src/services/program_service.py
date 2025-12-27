from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from src.core.exceptions import ConflictError
from src.models.program_model import Program
from src.repositories.program_repo import ProgramRepository
from src.schemas.program_schema import ProgramCreateSchema, ProgramRead
from sqlalchemy.exc import IntegrityError

class ProgramService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = ProgramRepository(db)

    async def create_program(self, program: ProgramCreateSchema) -> Program:
        try:
            program_data = program.model_dump(by_alias=False)
            new_program = Program(**program_data)

            await self.repo.create(new_program)
            await self.db.flush()

            return new_program
        except IntegrityError:
            await self.db.rollback()
            raise ConflictError(detail=f"Program '{program.program_name}' is already exists")

    async def get_programs_by_department_id(self, department_id: UUID):
        stmt = select(Program).where(Program.department_id == department_id)
        result = await self.db.execute(stmt)
        programs = result.scalars().all()
        return [
            ProgramRead(
                programId=str(p.program_id),
                programCode=p.program_code,
                programName=p.program_name,
                departmentId=str(p.department_id),
            )
            for p in programs
        ]