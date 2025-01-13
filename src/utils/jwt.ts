import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/env';
import { InternalServerErrorException } from './exceptions';
import { logger } from './logger';

export function generateAccessToken(userId: string): string {
  const payload = { id: userId };
  const options = { expiresIn: '1m' };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
}

export function generateRefreshToken(userId: string): string {
  const payload = { id: userId };
  const options = { expiresIn: '7d' };
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
}

export function verifyAccessToken<T>(token: string): T {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as T;
  } catch (error) {
    logger.error(`${error}`)
    throw new InternalServerErrorException('Error verifying access token');
  }
}

export function verifyRefreshToken<T>(token: string): T {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as T;
  } catch (error) {
    logger.error(`${error}`)
    throw new InternalServerErrorException('Error verifying refresh token');
  }
}
