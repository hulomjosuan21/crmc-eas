from uuid import uuid4, UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.department import Department, DepartmentRoleEnum
from fastapi import HTTPException, status, UploadFile

from src.services.file_service import FileService


class DepartmentService:
    @staticmethod
    async def create_initial_department_record(
            db: AsyncSession,
            dept_code: str,
            dept_name: str,
            role: DepartmentRoleEnum,
            image_file: UploadFile
    ) -> Department:
        folder_name = f"departments/{uuid4()}"
        department_image_url = await FileService.upload_file(image_file, folder_name)

        new_department = Department(
            department_code=dept_code,
            department_name=dept_name,
            role=role,
            department_image=department_image_url,
            google_sub_id=None,
            google_email="PENDING_AUTH@example.com",
            google_name="PENDING_AUTH",
            google_image=None,
        )

        db.add(new_department)
        await db.commit()
        await db.refresh(new_department)

        return new_department

    @staticmethod
    async def update_department_with_google_credentials(
            db: AsyncSession,
            department_id: UUID,
            user_info: dict
    ) -> Department:

        stmt = select(Department).where(Department.department_id == department_id)
        department = (await db.execute(stmt)).scalars().first()

        if not department:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department record not found.")

        conflict_stmt = select(Department).where(
            Department.google_sub_id == user_info.get('sub'),
            Department.department_id != department_id
        )
        if (await db.execute(conflict_stmt)).scalars().first():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                                detail="Google account already linked to another department.")

        department.google_sub_id = user_info.get('sub')
        department.google_email = user_info.get('email')
        department.google_name = user_info.get('name')
        department.google_image = user_info.get('picture')

        await db.commit()
        await db.refresh(department)
        return department