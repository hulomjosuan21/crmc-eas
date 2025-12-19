from uuid import UUID

from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.department_model import Department


class DepartmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, department: Department) -> Department:
        self.db.add(department)
        return department

    async def get_by_id(self, department_id: UUID) -> Department | None:
        query = select(Department).where(Department.department_id == department_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_email(self, email: EmailStr) -> Department | None:
        stmt = select(Department).where(Department.oauth_email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_oauth_id(self, oauth_id: str) -> Department | None:
        query = select(Department).where(Department.oauth_id == oauth_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def delete(self, department: Department) -> None:
        await self.db.delete(department)