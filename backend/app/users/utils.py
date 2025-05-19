import random
import string
from datetime import timedelta

from passlib.context import CryptContext
from pydantic import EmailStr

from app.constants import RedisKeys, Verification
from app.database import redis_client
from app.logger import logger
from app.tasks.tasks import send_verification_email


class Hashing:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return cls.pwd_context.hash(password)  # type: ignore

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return cls.pwd_context.verify(plain_password, hashed_password)  # type: ignore


def generate_verification_code() -> str:
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=Verification.CODE_LENGTH)).upper()
    logger.debug("Verification code generated.", extra={"code": code})
    return code


async def send_verification_code(email: EmailStr) -> None:
    code = generate_verification_code()
    attempts_key = RedisKeys.ATTEMPTS_SEND_KEY.format(email=email)
    code_key = RedisKeys.CODE_VERIFY_KEY.format(email=email)

    await redis_client.setex(code_key, timedelta(seconds=Verification.TIME_PENDING), code)
    await redis_client.setex(attempts_key, timedelta(seconds=Verification.TIME_PENDING), 0)
    logger.debug("Verification code saved to Redis.", extra={"email": email, "code": code})
    send_verification_email.delay(email, code)
    logger.info("Verification code email sent (task dispatched).", extra={"email": email})
