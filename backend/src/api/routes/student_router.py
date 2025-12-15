from fastapi import Request
from src.api.routes.base_router import BaseRouter
from sqlalchemy.ext.asyncio import AsyncSession
from src.core.database import get_db

class StudentRouter(BaseRouter):
    prefix = '/student'
    tags = ['Student']

    def _register_routes(self):
        @self.router.post("/")
        async def create_student(payload: dict, request: Request):
            db: AsyncSession = request.state.db
            # db is already in context
            return {"ok": True}
