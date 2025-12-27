from typing import Sequence
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.program_model import Program
from src.schemas.program_update_schema import ProgramUpdate

class ProgramRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, program: Program):
        self.db.add(program)
        return program

    async def update(self, event_id: UUID, update_data: ProgramUpdate) -> Program | None:
        update_dict = update_data.model_dump(exclude_unset=True)
        if not update_dict:
            return await self.get_by_id(event_id)
        event = await self.get_by_id(event_id)

        if event:
            for key, value in update_dict.items():
                if hasattr(event, key):
                    setattr(event, key, value)
            return event
        return None

    async def delete(self, program: Program) -> None:
        await self.db.delete(program)

    async def get_by_id(self, program_id: UUID) -> Program | None:
        query = select(Program).where(Program.program_id == program_id)
        result = await self.db.execute(query)
        return result.scalars().first()