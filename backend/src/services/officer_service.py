from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from src.core.exceptions import NotFoundError, ConflictError, DomainException
from src.models.officer_model import Officer
from src.repositories.officer_repo import OfficerRepository
from src.schemas.officer_schema import CreateOfficerSchema

class OfficerService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = OfficerRepository(db)

    async def register_initial_officer(self, officer: CreateOfficerSchema) -> Officer:
        new_officer = Officer(
            full_name=officer.full_name,
            department_id=officer.department_id,
            role_label=officer.role_label,
            assigned_permissions=officer.assigned_permissions,
            oauth_email="PENDING_AUTH"
        )

        await self.repo.create(new_officer)

        await self.db.flush()

        return new_officer

    async def bind_google_credentials(self, officer_id: uuid.UUID, oauth_user: dict) -> Officer:
        officer = await self.repo.get_by_id(officer_id)
        if not officer:
            raise NotFoundError(detail="Officer record not found.")

        oauth_id = oauth_user.get('sub')
        existing_officer = await self.repo.get_by_oauth_id(oauth_id)

        if existing_officer and existing_officer.officer_id != officer_id:
            raise ConflictError(detail="Google account already linked to another officer.")

        officer.oauth_id = oauth_id
        officer.oauth_email = oauth_user.get('email')
        officer.oauth_image = oauth_user.get('picture')

        await self.db.commit()
        await self.db.refresh(officer)
        return officer

    async def delete_pending(self, officer_id: uuid.UUID):
        officer = await self.repo.get_by_id(officer_id)
        if officer and officer.oauth_email == "PENDING_AUTH":
            await self.repo.delete(officer)
            await self.db.commit()

    async def delete_officer(self, department_id: uuid.UUID) -> None:
        officer = await self.repo.get_by_id(department_id)
        if not officer:
            raise DomainException(detail="Officer not found")
        await self.repo.delete(officer)