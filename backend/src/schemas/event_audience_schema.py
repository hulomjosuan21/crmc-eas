from typing import Optional

from pydantic import BaseModel, field_validator, Field, ConfigDict
from uuid import UUID
from datetime import datetime

class EventAudienceCreateSchema(BaseModel):
    event_audience_name: str = Field(..., alias="eventAudienceName")
    program_id: UUID = Field(..., alias="programId")
    department_id: UUID = Field(..., alias="departmentId")

    @field_validator("event_audience_name")
    @classmethod
    def validate_event_audience_name(cls, v):
        if not v:
            raise ValueError("Event audience code is required")
        if len(v) > 20:
            raise ValueError("Event audience code must be at most 20 characters")
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

class EventAudienceRead(BaseModel):
    eventAudienceId: str
    eventAudienceName: str
    departmentId: str
    programId: Optional[str] = None
    programName: Optional[str] = None
    programCode: Optional[str] = None
    eventAudienceCreatedAt: datetime
    eventAudienceUpdatedAt: datetime