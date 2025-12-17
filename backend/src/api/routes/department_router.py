from datetime import datetime, timezone
import uuid

from fastapi import Request, Form, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.routes.base_router import BaseRouter
from src.core.oauth import oauth
from src.services.department import DepartmentService
from src.models.department import DepartmentRoleEnum
from src.core.config import settings

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
            db: AsyncSession = request.state.db
            if not department_code.isupper() or not department_code.isalnum():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Department code must be uppercase letters and numbers only.",
                )
            new_department = await DepartmentService.create_initial_department_record(
                db=db,
                dept_code=department_code,
                dept_name=department_name,
                role=role,
                image_file=image_file
            )
            redirect_uri = str(request.url_for("google_department_callback"))
            result = await oauth.google.create_authorization_url(redirect_uri)
            authorization_url = result["url"]
            state = result["state"]
            request.session["oauth:google"] = {
                "state": state,
                "redirect_uri": redirect_uri,
            }
            request.session["pending_department_id"] = str(new_department.department_id)
            request.session["last_oauth_attempt"] = datetime.now(timezone.utc).isoformat()
            return JSONResponse({
                "message": "Department created. Proceed to Google authentication.",
                "authorization_url": authorization_url
            })

        @self.router.get("/oauth/callback", name="google_department_callback")
        async def google_auth_callback(request: Request):
            db: AsyncSession = request.state.db
            session = request.session
            url_state = request.query_params.get("state")
            code = request.query_params.get("code")

            stored_oauth = session.get("oauth:google", {})
            stored_state = stored_oauth.get("state")
            stored_redirect = stored_oauth.get("redirect_uri")
            if not url_state or url_state != stored_state:
                raise HTTPException(status_code=400, detail="Session expired or state mismatch.")

            try:
                token = await oauth.google.fetch_access_token(
                    redirect_uri=stored_redirect,
                    code=code,
                    grant_type="authorization_code"
                )
                user_info_resp = await oauth.google.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    token=token
                )
                user_info = user_info_resp.json()
            except Exception as e:
                raise HTTPException(status_code=500, detail="Google authentication failed.")
            department_id_str = session.get("pending_department_id")
            if not department_id_str:
                raise HTTPException(status_code=400, detail="Registration context lost.")
            try:
                department_id = uuid.UUID(department_id_str)
                updated_department = await DepartmentService.update_department_with_google_credentials(
                    db=db,
                    department_id=department_id,
                    user_info=user_info,
                )
                await db.commit()
            except Exception as e:
                await db.rollback()
                print(f"DB UPDATE ERROR: {repr(e)}")
                raise HTTPException(status_code=500, detail="Failed to finalize registration.")

            default_web_destination = f"{settings.CLIENT_WEB_URL}/event"
            final_destination = session.pop("post_login_redirect", default_web_destination)

            session.pop("oauth:google", None)
            session.pop("pending_department_id", None)
            session.pop("last_oauth_attempt", None)
            from urllib.parse import urlencode
            params = urlencode({
                "status": "success",
                "email": updated_department.google_email,
            })
            separator = "&" if "?" in final_destination else "?"
            redirect_url = f"{final_destination}{separator}{params}"
            return RedirectResponse(url=redirect_url, status_code=303)