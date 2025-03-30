import random
import string
from datetime import timedelta

from fastapi import APIRouter, Cookie, Depends, Response

from app.config import settings
from app.database import redis_client
from app.exceptions import (
    EmailAlreadyExistsException,
    ExpiredVerificationCodeException,
    InvalidVerificationCodeException,
    UsernameAlreadyExistsException,
    UserNotFoundException,
)
from app.tasks.tasks import send_verification_email
from app.users.auth import authenticate_user, check_jwt_token, create_jwt_token, get_password_hash
from app.users.dao import UserDAO
from app.users.dependencies import get_current_user
from app.users.models import User
from app.users.schemas import SUserAuth, SUserRegisterEmail, SUserRegisterUsername, SUserVerification

router_auth = APIRouter(prefix="/auth", tags=["Authentication"])
router_user = APIRouter(prefix="/users", tags=["User"])
VERIFICATION_CODE_LENGTH = 6
PENDING_VERIFICATION_MINUTES = 3


@router_auth.post("/register/email")
async def register_email(user_data: SUserRegisterEmail) -> dict[str, str]:
    email = user_data.email
    existing_user = await UserDAO.find_one_or_none(filters=[User.email == email]) or await redis_client.get(
        f"user_email_{email}"
    )
    if existing_user:
        raise EmailAlreadyExistsException(email=email)

    hashed_password = get_password_hash(user_data.password)
    code = ("".join(random.choices(string.ascii_uppercase + string.digits, k=VERIFICATION_CODE_LENGTH))).upper()

    await redis_client.setex(f"user_email_{email}", timedelta(minutes=PENDING_VERIFICATION_MINUTES), hashed_password)
    await redis_client.setex(f"verification_code_{email}", timedelta(minutes=PENDING_VERIFICATION_MINUTES), code)
    send_verification_email.delay(email, code)

    return {"message": "Verification email sent"}


@router_auth.post("/register/verify")
async def verify_email(user_data: SUserVerification) -> dict[str, str | int]:
    email = user_data.email
    stored_code = await redis_client.get(f"verification_code_{email}")
    if not stored_code:
        raise ExpiredVerificationCodeException
    if stored_code != user_data.code:
        raise InvalidVerificationCodeException

    await redis_client.delete(f"verification_code_{email}")
    hashed_password = await redis_client.get(f"user_email_{email}")
    await redis_client.delete(f"user_email_{email}")

    user = await UserDAO.add_record(email=email, hashed_password=hashed_password)
    await UserDAO.update_record(filters=[User.id == user.id], update_data={"user_name": f"user_{user.id}"})

    return {"message": "Email successfully verified and user registered", "id": user.id}


@router_auth.post("/register/username")
async def register_username(user_data: SUserRegisterUsername) -> dict[str, str]:
    user = await UserDAO.find_one_or_none(filters=[User.id == user_data.user_id])
    if not user:
        raise UserNotFoundException
    existing_user = await UserDAO.find_one_or_none(filters=[User.user_name == user_data.user_name])
    if existing_user:
        raise UsernameAlreadyExistsException(user_name=user_data.user_name)

    await UserDAO.update_record(filters=[User.id == user.id], update_data={"user_name": user_data.user_name})
    return {"message": "Username successfully set"}


@router_auth.post("/login")
async def login_user(response: Response, user_data: SUserAuth) -> dict[str, str]:
    user = await authenticate_user(user_data.login, user_data.password)
    access_token = create_jwt_token({"sub": str(user.id)}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_jwt_token({"sub": str(user.id)}, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    response.set_cookie("access_token", access_token, httponly=True)
    response.set_cookie("refresh_token", refresh_token, httponly=True)

    return {"message": "Login successful"}


@router_auth.post("/refresh")
async def refresh_token(
    response: Response, refresh_token: str = Cookie(None, include_in_schema=False)
) -> dict[str, str]:
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
async def read_users_me(user: User = Depends(get_current_user)) -> dict[str, str | int]:
    return {"id": user.id, "email": user.email, "user_name": user.user_name}
