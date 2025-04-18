from fastapi import HTTPException, status


class ApiException(HTTPException):
    status_code: int = status.HTTP_400_BAD_REQUEST
    error_message: str = ""

    def __init__(self, **kwargs: str | int):
        if "detail" in kwargs:
            raise RuntimeError("Detail is not allowed")
        message = self.error_message.format(**kwargs)
        super().__init__(status_code=self.status_code, detail=message)


class IncorrectLoginOrPasswordException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Incorrect login or password"


class TokenNotFoundException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Token not found"


class IncorrectTokenFormatException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Incorrect token format"


class TokenExpiredException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Token expired"


class UserIsNotPresentException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "User is not present"


class EmailAlreadyExistsException(ApiException):
    status_code: int = status.HTTP_409_CONFLICT
    error_message: str = "User with email='{email}' already exists or pending verification"


class UsernameAlreadyExistsException(ApiException):
    status_code: int = status.HTTP_409_CONFLICT
    error_message: str = "User with username='{user_name}' already exists"


class UserNotFoundException(ApiException):
    status_code: int = status.HTTP_404_NOT_FOUND
    error_message: str = "User not found"


class InvalidVerificationCodeException(ApiException):
    error_message: str = "Invalid verification code"


class VerificationCodeExpiredException(ApiException):
    status_code: int = status.HTTP_410_GONE
    error_message: str = "Verification code expired"


class MaxAttemptsEnterCodeException(ApiException):
    status_code: int = status.HTTP_429_TOO_MANY_REQUESTS
    error_message: str = "Max attempts to enter code exceeded"


class MaxAttemptsSendCodeException(ApiException):
    status_code: int = status.HTTP_429_TOO_MANY_REQUESTS
    error_message: str = "Max attempts to send code exceeded"


class MaxTimeVerifyEmailException(ApiException):
    status_code: int = status.HTTP_403_FORBIDDEN
    error_message: str = "Max time to verify email exceeded"
