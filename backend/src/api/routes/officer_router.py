from src.api.routes.base_router import BaseRouter
from src.schemas.officer_schema import CreateOfficer
from src.services.officer_service import OfficerService
from src.core.oauth import oauth
from urllib.parse import urlencode
import uuid
from src.core.config import settings
from src.core.response import BaseResponse
from fastapi import Request
from fastapi.responses import RedirectResponse

class OfficerRouter(BaseRouter):
    prefix = "/officer"
    tags = ["Officer"]

    def _register_routes(self):
        @self.router.post("/signup",name="signup_officer")
        async def signup_officer(payload: CreateOfficer,request: Request):
            db = request.state.db
            service = OfficerService(db)

            try:
                new_officer = await service.register_initial_officer(payload)

                redirect_uri = str(request.url_for("google_auth_officer_callback"))
                auth_result = await oauth.google.create_authorization_url(redirect_uri)

                request.session["oauth:google"] = {
                    "state": auth_result["state"],
                    "redirect_uri": redirect_uri,
                }

                request.session["pending_officer_id"] = str(new_officer.officer_id)

                await db.commit()

                return BaseResponse({
                    "message": "Officer created. Proceed to Google authentication.",
                    "authorization_url": auth_result["url"]
                })
            except Exception as e:
                await db.rollback()
                raise e

        @self.router.get("/oauth/callback", name="google_auth_officer_callback")
        async def google_auth_officer_callback(request: Request):
            db = request.state.db
            session = request.session
            service = OfficerService(db)

            officer_id_str = session.get("pending_officer_id")
            if not officer_id_str:
                raise BadRequestError(detail="Registration context lost.")

            officer_id = uuid.UUID(officer_id_str)

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

                updated_officer = await service.bind_google_credentials(
                    officer_id=officer_id,
                    user_info=user_info
                )

                destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/event")
                params = urlencode({"status": "success", "email": updated_officer.oauth_email})
                separator = "&" if "?" in destination else "?"
                return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
            except:
                await service.delete_pending_officer(officer_id)
                error_msg = "Authentication failed"
                destination = session.pop("post_login_redirect", f"{settings.CLIENT_WEB_URL}/auth/error")
                params = urlencode({"status": "error", "detail": error_msg})
                separator = "&" if "?" in destination else "?"
                return RedirectResponse(url=f"{destination}{separator}{params}", status_code=303)
            finally:
                session.pop("oauth:google", None)
                session.pop("pending_department_id", None)