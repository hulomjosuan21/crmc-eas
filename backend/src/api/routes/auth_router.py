from fastapi import Request, Form, UploadFile, File
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
import uuid

from src.api.routes.base_router import BaseRouter
from src.services.department_service import DepartmentService
from src.services.officer_service import OfficerService
from src.schemas.officer_schema import CreateOfficerSchema
from src.models.department_model import DepartmentRoleEnum
from src.core.oauth import oauth
from src.core.config import settings
from src.core.response import BaseResponse
from src.core.exceptions import BadRequestError


class AuthRouter(BaseRouter):
    prefix = "/auth"
    tags = ["Authentication"]

    @staticmethod
    async def _init_google_auth(request: Request, entity_type: str, entity_id: uuid.UUID) -> BaseResponse:
        redirect_uri = str(request.url_for(f"google_auth_{entity_type}_callback"))
        auth_result = await oauth.google.create_authorization_url(redirect_uri)
        request.session["oauth:google"] = {"state": auth_result["state"], "redirect_uri": redirect_uri}
        request.session[f"pending_{entity_type}_id"] = str(entity_id)
        return BaseResponse({
            "message": f"{entity_type.capitalize()} created. Proceed to Google authentication.",
            "authorization_url": auth_result["url"]
        })

    @staticmethod
    async def _handle_google_callback(request: Request, service, entity_type: str, default_redirect: str) -> RedirectResponse:
        session = request.session
        entity_id_str = session.get(f"pending_{entity_type}_id")
        if not entity_id_str:
            raise BadRequestError(detail="Registration context lost.")
        entity_id = uuid.UUID(entity_id_str)
        stored_oauth = session.get("oauth:google", {})

        try:
            if request.query_params.get("state") != stored_oauth.get("state"):
                raise BadRequestError(detail="Session expired or state mismatch.")

            token = await oauth.google.fetch_access_token(
                redirect_uri=stored_oauth.get("redirect_uri"),
                code=request.query_params.get("code"),
                grant_type="authorization_code"
            )
            oauth_user = await oauth.google.userinfo(token=token)

            updated_entity = await service.bind_google_credentials(entity_id, oauth_user)

            destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/{default_redirect}")
            params = urlencode({"status": "success", "email": updated_entity.oauth_email})
            separator = "&" if "?" in destination else "?"
            return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
        except Exception:
            await service.delete_pending(entity_id)
            destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/event")
            params = urlencode({"status": "error", "detail": "Authentication failed"})
            separator = "&" if "?" in destination else "?"
            return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
        finally:
            session.pop("oauth:google", None)
            session.pop(f"pending_{entity_type}_id", None)

    def _register_routes(self):
        @self.router.post("/department/signup", name="signup_department")
        async def signup_department(
            request: Request,
            department_code: str = Form(..., alias="departmentCode", max_length=20),
            department_name: str = Form(..., alias="departmentName", max_length=250),
            role: DepartmentRoleEnum = Form(DepartmentRoleEnum.DEPARTMENT, alias="role"),
            image_file: UploadFile = File(..., alias="imageFile"),
        ):
            db = request.state.db
            service = DepartmentService(db)

            try:
                dept = await service.register_initial_department(
                    code=department_code, name=department_name, role=role, image_file=image_file
                )
                await db.commit()
                return await self._init_google_auth(request, "department", dept.department_id)
            except:
                await db.rollback()
                raise

        @self.router.get("/department/oauth/callback", name="google_auth_department_callback")
        async def google_auth_department_callback(request: Request):
            service = DepartmentService(request.state.db)
            return await self._handle_google_callback(request, service, "department", "event")

        @self.router.post("/officer/signup", name="signup_officer")
        async def signup_officer(payload: CreateOfficerSchema, request: Request):
            db = request.state.db
            service = OfficerService(db)
            try:
                officer = await service.register_initial_officer(payload)
                await db.commit()
                return await self._init_google_auth(request, "officer", officer.officer_id)
            except:
                await db.rollback()
                raise

        @self.router.get("/officer/oauth/callback", name="google_auth_officer_callback")
        async def google_auth_officer_callback(request: Request):
            service = OfficerService(request.state.db)
            return await self._handle_google_callback(request, service, "officer", "event")
