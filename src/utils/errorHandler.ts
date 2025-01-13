import type { Request, Response, NextFunction } from 'express';
import { BaseException } from './exceptions';
import { logger } from './logger';

export function errorHandler(
  err: unknown,
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof BaseException) {
    const response: Record<string, unknown> = {
      error: err.message,
    };

    if (typeof err.data === 'object' && err.data !== null) {
      response.data = err.data;
    }

    res.status(err.statusCode).json(response);
  } else {
    logger.error(`${err}`);
    res.status(500).json({ error: 'Internal server error' });
  }
}
