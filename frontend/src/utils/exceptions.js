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