import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import db from '../config/db';
import { UserRepository } from '../repositories/user.repository';
import { TokenRepository } from '../repositories/token.repository';
import { COOKIE_OPTIONS } from '../config/env';
import { UnauthorizedException } from '../utils/exceptions';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(
      new UserRepository(db),
      new TokenRepository(db),
    );
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      await this.authService.register(username, password);
      res.status(201).json({ message: 'User registration successful' });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken } = await this.authService.authenticate(
        username,
        password,
      );

      res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  rotateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      const { accessToken } = await this.authService.rotateToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }

      await this.authService.logout(refreshToken);
      res.clearCookie('refresh_token', COOKIE_OPTIONS);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId as string | undefined;

      if (!userId) {
        throw new UnauthorizedException('Unauthorized: Missing user ID');
      }

      const user = await this.authService.getUserProfile(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
