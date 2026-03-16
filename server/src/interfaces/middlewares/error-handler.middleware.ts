import { AppError } from 'src/shared/types/app-error';
import { ILogger } from '../../application/ports/services/index';
import { Request,Response,NextFunction } from 'express';

export const createErrorHandler =
  (logger: ILogger) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError && err.isOperational) {
      logger.warn('Operational error', { errorCode: err.errorCode, message: err.message, path: req.path });
      res.status(err.statusCode).json({ success: false, errorCode: err.errorCode, message: err.message });
      return;
    }

    logger.error('Unhandled error', { name: err.name, message: err.message, stack: err.stack, path: req.path });
    res.status(500).json({
      success: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    });
  };
