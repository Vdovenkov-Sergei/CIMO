from fastapi import HTTPException, status


class ApiException(HTTPException):
    status_code: int = status.HTTP_400_BAD_REQUEST
    error_message: str = ""

    def __init__(self, **kwargs: str | int):
        if "detail" in kwargs:
            raise RuntimeError("Detail is not allowed")
        message = self.error_message.format(**kwargs)
        super().__init__(status_code=self.status_code, detail=message)


class IncorrectEmailOrPasswordException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Incorrect email or password"


class IncorrectUsernameOrPasswordException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Incorrect username or password"


class TokenNotFoundException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Access token not found"


class IncorrectTokenFormatException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Incorrect token format"


class TokenExpiredException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
    error_message: str = "Access token expired"


class UserIsNotPresentException(ApiException):
    status_code: int = status.HTTP_401_UNAUTHORIZED
