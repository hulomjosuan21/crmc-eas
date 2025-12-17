from typing import Sequence, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.department import Department


class DepartmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[Department]:
        result = await self.db.execute(select(Department))
        return result.scalars().all()

    async def get_by_google_sub_id(self, google_sub_id: str) -> Optional[Department]:
        result = await self.db.execute(
            select(Department).filter(Department.oauth_id == google_sub_id)
        )
        return result.scalars().first()

    async def update_online_status(self, department: Department, is_online: bool) -> Department:
        department.is_online = is_online
        await self.db.commit()
        await self.db.refresh(department)
        return department