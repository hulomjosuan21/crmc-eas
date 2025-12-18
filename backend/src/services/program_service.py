from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import ConflictError
from src.models.program_model import Program
from src.repositories.program_repo import ProgramRepository
from src.schemas.program_schema import ProgramCreateSchema
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