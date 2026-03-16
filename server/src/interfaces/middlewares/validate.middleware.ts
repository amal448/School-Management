import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, part: RequestPart = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[part] = schema.parse(req[part]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }
      next(err);
    }
  };