import { JSONFilePreset } from 'lowdb/node';
import type { Token, User } from '../models/user.model';
import type { Low } from 'lowdb';

export interface Data {
  users: User[];
  tokens: Token[];
}

export type Database = Low<Data>;

const defaultData: Data = { users: [], tokens: [] };
const db = await JSONFilePreset('db.json', defaultData);

export const initializeDB = async () => {
  try {
    console.log('\x1b[33m%s\x1b[0m', 'Initializing database connection...'); // Amarillo
    await db.read();
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Database file initialized and ready for use.',
    ); // Verde
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Failed to initialize the application:',
      error,
    ); // Rojo
    process.exit(1);
  }
};

export default db;
