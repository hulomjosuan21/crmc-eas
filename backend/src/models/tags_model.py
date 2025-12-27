from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from src.core.database import Base
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

if TYPE_CHECKING:
    from src.models.event_model import Event

class EventTag(Base):
    __tablename__ = "event_tag_table"

    tag_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tag_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events_table.event_id", ondelete="CASCADE"),
        nullable=False
    )