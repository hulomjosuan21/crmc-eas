from __future__ import annotations
import uuid
from typing import Optional, TYPE_CHECKING
from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.core.database import Base

if TYPE_CHECKING:
    from src.models.program_model import Program

class EventAudience(Base):
    __tablename__ = "event_audience_table"

    event_audience_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    event_audience_name: Mapped[str] = mapped_column(String(100), nullable=False)

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments_table.department_id", ondelete="CASCADE"),
        nullable=False
    )

    program_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("programs_table.program_id", ondelete="SET NULL"),
        nullable=True
    )

    program: Mapped[Optional["Program"]] = relationship(
        "Program",
        lazy="raise",
    )

    event_audience_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    event_audience_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )