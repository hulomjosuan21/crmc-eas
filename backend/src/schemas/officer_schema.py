from pydantic import BaseModel, Field
from typing import List
from uuid import UUID

class CreateOfficer(BaseModel):
    department_id: UUID = Field(..., alias="departmentId")

    full_name: str = Field(..., alias="fullName", max_length=250)

    role_label: str = Field(..., alias="roleLabel", max_length=100)
    assigned_permissions: List[str] = Field(
        default_factory=list,
        alias="assignedPermissions"
    )

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }