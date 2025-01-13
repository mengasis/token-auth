import type { Database } from '../config/db';
import type { User } from '../models/user.model';

export class UserRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async createUser(user: User): Promise<void> {
    this.db.data.users.push(user);
    await this.db.write();
  }

  async findByUsername(username: string) {
    return this.db.data.users?.find((user) => user.username === username);
  }

  async findById(userId: string) {
    return this.db.data.users.find((user) => user.id === userId);
  }
}
