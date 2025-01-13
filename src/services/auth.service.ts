import type { TokenRepository } from '../repositories/token.repository';
import type { UserRepository } from '../repositories/user.repository';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/exceptions';
import { comparePassword, hashPassword } from '../utils/hashHelper';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import type { Token } from '../models/user.model';

export class AuthService {
  private userRepository: UserRepository;
  private tokenRepository: TokenRepository;

  constructor(
    userRepository: UserRepository,
    tokenRepository: TokenRepository,
  ) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  register = async (username: string, password: string) => {
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      logger.warn('Attempt to register an existing user', { username });
      throw new ConflictException('User already exists');
    }

    const hashedPasswords = await hashPassword(password);

    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPasswords,
    };

    await this.userRepository.createUser(newUser);
    logger.info('User registered successfully', { username });
  };

  authenticate = async (
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      logger.warn('User not found', { username });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassValid = await comparePassword(password, user.password);

    if (!isPassValid) {
      logger.warn('Password mismatch', { username });
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const token: Token = {
      id: uuidv4(),
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    await this.tokenRepository.create(token);
    logger.info('User logged in', { username });

    return { accessToken, refreshToken };
  };

  async rotateToken(refreshToken: string): Promise<{ accessToken: string }> {
    verifyRefreshToken<{ id: string }>(refreshToken);

    const token = await this.validateRefreshToken(refreshToken);
    const accessToken = generateAccessToken(token.userId);
    logger.info('Access decoded refreshed', { userId: token.userId });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    verifyRefreshToken<{ id: string }>(refreshToken);

    const token = await this.validateRefreshToken(refreshToken);
    await this.tokenRepository.deleteByRefreshToken(token.refreshToken);
    logger.info('User logged out', { refreshToken });
  }

  private async validateRefreshToken(refreshToken: string): Promise<Token> {
    const token = await this.tokenRepository.findByRefreshToken(refreshToken);

    if (!token) {
      logger.warn('Invalid refresh token', { refreshToken });
      throw new UnauthorizedException('Invalid token');
    }

    const isExpired = new Date(token.expiresAt) < new Date();
    if (isExpired) {
      logger.warn('Expired refresh token', { refreshToken });
      throw new UnauthorizedException('Invalid token');
    }

    return token;
  }

  getUserProfile = async (userId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      logger.warn('User not found', { userId });
      throw new NotFoundException('User not found');
    }

    return user;
  };
}
