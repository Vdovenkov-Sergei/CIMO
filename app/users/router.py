from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Cookie, Depends, Response

from app.config import settings
from app.users.auth import authenticate_user, check_jwt_token, create_jwt_token
from app.users.dependencies import get_current_user
from app.users.models import User

from app.users.schemas import SUserAuth


router_auth = APIRouter(prefix="/auth", tags=["Authentication"])
router_user = APIRouter(prefix="/users", tags=["User"])


@router_auth.post("/login")
async def login_user(response: Response, user_data: SUserAuth) -> dict[str, str]:
    user = await authenticate_user(user_data.login, user_data.password)
    access_token = create_jwt_token({"sub": str(user.id)}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_jwt_token({"sub": str(user.id)}, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    response.set_cookie("access_token", access_token, httponly=True)
    response.set_cookie("refresh_token", refresh_token, httponly=True)

    return {"message": "Login successful"}


@router_auth.post("/refresh")
async def refresh_token(response: Response, refresh_token: str = Cookie(None)) -> dict[str, str]:
    payload = check_jwt_token(refresh_token)
    user_id = payload.get("sub")
    access_token = create_jwt_token({"sub": user_id}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie("access_token", access_token, httponly=True)
    return {"message": "Access token refreshed"}


@router_auth.post("/logout")
async def logout_user(response: Response) -> dict[str, str]:
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router_user.get("/me")
async def read_users_me(user: User = Depends(get_current_user)) -> dict[str, Optional[str | int]]:
    return {"id": user.id, "email": user.email, "username": user.username}
