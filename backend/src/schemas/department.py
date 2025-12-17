from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional

from src.models.department import DepartmentRoleEnum


class DepartmentCreate(BaseModel):
    department_code: str = Field(
        ...,
        alias="departmentCode"
    )
    department_name: str = Field(
        ...,
        alias="departmentName"
    )
    role: DepartmentRoleEnum = Field(DepartmentRoleEnum.DEPARTMENT)

    google_sub_id: str = Field(
        ...,
        alias="googleSubId"
    )
    google_email: EmailStr = Field(
        ...,
        alias="googleEmail"
    )
    google_name: str = Field(
        ...,
        alias="googleName"
    )
    google_image: Optional[str] = Field(
        None,
        alias="googleImage"
    )

    @field_validator('department_code')
    @classmethod
    def check_department_code_format(cls, value: str):
        if not value.isupper() or not value.isalnum():
            raise ValueError("Department code must be entirely uppercase letters and numbers.")
        return value

    @field_validator('google_sub_id')
    @classmethod
    def validate_google_sub_id_format(cls, value: str):
        if not value.isdigit() or len(value) not in range(16, 22):
            raise ValueError("Google Sub ID must be a number string between 16 and 21 digits long.")
        return value