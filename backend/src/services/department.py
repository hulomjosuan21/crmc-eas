from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession

from src.models.department import Department
from src.repositories.department import DepartmentRepository
from src.schemas.department import DepartmentCreate
from fastapi import HTTPException, status

class DepartmentService:
    def __init__(self, db: AsyncSession):
        self.department_repo = DepartmentRepository(db)

    async def create_department(self, department_data: DepartmentCreate) -> Department:
        existing_dept = await self.department_repo.get_by_google_sub_id(
            google_sub_id=department_data.google_sub_id
        )

        if existing_dept:
            if existing_dept.department_code == department_data.department_code:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Department code already in use.")
            if existing_dept.google_sub_id == department_data.google_sub_id:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                    detail="This Google Account is already linked to a department.")

        return await self.department_repo.create_department(department_data)

    async def get_all_departments(self) -> Sequence[Department]:
        return await self.department_repo.get_all()