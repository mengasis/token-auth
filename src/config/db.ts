import { JSONFilePreset } from 'lowdb/node';
import type { Token, User } from '../models/user.model';
import type { Low } from 'lowdb';

export interface Data {
  users: User[];
  tokens: Token[];
}

export type Database = Low<Data>

const defaultData: Data = { users: [], tokens: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default db;
