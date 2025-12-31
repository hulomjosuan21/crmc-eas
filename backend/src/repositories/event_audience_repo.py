from sqlalchemy.ext.asyncio import AsyncSession

from src.models.event_audience_model import EventAudience


class EventAudienceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, event_audience: EventAudience):
        self.db.add(event_audience)
        return event_audience

    async def delete(self, event_audience: EventAudience) -> None:
        await self.db.delete(event_audience)