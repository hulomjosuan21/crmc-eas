from __future__ import annotations
import enum
from typing import Optional, TYPE_CHECKING, List, Any
from sqlalchemy import String, Text, ForeignKey, DateTime, func, Enum as SqlEnum
from src.core.database import Base
import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, TSTZRANGE
from datetime import datetime

if TYPE_CHECKING:
    from src.models.event_media_model import EventMedia
    from src.models.tags_model import EventTag

class EventEnumVisibility(str, enum.Enum):
    TARGET_ONLY = "target_only"
    PUBLIC = "public"

class EventSchedule(Base):
    __tablename__ = "event_schedules_table"
    event_schedule_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events_table.event_id", ondelete="CASCADE"))
    event_schedule_label: Mapped[str] = mapped_column(String(100), nullable=False)
    event_schedule_datetime_range: Mapped[Any] = mapped_column(
        TSTZRANGE,
        nullable=False
    )

class Event(Base):
    __tablename__ = "events_table"

    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_title: Mapped[str] = mapped_column(String(250), nullable=False)

    event_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    event_cover_image: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    event_visibility_type: Mapped[EventEnumVisibility] = mapped_column(
        SqlEnum(
            EventEnumVisibility,
            name="event_visibility_enum",
            native_enum=True,
            values_callable=lambda obj: [e.value for e in obj]
        ),
        default=EventEnumVisibility.TARGET_ONLY,
        nullable=False
    )

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

    event_schedules: Mapped[List["EventSchedule"]] = relationship(
        "EventSchedule",
        cascade="all, delete-orphan",
        order_by="EventSchedule.event_schedule_datetime_range",
        lazy="raise"
    )

    event_tags: Mapped[List["EventTag"]] = relationship("EventTag",cascade="all, delete-orphan",lazy="raise")
    event_media: Mapped[List["EventMedia"]] = relationship("EventMedia",cascade="all, delete-orphan",lazy="raise")

    event_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    event_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )