import type { Database } from '../config/db';
import type { Token } from '../models/token.model';

export class TokenRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(token: Token): Promise<void> {
    this.db.data.tokens.push(token);
    await this.db.write();
  }

  async findByRefreshToken(refreshToken: string): Promise<Token | undefined> {
    return this.db.data.tokens.find(
      (token) => token.refreshToken === refreshToken,
    );
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    this.db.data.tokens = this.db.data.tokens.filter(
      (token) => token.refreshToken !== refreshToken,
    );
    await this.db.write();
  }
}
