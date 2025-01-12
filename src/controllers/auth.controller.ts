import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import db from '../config/db';
import { UserRepository } from '../repositories/user.repository';
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new UserRepository(db));
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

  login = async (req: Request, res: Response, next: NextFunction) => {};

  logout = async (req: Request, res: Response, next: NextFunction) => {};

  getProfile = async (req: Request, res: Response, next: NextFunction) => {};
}
