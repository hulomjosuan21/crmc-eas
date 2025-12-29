from sqlalchemy.ext.asyncio import AsyncSession

from src.models.audience_model import Audience


class AudienceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, audience: Audience):
        self.db.add(audience)
        return audience

    async def delete(self, audience: Audience) -> None:
        await self.db.delete(audience)