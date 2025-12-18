from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from src.core.database import Base
from sqlalchemy.dialects.postgresql import UUID

class Program(Base):
    __tablename__ = "programs_table"

    program_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    program_name: Mapped[str] = mapped_column(String(250), nullable=False)

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments_table.department_id", ondelete="CASCADE"),
        nullable=False
    )
