from __future__ import annotations
import uuid
from typing import TYPE_CHECKING

from datetime import datetime

from sqlalchemy import String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base

if TYPE_CHECKING:
    from src.models.department import Department

class Student(Base):
    __tablename__ = "students_table"

    student_id: Mapped[str] = mapped_column(String(100), primary_key=True)

    full_name: Mapped[str] = mapped_column(String(250), nullable=False)

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "departments_table.department_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    student_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    student_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )