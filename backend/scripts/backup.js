import { backup } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { openDatabase } from '../src/infrastructure/database.js';
mkdirSync('backups',{recursive:true});
const db=openDatabase(process.env.DB_PATH??'data/civicconnect.sqlite');
const path=`backups/civicconnect-${new Date().toISOString().replaceAll(':','-')}.sqlite`;
try { await backup(db,path); console.log(`Backup created: ${path}`); } finally { db.close(); }
