import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID,JSONB
from src.core.database import Base

class Officer(Base):
    __tablename__ = "officers_table"

    officer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "departments_table.department_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    full_name: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)

    role_label: Mapped[str] = mapped_column(String(100), nullable=False)
    assigned_permissions: Mapped[List[str]] = mapped_column(JSONB, nullable=False, default=list)

    oauth_id: Mapped[str | None] = mapped_column(String(100), unique=True, index=True, nullable=True)
    oauth_email: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)
    oauth_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    officer_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    officer_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )