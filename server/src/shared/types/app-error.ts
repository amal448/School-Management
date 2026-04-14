import { HttpStatus } from 'src/shared/enums/http-status.enum'

export class AppError extends Error {
  constructor(
    public readonly statusCode: HttpStatus,
    message:                    string,
    public readonly errorType?: string,
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }

  static badRequest(message: string): AppError {
    return new AppError(HttpStatus.BAD_REQUEST, message, 'BAD_REQUEST')
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(HttpStatus.UNAUTHORIZED, message, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(HttpStatus.FORBIDDEN, message, 'FORBIDDEN')
  }

  static notFound(message: string): AppError {
    return new AppError(HttpStatus.NOT_FOUND, message, 'NOT_FOUND')
  }

  static conflict(message: string): AppError {
    return new AppError(HttpStatus.CONFLICT, message, 'CONFLICT')
  }

  static unprocessable(message: string): AppError {
    return new AppError(HttpStatus.UNPROCESSABLE_ENTITY, message, 'UNPROCESSABLE_ENTITY')
  }

  static tooManyRequests(message = 'Too many requests'): AppError {
    return new AppError(HttpStatus.TOO_MANY_REQUESTS, message, 'TOO_MANY_REQUESTS')
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(HttpStatus.INTERNAL_SERVER_ERROR, message, 'INTERNAL_SERVER_ERROR')
  }

  static notImplemented(message = 'Not implemented'): AppError {
    return new AppError(HttpStatus.NOT_IMPLEMENTED, message, 'NOT_IMPLEMENTED')
  }
}