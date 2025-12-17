from __future__ import annotations
import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional, List
from sqlalchemy import String, Enum as SQLEnum, DateTime, func, Boolean, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base
from src.listeners.department_listener import delete_department_image

if TYPE_CHECKING:
    from src.models.student import Student

class DepartmentRoleEnum(str, enum.Enum):
    SCHOOL = "school"
    DEPARTMENT = "department"

class Department(Base):
    __tablename__ = "departments_table"

    department_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    oauth_id: Mapped[str | None] = mapped_column(String(100), unique=True, index=True, nullable=True)
    oauth_email: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)

    is_online: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    department_code: Mapped[str] = mapped_column(String(20), unique=True ,index=True, nullable=False)
    department_name: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)

    department_image: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)

    role: Mapped[DepartmentRoleEnum] = mapped_column(
        SQLEnum(
            DepartmentRoleEnum,
            name="department_role_enum",
            native_enum=True,
            values_callable=lambda obj: [e.value for e in obj]
        ),
        default=DepartmentRoleEnum.DEPARTMENT,
        nullable=False
    )

    department_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    department_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

event.listen(Department, 'after_delete', delete_department_image)