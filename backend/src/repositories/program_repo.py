from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.program_model import Program


class ProgramRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, program: Program):
        self.db.add(program)
        return program

    async def get_by_id(self, program_id: UUID) -> Program | None:
        query = select(Program).where(Program.program_id == program_id)
        result = await self.db.execute(query)
        return result.scalars().first()