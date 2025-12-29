from sqlalchemy import String, ForeignKey, DateTime, func, Index
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from src.core.database import Base
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

class Program(Base):
    __tablename__ = "programs_table"

    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    program_name: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments_table.department_id", ondelete="CASCADE"),
        nullable=False
    )

    program_created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    program_updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    __table_args__ = (
        Index(
            "ix_program_name_trgm",
            "program_name",
            postgresql_using="gist",
            postgresql_ops={"program_name": "gist_trgm_ops"}
        ),
    )