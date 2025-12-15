from fastapi import APIRouter, Depends
from src.core.database import get_db

class BaseRouter:
    prefix: str = ""
    tags: list[str] = []

    def __init__(self):
        self.router = APIRouter(prefix=self.prefix,tags=self.tags,dependencies=[Depends(get_db)])
        self._register_routes()

    def _register_routes(self):
        raise NotImplementedError

    def get_router(self):
        return self.router

