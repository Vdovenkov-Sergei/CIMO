export const errorMessages = {
  INCORRECT_LOGIN_OR_PASSWORD: "Некорректный логин или пароль.",
  // TOKEN_NOT_FOUND: "",
  // INCORRECT_TOKEN_FORMAT: "",
  // TOKEN_EXPIRED: "",
  // USER_IS_NOT_PRESENT: "",

  EMAIL_ALREADY_EXISTS: "Пользователь с таким email уже зарегистрирован.",
  USERNAME_ALREADY_EXISTS: "Никнейм уже занят.",
  USER_NOT_FOUND: "Пользователя с таким email не существует.", // 404 not found page
  INVALID_VERIFICATION_CODE: "Неверный код подтверждения.",
  VERIFICATION_CODE_EXPIRED: "Срок действия кода истёк. Запросите новый.",
  MAX_ATTEMPTS_ENTER_CODE: "Превышено число попыток. Запросите новый код.",
  MAX_ATTEMPTS_SEND_CODE: "Попробуйте позже или начните регистрацию заново.",
  MAX_TIME_VERIFY_EMAIL: "Попробуйте позже или начните регистрацию заново.",

  // PERSON_NOT_FOUND: "",
  // MOVIE_NOT_FOUND: "",
  // SESSION_NOT_FOUND: "", // 404 not found page
  // USER_ALREADY_IN_SESSION: "", // 400 Bad request
  // MAX_PARTICIPANTS_IN_SESSION: "", // 403 forbidden page
  // PARTICIPANTS_NOT_ENOUGH: "",
  // USER_NOT_IN_SESSION: "", // 403 forbidden page

  // CHAT_NOT_FOUND: "",
  // CHAT_ALREADY_EXISTS: "",

  // INVALID_SESSION_STATUS: "", // 403 forbidden page
  // NOT_SUPERUSER: "",
  MAX_TIME_VERIFY_PASSWORD: "Срок действия ссылки истёк. Попробуйте заново.",
  // SESSION_ALREADY_STARTED: "", // 403 forbidden page
  // ACTIVE_SESSION_NOT_FOUND: ""
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends Error {
  constructor(message = 'Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network Error') {
    super(message);
    this.name = 'NetworkError';
  }
}  