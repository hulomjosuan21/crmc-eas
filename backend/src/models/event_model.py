from __future__ import annotations
from typing import Optional,TYPE_CHECKING, List
from sqlalchemy import String, Text, ForeignKey, DateTime, func
from src.core.database import Base
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

if TYPE_CHECKING:
    from src.models.event_media_model import EventMedia
    from src.models.tags_model import EventTag
    from src.models.audience_model import Audience

class Event(Base):
    __tablename__ = "events_table"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_title: Mapped[str] = mapped_column(String(250), nullable=False)

    event_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    event_target_program_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("programs_table.program_id", ondelete="SET NULL"),
        nullable=True
    )

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments_table.department_id", ondelete="CASCADE"),
        nullable=False
    )

    event_tags: Mapped[List[EventTag]] = relationship(cascade="all, delete-orphan")
    event_target_audiences: Mapped[list[Audience]] = relationship(cascade="all, delete-orphan")
    event_media: Mapped[List[EventMedia]] = relationship(cascade="all, delete-orphan")

    event_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())