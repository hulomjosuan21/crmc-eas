import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.exceptions import NotFoundError, ConflictError, DomainException
from src.models.department_model import Department, DepartmentRoleEnum
from fastapi import UploadFile

from src.repositories.department_repo import DepartmentRepository
from src.services.file_service import FileService


class DepartmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = DepartmentRepository(db)

    async def register_initial_department(
            self,
            code: str,
            name: str,
            role: DepartmentRoleEnum,
            image_file: UploadFile
    ) -> Department:
        if not code.isupper() or not code.isalnum():
            raise DomainException(detail="Department code must be uppercase letters and numbers only.")

        folder_name = f"department/{uuid.uuid4()}"
        image_url = await FileService.upload_file(image_file, folder_name)

        new_department = Department(
            department_code=code,
            department_name=name,
            role=role,
            department_image=image_url,
            oauth_email="PENDING_AUTH",
        )

        await self.repo.create(new_department)

        await self.db.flush()

        return new_department

    async def bind_google_credentials(self, department_id: uuid.UUID, user_info: dict) -> Department:
        department = await self.repo.get_by_id(department_id)
        if not department:
            raise NotFoundError(detail="Department record not found.")

        oauth_id = user_info.get('sub')
        existing_dept = await self.repo.get_by_oauth_id(oauth_id)

        if existing_dept and existing_dept.department_id != department_id:
            raise ConflictError(detail="Google account already linked to another department.")

        department.oauth_id = oauth_id
        department.oauth_email = user_info.get('email')

        await self.db.commit()
        await self.db.refresh(department)
        return department

    async def delete_pending_department(self, department_id: uuid.UUID):
        department = await self.repo.get_by_id(department_id)
        if department and department.oauth_email == "PENDING_AUTH":
            await self.repo.delete(department)
            await self.db.commit()

    async def delete_department(self, department_id: uuid.UUID) -> None:
        department = await self.repo.get_by_id(department_id)
        if not department:
            raise DomainException(detail="Department not found")
        await self.repo.delete(department)