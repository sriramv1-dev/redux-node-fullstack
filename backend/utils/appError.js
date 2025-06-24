class AppError extends Error {
  constructor(message, statusCode = 500) {
    this.message = message;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
