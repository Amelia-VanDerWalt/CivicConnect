import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
export function openDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=3000; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;');
  const version = db.prepare('PRAGMA user_version').get().user_version;
  if (version === 0) {
    db.exec('BEGIN IMMEDIATE');
    try { db.exec(readFileSync(new URL('../../db/migrations/001_initial.sql', import.meta.url), 'utf8')); db.exec('PRAGMA user_version=1; COMMIT'); }
    catch (e) { db.exec('ROLLBACK'); db.close(); throw e; }
  } else if (version !== 1) { db.close(); throw new Error('Unsupported schema version'); }
  return db;
}
