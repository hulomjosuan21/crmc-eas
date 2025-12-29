import json
import difflib
from typing import Tuple

import aiofiles
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from src.core.config import STUDENT_SCHOOL_DB
from src.core.exceptions import NotFoundError, BadRequestError, DomainException
from src.models.department_model import Department
from src.models.program_model import Program
from src.models.student_model import Student
from src.repositories.student_repo import StudentRepository
from src.schemas.student_schema import StudentSyncSchema, DepartmentStudentSyncSchema, ProgramStudentSyncSchema


class StudentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = StudentRepository(db)

    async def sync_student_from_school_id(self, student_school_id: str) -> Tuple[StudentSyncSchema, str]:
        # 1. Try to fetch existing student with relations
        student_obj = await self._get_optimized_student(student_school_id)

        if student_obj:
            return self._manual_map(student_obj), "sign-in"

        # 2. If not found, get from JSON
        external_student = await self._get_external_student(student_school_id)
        target_program_name = external_student["program_name"]

        # 3. Fuzzy Match
        stmt = (
            select(Program)
            .where(func.similarity(Program.program_name, target_program_name) > 0.3)
            .order_by(func.similarity(Program.program_name, target_program_name).desc())
            .limit(1)
        )
        result = await self.db.execute(stmt)
        matched_program = result.scalar_one_or_none()

        if not matched_program:
            raise NotFoundError(detail=f"Program '{target_program_name}' not recognized.")

        # 4. Create New
        new_student = Student(
            student_school_id=external_student["student_school_id"],
            first_name=external_student["first_name"],
            last_name=external_student["last_name"],
            program_id=matched_program.program_id,
            department_id=matched_program.department_id,
        )

        try:
            await self.repo.create(new_student)
            await self.db.flush()

            refreshed_obj = await self._get_optimized_student(student_school_id)
            return self._manual_map(refreshed_obj), "sign-up"
        except Exception:
            await self.db.rollback()
            raise BadRequestError(detail="Sync failed.")

    async def _get_optimized_student(self, student_school_id: str) -> Student | None:
        stmt = (
            select(Student)
            .options(
                joinedload(Student.department).load_only(
                    Department.department_name,
                    Department.department_code
                ),
                joinedload(Student.program).load_only(
                    Program.program_name
                )
            )
            .where(Student.student_school_id == student_school_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    def _manual_map(self, student: Student) -> StudentSyncSchema:
        return StudentSyncSchema(
            studentId=str(student.student_id),
            studentSchoolId=student.student_school_id,
            firstName=student.first_name,
            lastName=student.last_name,
            studentImage=student.student_image,
            departmentId=str(student.department_id),
            programId=str(student.program_id),
            department=DepartmentStudentSyncSchema(
                departmentName=str(student.department.department_name),
                departmentCode=str(student.department.department_code)
            ),
            program=ProgramStudentSyncSchema(
                programName=str(student.program.program_name)
            ),
            studentCreatedAt=student.student_created_at,
            studentUpdatedAt=student.student_updated_at
        )

    async def _get_external_student(self, student_school_id: str) -> dict:
        async with aiofiles.open(STUDENT_SCHOOL_DB, mode='r') as f:
            content = await f.read()
            school_data = json.loads(content)
        student = next((s for s in school_data if s["student_school_id"] == student_school_id), None)
        if not student:
            raise NotFoundError(detail="Student not in registry.")
        return student