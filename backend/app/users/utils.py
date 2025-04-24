import random
import string
from datetime import timedelta

from passlib.context import CryptContext
from pydantic import EmailStr

from app.database import redis_client
from app.tasks.tasks import send_verification_email

VERIFICATION_CODE_LEN = 6
TIME_PENDING_VERIFICATION = 120
MAX_ATTEMPTS_ENTER = 5
MAX_ATTEMPTS_SEND = 3
MAX_TIME_PENDING_VERIFICATION = MAX_ATTEMPTS_SEND * TIME_PENDING_VERIFICATION + 5

ACCESS_TOKEN = "access_token"
REFRESH_TOKEN = "refresh_token"

USER_EMAIL_KEY = "user_{email}"
CODE_VERIFY_KEY = "code_verify_{email}"
ATTEMPTS_ENTER_KEY = "attempts_enter_{email}"
ATTEMPTS_SEND_KEY = "attempts_send_{email}"


class Hashing:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return cls.pwd_context.hash(password)  # type: ignore

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return cls.pwd_context.verify(plain_password, hashed_password)  # type: ignore


def generate_verification_code() -> str:
    code = "".join(random.choices(string.ascii_uppercase + string.digits, k=VERIFICATION_CODE_LEN))
    return code.upper()


async def send_verification_code(email: EmailStr) -> None:
    code = generate_verification_code()
    attempts_key, code_key = ATTEMPTS_SEND_KEY.format(email=email), CODE_VERIFY_KEY.format(email=email)
    await redis_client.setex(code_key, timedelta(seconds=TIME_PENDING_VERIFICATION), code)
    await redis_client.setex(attempts_key, timedelta(seconds=TIME_PENDING_VERIFICATION), 0)
    send_verification_email.delay(email, code)
