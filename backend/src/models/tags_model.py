from __future__ import annotations
from sqlalchemy import Integer, ForeignKey, String
from src.core.database import Base
import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

class EventTag(Base):
    __tablename__ = "event_tag_table"

    event_tag_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )
    event_tag_name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events_table.event_id", ondelete="CASCADE"),
        nullable=False
    )