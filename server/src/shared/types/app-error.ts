// src/shared/types/app-error.ts
export class AppError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(errorCode: string, message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = 'BAD_REQUEST'): AppError {
    return new AppError(code, message, 400);
  }
  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError('UNAUTHORIZED', message, 401);
  }
  static forbidden(message = 'Forbidden'): AppError {
    return new AppError('FORBIDDEN', message, 403);
  }
  static notFound(message: string): AppError {
    return new AppError('NOT_FOUND', message, 404);
  }
  static conflict(message: string): AppError {
    return new AppError('ALREADY_EXISTS', message, 409);
  }
  static internal(message = 'Internal server error'): AppError {
    return new AppError('INTERNAL_ERROR', message, 500, false);
  }
}
