import type { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {

  };
}
