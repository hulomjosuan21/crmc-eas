from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.officer_model import Officer
from uuid import UUID

class OfficerRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, officer: Officer):
        self.db.add(officer)
        return officer

    async def get_by_id(self, officer_id: UUID) -> Officer | None:
        query = select(Officer).where(Officer.officer_id == officer_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_email(self, email: EmailStr):
        stmt = select(Officer).where(Officer.oauth_email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_oauth_id(self, oauth_id: str) -> Officer | None:
        query = select(Officer).where(Officer.oauth_id == oauth_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def delete(self, officer: Officer) -> None:
        await self.db.delete(officer)