from sqlalchemy.ext.asyncio import AsyncSession

from src.models.student_model import Student


class StudentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, student: Student):
        self.db.add(student)
        return student