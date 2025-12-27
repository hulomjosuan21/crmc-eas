from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class ProgramUpdate(BaseModel):
    program_title: Optional[str] = Field(None, validation_alias="programTitle")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )