import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '../utils/exceptions';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Access token is missing');
    }

    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const decoded = verifyAccessToken<{ id: string }>(token);
    req.userId = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
};
