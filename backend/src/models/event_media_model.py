from sqlalchemy import ForeignKey, String, DateTime, func
from datetime import datetime
from src.core.database import Base
import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

class EventMedia(Base):
    __tablename__ = "event_media_table"

    media_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events_table.event_id"))

    media_file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    media_type: Mapped[str] = mapped_column(String(20), nullable=False)

    media_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())