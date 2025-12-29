from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class DepartmentStudentSyncSchema(BaseModel):
    departmentName: str
    departmentCode: str

class ProgramStudentSyncSchema(BaseModel):
    programName: str

class StudentSyncSchema(BaseModel):
    studentId: str
    studentSchoolId: str
    firstName: str
    lastName: str
    studentImage: Optional[str] = None

    departmentId: str

    programId: str

    department: DepartmentStudentSyncSchema
    program: ProgramStudentSyncSchema

    studentCreatedAt: datetime
    studentUpdatedAt: datetime
