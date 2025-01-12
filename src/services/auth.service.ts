import type { UserRepository } from '../repositories/user.repository';
import { ConflictException } from '../utils/exceptions';
import { hashPassword } from '../utils/hashHelper';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  password: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  register = async (username: string, password: string) => {
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) throw new ConflictException('User already exists');

    const hashedPasswords = await hashPassword(password);

    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPasswords,
    };

    await this.userRepository.createUser(newUser);
  };

  validateAndCreateSession = async (email: string, password: string) => {};

  getUserProfile = async (sessionId: string) => {};
}
