import uuid
from typing import Optional

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from src.core.database import Base

class Audience(Base):
    __tablename__ = "audience_table"

    audience_group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    audience_group_name: Mapped[str] = mapped_column(String(100), nullable=False)

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events_table.event_id", ondelete="CASCADE"),
        nullable=False
    )

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