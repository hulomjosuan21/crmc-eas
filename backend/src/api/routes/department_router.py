import uuid
from urllib.parse import urlencode
from fastapi import Request, Form, UploadFile, File
from fastapi.responses import RedirectResponse
from src.api.routes.base_router import BaseRouter
from src.core.oauth import oauth
from src.services.department_service import DepartmentService
from src.models.department_model import DepartmentRoleEnum
from src.core.config import settings
from src.core.exceptions import DomainException, BadRequestError
from src.core.response import BaseResponse


class DepartmentRouter(BaseRouter):
    prefix = "/department"
    tags = ["Department"]

    def _register_routes(self):
        @self.router.post("/signup", name="signup_department")
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
                new_dept = await service.register_initial_department(
                    code=department_code,
                    name=department_name,
                    role=role,
                    image_file=image_file
                )

                redirect_uri = str(request.url_for("google_auth_department_callback"))
                auth_result = await oauth.google.create_authorization_url(redirect_uri)

                request.session["oauth:google"] = {
                    "state": auth_result["state"],
                    "redirect_uri": redirect_uri,
                }
                request.session["pending_department_id"] = str(new_dept.department_id)

                await db.commit()

                return BaseResponse({
                    "message": "Department created. Proceed to Google authentication.",
                    "authorization_url": auth_result["url"]
                })
            except Exception as e:
                await db.rollback()
                raise e

        @self.router.get("/oauth/callback", name="google_auth_department_callback")
        async def google_auth_department_callback(request: Request):
            db = request.state.db
            session = request.session
            service = DepartmentService(db)

            dept_id_str = session.get("pending_department_id")
            if not dept_id_str:
                raise BadRequestError(detail="Registration context lost.")

            department_id = uuid.UUID(dept_id_str)

            try:
                stored_oauth = session.get("oauth:google", {})
                if request.query_params.get("state") != stored_oauth.get("state"):
                    raise BadRequestError(detail="Session expired or state mismatch.")

                token = await oauth.google.fetch_access_token(
                    redirect_uri=stored_oauth.get("redirect_uri"),
                    code=request.query_params.get("code"),
                    grant_type="authorization_code"
                )
                user_info = await oauth.google.userinfo(token=token)

                updated_dept = await service.bind_google_credentials(
                    department_id=department_id,
                    user_info=user_info
                )

                destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/event")
                params = urlencode({"status": "success", "email": updated_dept.oauth_email})
                separator = "&" if "?" in destination else "?"
                return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
            except Exception:
                await service.delete_pending_department(department_id)
                error_msg = "Authentication failed"
                destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/auth/error")
                params = urlencode({"status": "error", "detail": error_msg})
                separator = "&" if "?" in destination else "?"
                return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
            finally:
                session.pop("oauth:google", None)
                session.pop("pending_department_id", None)


        @self.router.delete("/{department_id}", name="delete_department")
        async def delete_department(
                request: Request,
                department_id: uuid.UUID
        ):

            db = request.state.db
            service = DepartmentService(db)

            try:
                # We delegate the logic to the service
                await service.delete_department(department_id)

                # Commit the transaction to finalize the DB delete and trigger the file deletion event
                await db.commit()

                return BaseResponse({
                    "message": "Department deleted successfully."
                })
            except Exception as e:
                await db.rollback()
                raise e