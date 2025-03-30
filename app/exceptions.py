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


class EmailAlreadyExistsException(ApiException):
    status_code: int = status.HTTP_409_CONFLICT
    error_message: str = "User with email='{email}' already exists"


class UsernameAlreadyExistsException(ApiException):
    status_code: int = status.HTTP_409_CONFLICT
    error_message: str = "User with username='{user_name}' already exists"


class UserNotFoundException(ApiException):
    status_code: int = status.HTTP_404_NOT_FOUND
    error_message: str = "User not found"
    