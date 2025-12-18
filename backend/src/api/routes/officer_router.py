from src.api.routes.base_router import BaseRouter

class OfficerRouter(BaseRouter):
    prefix = "/officer"
    tags = ["Officer"]

    def _register_routes(self):
        ...