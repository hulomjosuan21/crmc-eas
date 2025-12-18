from pydantic import BaseModel, field_validator, Field
from uuid import UUID

class ProgramCreateSchema(BaseModel):
    program_code: str = Field(..., alias="programCode")
    program_name: str = Field(..., alias="programName")
    department_id: UUID = Field(..., alias="departmentId")

    @field_validator("program_code")
    @classmethod
    def validate_program_code(cls, v):
        if not v:
            raise ValueError("Program code is required")
        if len(v) > 20:
            raise ValueError("Program code must be at most 20 characters")
        return v

    @field_validator("program_name")
    @classmethod
    def validate_program_name(cls, v):
        if not v:
            raise ValueError("Program name is required")
        if len(v) > 250:
            raise ValueError("Program name must be at most 250 characters")
        return v

    @field_validator("department_id")
    @classmethod
    def validate_department_id(cls, v):
        if not v:
            raise ValueError("Department ID is required")
        return v

    class Config:
        orm_mode = True
        populate_by_name = True
