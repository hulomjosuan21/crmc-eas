from typing import Optional

from pydantic import BaseModel, field_validator, Field, ConfigDict
from uuid import UUID
from datetime import datetime

class AudienceCreateSchema(BaseModel):
    audience_name: str = Field(..., alias="audienceName")
    program_id: UUID = Field(..., alias="programId")
    department_id: UUID = Field(..., alias="departmentId")

    @field_validator("audience_name")
    @classmethod
    def validate_audience_name(cls, v):
        if not v:
            raise ValueError("Audience code is required")
        if len(v) > 20:
            raise ValueError("Audience code must be at most 20 characters")
        return v

    @field_validator("program_id")
    @classmethod
    def validate_program_id(cls, v):
        if not v:
            raise ValueError("Program ID is required")
        return v

    @field_validator("department_id")
    @classmethod
    def validate_department_id(cls, v):
        if not v:
            raise ValueError("Department ID is required")
        return v

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class AudienceRead(BaseModel):
    audienceId: str
    audienceName: str
    departmentId: str
    programId: Optional[str] = None
    programName: Optional[str] = None
    programCode: Optional[str] = None
    audienceCreatedAt: datetime
    audienceUpdatedAt: datetime