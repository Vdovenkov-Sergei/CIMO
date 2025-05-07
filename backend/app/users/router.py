import secrets
from datetime import timedelta

from fastapi import APIRouter, Cookie, Depends, Response
from pydantic import EmailStr

from app.config import settings
from app.database import redis_client
from app.exceptions import (
    EmailAlreadyExistsException,
    MaxAttemptsSendCodeException,
    MaxTimeVerifyEmailException,
    TokenNotFoundException,
    UsernameAlreadyExistsException,
    UserNotFoundException,
)
from app.tasks.tasks import send_email_with_reset_link
from app.users.auth import authenticate_user, check_jwt_token, check_verification_code, create_jwt_token
from app.users.dao import UserDAO
from app.users.dependencies import get_current_user
from app.users.models import User
from app.users.schemas import (
    SUserAuth,
    SUserRead,
    SUserRegisterEmail,
    SUserRegisterUsername,
    SUserResetPassword,
    SUserUpdate,
    SUserVerification,
    SUserVerifyPassword,
)
from app.users.utils import (
    ACCESS_TOKEN,
    ATTEMPTS_ENTER_KEY,
    ATTEMPTS_SEND_KEY,
    CODE_VERIFY_KEY,
    MAX_ATTEMPTS_SEND,
    MAX_TIME_PENDING_VERIFICATION,
    REFRESH_TOKEN,
    RESET_PASSWORD_TIME,
    RESET_TOKEN_KEY,
    RESET_TOKEN_LENGTH,
    TIME_PENDING_VERIFICATION,
    USER_EMAIL_KEY,
    Hashing,
    send_verification_code,
)

router_auth = APIRouter(prefix="/auth", tags=["Authentication"])
router_user = APIRouter(prefix="/users", tags=["User"])


@router_auth.post("/register/email", response_model=dict[str, str])
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

    return {"message": "Verification email sent."}


@router_auth.post("/register/resend", response_model=dict[str, str])
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

    return {"message": "New verification code sent."}


@router_auth.post("/register/verify", response_model=dict[str, str | int])
async def verify_email(user_data: SUserVerification) -> dict[str, str | int]:
    email = user_data.email
    hashed_password = await redis_client.get(USER_EMAIL_KEY.format(email=email))
    if not hashed_password:
        raise MaxTimeVerifyEmailException
    await check_verification_code(user_data)

    for key in [USER_EMAIL_KEY, CODE_VERIFY_KEY, ATTEMPTS_ENTER_KEY, ATTEMPTS_SEND_KEY]:
        await redis_client.delete(key.format(email=email))
    user = await UserDAO.add_record(email=email, hashed_password=hashed_password)
    await UserDAO.update_record(filters=[User.id == user.id], update_data={"user_name": f"user_{user.id}"})  # type: ignore

    return {"message": "Email successfully verified and user registered.", "id": user.id}  # type: ignore


@router_auth.post("/register/username", response_model=dict[str, str])
async def register_username(user_data: SUserRegisterUsername) -> dict[str, str]:
    user = await UserDAO.find_one_or_none(filters=[User.id == user_data.user_id])
    if not user:
        raise UserNotFoundException
    existing_user = await UserDAO.find_one_or_none(filters=[User.user_name == user_data.user_name])
    if existing_user:
        raise UsernameAlreadyExistsException(user_name=user_data.user_name)

    await UserDAO.update_record(filters=[User.id == user.id], update_data={"user_name": user_data.user_name})  # type: ignore
    return {"message": "Username successfully set."}


@router_auth.post("/password/forgot", response_model=dict[str, str])
async def forgot_password(user_data: SUserResetPassword) -> dict[str, str]:
    email = user_data.email
    user = await UserDAO.find_one_or_none(filters=[User.email == email])
    if not user:
        raise UserNotFoundException

    reset_token = secrets.token_urlsafe(RESET_TOKEN_LENGTH)
    reset_token_key = RESET_TOKEN_KEY.format(token=reset_token)
    await redis_client.setex(reset_token_key, timedelta(seconds=RESET_PASSWORD_TIME), user.id)  # type: ignore

    reset_link = f"{settings.FRONTEND_URL}/resetPassword?token={reset_token}"
    send_email_with_reset_link.delay(user.email, reset_link)  # type: ignore
    return {"message": "Password reset email sent"}


@router_auth.post("/password/reset", response_model=dict[str, str])
async def reset_password(user_data: SUserVerifyPassword) -> dict[str, str]:
    reset_token_key = RESET_TOKEN_KEY.format(token=user_data.token)
    user_id = await redis_client.get(reset_token_key)
    if not user_id:
        raise TokenNotFoundException

    user = await UserDAO.find_by_id(int(user_id))
    if not user:
        raise UserNotFoundException

    hashed_password = Hashing.get_password_hash(user_data.new_password)
    await UserDAO.update_record(filters=[User.id == user.id], update_data={"hashed_password": hashed_password})  # type: ignore
    await redis_client.delete(RESET_TOKEN_KEY)

    return {"message": "Password successfully reset"}


@router_auth.post("/login", response_model=dict[str, str])
async def login_user(response: Response, user_data: SUserAuth) -> dict[str, str]:
    user = await authenticate_user(user_data.login, user_data.password)
    access_token = create_jwt_token({"sub": str(user.id)}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_jwt_token({"sub": str(user.id)}, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))
    response.set_cookie(ACCESS_TOKEN, access_token, httponly=True)
    response.set_cookie(REFRESH_TOKEN, refresh_token, httponly=True)

    return {"message": "Login successful."}


@router_auth.post("/refresh", response_model=dict[str, str])
async def refresh_token(
    response: Response, refresh_token: str = Cookie(include_in_schema=False, default=None)
) -> dict[str, str]:
    payload = check_jwt_token(refresh_token)
    user_id = payload.get("sub")
    access_token = create_jwt_token({"sub": user_id}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie(ACCESS_TOKEN, access_token, httponly=True)
    return {"message": "Access token refreshed."}


@router_auth.post("/logout", response_model=dict[str, str])
async def logout_user(response: Response) -> dict[str, str]:
    response.delete_cookie(ACCESS_TOKEN)
    response.delete_cookie(REFRESH_TOKEN)
    return {"message": "Logged out."}


@router_user.get("/me", response_model=SUserRead)
async def read_users_me(user: User = Depends(get_current_user)) -> SUserRead:
    return SUserRead.model_validate(user)


@router_user.patch("/me", response_model=dict[str, str])
async def update_users_me(update_data: SUserUpdate, user: User = Depends(get_current_user)) -> dict[str, str]:
    if update_data.user_name == user.user_name:
        raise UsernameAlreadyExistsException(user_name=update_data.user_name)

    existing_username = await UserDAO.find_one_or_none(filters=[User.user_name == update_data.user_name])
    if existing_username:
        raise UsernameAlreadyExistsException(user_name=update_data.user_name)

    await UserDAO.update_record(filters=[User.id == user.id], update_data=update_data.model_dump())
    return {"message": "User updated successfully."}
