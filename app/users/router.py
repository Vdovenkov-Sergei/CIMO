from datetime import timedelta

from fastapi import APIRouter, Cookie, Depends, Response, HTTPException
from pydantic import EmailStr
from starlette import status

from app.config import settings
from app.database import redis_client
from app.exceptions import (
    EmailAlreadyExistsException,
    MaxAttemptsSendCodeException,
    MaxTimeVerifyEmailException,
    UsernameAlreadyExistsException,
    UserNotFoundException,
)
from app.users.auth import authenticate_user, check_jwt_token, check_verification_code, create_jwt_token
from app.users.dao import UserDAO
from app.users.dependencies import get_current_user
from app.users.models import User
from app.users.schemas import SUserAuth, SUserRegisterEmail, SUserRegisterUsername, SUserVerification, SUserUpdate
from app.users.utils import (
    ACCESS_TOKEN,
    ATTEMPTS_ENTER_KEY,
    ATTEMPTS_SEND_KEY,
    CODE_VERIFY_KEY,
    MAX_ATTEMPTS_SEND,
    MAX_TIME_PENDING_VERIFICATION,
    REFRESH_TOKEN,
    TIME_PENDING_VERIFICATION,
    USER_EMAIL_KEY,
    Hashing,
    send_verification_code,
)

router_auth = APIRouter(prefix="/auth", tags=["Authentication"])
router_user = APIRouter(prefix="/users", tags=["User"])


@router_auth.post("/register/email")
async def register_email(user_data: SUserRegisterEmail) -> dict[str, str]:
    email = user_data.email
    email_key, attempts_key = USER_EMAIL_KEY.format(email=email), ATTEMPTS_SEND_KEY.format(email=email)
    existing_user = await UserDAO.find_one_or_none(filters=[User.email == email]) or await redis_client.get(email_key)
    if existing_user:
        raise EmailAlreadyExistsException(email=email)

    hashed_password = Hashing.get_password_hash(user_data.password)
    await redis_client.setex(email_key, timedelta(seconds=MAX_TIME_PENDING_VERIFICATION), hashed_password)
    await redis_client.setex(attempts_key, timedelta(seconds=MAX_TIME_PENDING_VERIFICATION), 0)
    await send_verification_code(email)

    return {"message": "Verification email sent"}


@router_auth.post("/register/resend")
async def resend_verification_code(email: EmailStr) -> dict[str, str]:
    attempts_key, email_key = ATTEMPTS_SEND_KEY.format(email=email), USER_EMAIL_KEY.format(email=email)
    attempts = await redis_client.get(attempts_key)
    hashed_password = await redis_client.get(email_key)
    if not hashed_password:
        raise MaxTimeVerifyEmailException
    if attempts and int(attempts) >= MAX_ATTEMPTS_SEND:
        await redis_client.delete(email_key)
        raise MaxAttemptsSendCodeException

    ttl_user_email = await redis_client.ttl(email_key)
    ttl_attempts = await redis_client.ttl(attempts_key)
    new_ttl = max(ttl_user_email, ttl_attempts, TIME_PENDING_VERIFICATION)
    await redis_client.setex(email_key, timedelta(seconds=new_ttl), hashed_password)
    await redis_client.setex(attempts_key, timedelta(seconds=new_ttl), int(attempts) + 1)
    await send_verification_code(email)

    return {"message": "New verification code sent"}


@router_auth.post("/register/verify")
async def verify_email(user_data: SUserVerification) -> dict[str, str | int]:
    email = user_data.email
    hashed_password = await redis_client.get(USER_EMAIL_KEY.format(email=email))
    if not hashed_password:
        raise MaxTimeVerifyEmailException
    await check_verification_code(user_data)

    for key in [USER_EMAIL_KEY, CODE_VERIFY_KEY, ATTEMPTS_ENTER_KEY, ATTEMPTS_SEND_KEY]:
        await redis_client.delete(key.format(email=email))
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
    response.set_cookie(ACCESS_TOKEN, access_token, httponly=True)
    response.set_cookie(REFRESH_TOKEN, refresh_token, httponly=True)

    return {"message": "Login successful"}


@router_auth.post("/refresh")
async def refresh_token(
    response: Response, refresh_token: str = Cookie(REFRESH_TOKEN, include_in_schema=False)
) -> dict[str, str]:
    payload = check_jwt_token(refresh_token)
    user_id = payload.get("sub")
    access_token = create_jwt_token({"sub": user_id}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie(ACCESS_TOKEN, access_token, httponly=True)
    return {"message": "Access token refreshed"}


@router_auth.post("/logout")
async def logout_user(response: Response) -> dict[str, str]:
    response.delete_cookie(ACCESS_TOKEN)
    response.delete_cookie(REFRESH_TOKEN)
    return {"message": "Logged out"}


@router_user.get("/me")
async def read_users_me(user: User = Depends(get_current_user)) -> dict[str, str | int]:
    return {"id": user.id, "email": user.email, "user_name": user.user_name}


@router_user.patch("/me")
async def update_user_me(update_data: SUserUpdate, user: User = Depends(get_current_user)) -> dict[str, str]:
    update_fields = {}

    if update_data.email and update_data.email != user.email:
        existing_email = await UserDAO.find_one_or_none(filters=[User.email == update_data.email])
        if existing_email:
            raise EmailAlreadyExistsException(email=update_data.email)
        update_fields["email"] = update_data.email

    if update_data.user_name and update_data.user_name != user.user_name:
        existing_username = await UserDAO.find_one_or_none(filters=[User.user_name == update_data.user_name])
        if existing_username:
            raise UsernameAlreadyExistsException(user_name=update_data.user_name)
        update_fields["user_name"] = update_data.user_name

    await UserDAO.update_record(filters=[User.id == user.id], update_data=update_fields)
    return {"message": "User updated successfully"}
