from datetime import timedelta

from fastapi import HTTPException
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.middleware import Middleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.constants import Tokens
from app.logger import logger
from app.users.auth import authenticate_superuser, create_jwt_token
from app.users.dependencies import get_current_user


class AdminAuth(AuthenticationBackend):
    def __init__(self):
        super().__init__(secret_key=settings.SECRET_KEY)

        self.middlewares = [
            Middleware(
                SessionMiddleware,
                secret_key=settings.SECRET_KEY,
                session_cookie=Tokens.ADMIN_SESSION,
                https_only=settings.MODE == "PROD",
                same_site="none" if settings.MODE == "PROD" else "lax",
            )
        ]
    
    async def login(self, request: Request) -> bool:
        form = await request.form()
        login, password = form.get("username"), form.get("password")

        try:
            user = await authenticate_superuser(login, password)  # type: ignore
        except HTTPException:
            return False
        token = create_jwt_token({"sub": str(user.id)}, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
        request.session.update({Tokens.ADMIN_SESSION: token})
        logger.info(f"Admin logged in", extra={"user_id": user.id, "username": user.user_name})
        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        logger.info("Admin logged out.")
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get(Tokens.ADMIN_SESSION)
        if not token:
            return False
        logger.warning("Admin authentication attempt", extra={"token": token})
        try:
            await get_current_user(token)
            return True
        except HTTPException:
            return False


auth_backend = AdminAuth()
