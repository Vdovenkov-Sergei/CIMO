class URLs:
    BASE_PHOTO_URL: str = "https://avatars.mds.yandex.net/get-kinopoisk-image"
    BASE_POSTER_URL: str = "https://image.openmoviedb.com/kinopoisk-images"


class Pagination:
    PAG_LIMIT: int = 20
    PAG_OFFSET: int = 0


class Validation:
    USERNAME_REGEX: str = r"^[a-zA-Z0-9_.]+$"
    MIN_PASSWORD_LEN: int = 8
    MAX_PASSWORD_LEN: int = 24
    MIN_USERNAME_LEN: int = 5
    MAX_USERNAME_LEN: int = 30


class Verification:
    CODE_LENGTH: int = 6
    MAX_ATTEMPTS_ENTER: int = 5
    MAX_ATTEMPTS_SEND: int = 3
    TIME_PENDING: int = 2 * 60  # 2 minutes
    MAX_TIME_PENDING: int = MAX_ATTEMPTS_SEND * TIME_PENDING + 5
    RESET_TOKEN_LENGTH: int = 16
    RESET_PASSWORD_TIME: int = 30 * 60  # 30 minutes


class Tokens:
    ACCESS_TOKEN: str = "access_token"
    REFRESH_TOKEN: str = "refresh_token"


class RedisKeys:
    USER_EMAIL_KEY: str = "#user_{email}"
    CODE_VERIFY_KEY: str = "#code_verify_{email}"
    ATTEMPTS_ENTER_KEY: str = "#attempts_enter_{email}"
    ATTEMPTS_SEND_KEY: str = "#attempts_send_{email}"
    RESET_TOKEN_KEY: str = "#reset_token_{token}"
    USER_VECTOR_KEY: str = "#user_vector_{user_id}"


class General:
    PAIR: int = 2
    SOLO: int = 1
    EXCEPTIONS: list[str] = ["hashed_password", "description", "content"]
    ROUND: int = 4
    VOWELS: str = "aeiou"
    CVC_MASK: list[bool] = [False, True, False]
    K_NEAREST: int = 10
