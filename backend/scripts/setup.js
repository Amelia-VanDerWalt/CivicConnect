import { randomBytes } from 'node:crypto';
import { openDatabase } from '../src/infrastructure/database.js';
import { hashPassword } from '../src/infrastructure/auth.js';
const db=openDatabase(process.env.DB_PATH??'data/civicconnect.sqlite');
if(db.prepare('SELECT count(*) AS n FROM users').get().n) { console.log('Accounts already exist; setup made no changes.'); db.close(); process.exit(0); }
const specs=[['requester','Demo Requester','Requester'],['requester2','Second Requester','Requester'],['staff','Facilities Staff','Staff'],['itstaff','IT Staff','Staff'],['oversight','Service Oversight','Oversight']];
const accounts=[];
for(const [username,name,role] of specs) { const password=randomBytes(18).toString('base64url'); accounts.push({username,name,role,password,hash:await hashPassword(password)}); }
db.exec('BEGIN IMMEDIATE');
try {
 db.prepare('INSERT INTO categories(id,name) VALUES(1,?),(2,?)').run('Facilities','IT support');
 for(const a of accounts) db.prepare('INSERT INTO users(username,name,role,password_hash) VALUES(?,?,?,?)').run(a.username,a.name,a.role,a.hash);
 db.exec("INSERT INTO staff_categories SELECT id,1 FROM users WHERE username='staff'; INSERT INTO staff_categories SELECT id,2 FROM users WHERE username='itstaff'; COMMIT");
} catch(e) { db.exec('ROLLBACK'); throw e; }
console.log('Local demonstration accounts created. Save these passwords privately; they will not be displayed again.');
for(const a of accounts) console.log(`${a.username}: ${a.password}`);
db.close();
