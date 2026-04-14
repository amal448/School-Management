// src/interfaces/middlewares/error-handler.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { AppError }   from 'src/shared/types/app-error'
import { HttpStatus } from 'src/shared/enums/http-status.enum'
import { ZodError }   from 'zod'

export function errorHandler(
  err:  unknown,
  req:  Request,
  res:  Response,
  next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field:   e.path.join('.'),
      message: e.message,
    }))
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success:   false,
      message:   err.message,
      errorType: err.errorType,
    })
    return
  }

  console.error('Unhandled error:', err)
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred',
  })
}