from fastapi import HTTPException, status


class ApiException(HTTPException):
    status_code: int = status.HTTP_400_BAD_REQUEST
    error_code: str = "UNKNOWN_ERROR"
    error_message: str = ""

    def __init__(self, **kwargs: str | int):
        if "detail" in kwargs:
            raise RuntimeError("Detail is not allowed")
        message = self.error_message.format(**kwargs)
        detail = {
            "message": message,
            "error_code": self.error_code,
            "params": kwargs
        }
        super().__init__(status_code=self.status_code, detail=detail)


class IncorrectLoginOrPasswordException(ApiException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "INCORRECT_LOGIN_OR_PASSWORD"
    error_message = "Incorrect login or password"


class TokenNotFoundException(ApiException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "TOKEN_NOT_FOUND"
    error_message = "Token not found"


class IncorrectTokenFormatException(ApiException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "INCORRECT_TOKEN_FORMAT"
    error_message = "Incorrect token format"


class TokenExpiredException(ApiException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "TOKEN_EXPIRED"
    error_message = "Token expired"


class UserIsNotPresentException(ApiException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "USER_NOT_PRESENT"
    error_message = "User is not present"


class EmailAlreadyExistsException(ApiException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "EMAIL_ALREADY_EXISTS"
    error_message = "User with email='{email}' already exists or pending verification"


class UsernameAlreadyExistsException(ApiException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "USERNAME_ALREADY_EXISTS"
    error_message = "User with username='{user_name}' already exists"


class UserNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "USER_NOT_FOUND"
    error_message = "User not found"


class InvalidVerificationCodeException(ApiException):
    error_code = "INVALID_VERIFICATION_CODE"
    error_message = "Invalid verification code"


class VerificationCodeExpiredException(ApiException):
    status_code = status.HTTP_410_GONE
    error_code = "VERIFICATION_CODE_EXPIRED"
    error_message = "Verification code expired"


class MaxAttemptsEnterCodeException(ApiException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "MAX_ATTEMPTS_ENTER_CODE"
    error_message = "Max attempts to enter code exceeded"


class MaxAttemptsSendCodeException(ApiException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "MAX_ATTEMPTS_SEND_CODE"
    error_message = "Max attempts to send code exceeded"


class MaxTimeVerifyEmailException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "MAX_TIME_VERIFY_EMAIL"
    error_message = "Max time to verify email exceeded"


class PersonNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "PERSON_NOT_FOUND"
    error_message = "Person with id={person_id} not found"


class MovieNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "MOVIE_NOT_FOUND"
    error_message = "Movie with id={movie_id} not found"


class SessionNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "SESSION_NOT_FOUND"
    error_message = "Session with id={session_id} not found"


class UserAlreadyInSessionException(ApiException):
    error_code = "USER_ALREADY_IN_SESSION"
    error_message = "User with id={user_id} already in session with id={session_id}"


class MaxParticipantsInSessionException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "MAX_PARTICIPANTS_IN_SESSION"
    error_message = "Max participants in session exceeded"


class ParticipantsNotEnoughException(ApiException):
    error_code = "PARTICIPANTS_NOT_ENOUGH"
    error_message = "Participants not enough"


class UserNotInSessionException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "USER_NOT_IN_SESSION"
    error_message = "User with id={user_id} not in session"


class ChatNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "CHAT_NOT_FOUND"
    error_message = "User doesn`t have a chat"


class ChatAlreadyExistsException(ApiException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CHAT_ALREADY_EXISTS"
    error_message = "Chat with id={chat_id} already exists"


class InvalidSessionStatusException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "INVALID_SESSION_STATUS"
    error_message = "Invalid session status {status}"


class NotSuperUserException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "NOT_SUPERUSER"
    error_message = "Superuser privileges are required."


class MaxTimeVerifyPasswordException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "MAX_TIME_VERIFY_PASSWORD"
    error_message = "Max time to verify password exceeded"


class SessionAlreadyStartedException(ApiException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "SESSION_ALREADY_STARTED"
    error_message = "Session with id={session_id} already started"


class ActiveSessionNotFoundException(ApiException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "ACTIVE_SESSION_NOT_FOUND"
    error_message = "Active session not found for user with id={user_id}"
