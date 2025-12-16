from pydantic import BaseModel, Field,field_validator
from uuid import UUID
from datetime import datetime

from src.models.department import DepartmentRoleEnum


class DepartmentCreate(BaseModel):
    department_code: str = Field(
        "departmentCode",
        max_length=20,
    )
    department_name: str = Field(
        "departmentName",
        max_length=250,
    )
    google_sub_id: str = Field("googleSubId")
    role: DepartmentRoleEnum = DepartmentRoleEnum.DEPARTMENT

    @field_validator('department_code')
    @classmethod
    def check_department_code_format(cls, value: str):
        if not value.isupper() or not value.isalnum():
            raise ValueError("Department code must be entirely uppercase letters and numbers.")
        return value

    @field_validator('google_sub_id')
    @classmethod
    def validate_google_sub_id_format(cls, value: str):
        if not value.isdigit() or len(value) != 21:
            raise ValueError("Google Sub ID must be a 21-digit number.")
        return value