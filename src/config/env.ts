import dotenv from 'dotenv';

dotenv.config();

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'prod',
  sameSite:
    process.env.NODE_ENV === 'prod' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
