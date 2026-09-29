import { randomBytes, scrypt as derive, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { fail } from '../domain/policy.js';
const scrypt=promisify(derive);
export const digest=token=>createHash('sha256').update(token).digest('hex');
export async function hashPassword(password) {
  const salt=randomBytes(16).toString('hex');
  const key=await scrypt(password,salt,64,{N:131072,r:8,p:1,maxmem:256*1024*1024});
  return `${salt}:${key.toString('hex')}`;
}
const dummyHash=await hashPassword(randomBytes(32).toString('hex'));
export async function verifyPassword(password,stored) {
  const [salt,hex]=stored.split(':');
  const key=await scrypt(password,salt,64,{N:131072,r:8,p:1,maxmem:256*1024*1024});
  return timingSafeEqual(key,Buffer.from(hex,'hex'));
}
export class Auth {
  constructor(db) { this.db=db; this.attempts=new Map(); }
  async login(username,password,ip) {
    fail(typeof username==='string' && username.length<=100 && typeof password==='string' && password.length<=256,400,'Invalid login input');
    const now=Date.now();
    for(const [k,v] of this.attempts) if(v.until<=now) this.attempts.delete(k);
    const keys=[`ip:${ip}`,`user:${username.toLowerCase()}`];
    for(const key of keys) { const entry=this.attempts.get(key)||{count:0,until:now+60000}; fail(entry.count<10,429,'Too many login attempts. Wait one minute.'); entry.count++; this.attempts.set(key,entry); }
    const user=this.db.prepare('SELECT * FROM users WHERE username=? AND active=1').get(username.toLowerCase());
    const valid=await verifyPassword(password,user?.password_hash??dummyHash);
    fail(user&&valid,401,'Invalid username or password');
    this.db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(now);
    const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
    this.db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(digest(token),user.id,csrf,now+8*3600000);
    return {token,csrf,user:{id:user.id,name:user.name,role:user.role}};
  }
  session(token) {
    fail(typeof token==='string' && /^[a-f0-9]{64}$/.test(token),401,'Sign in required');
    const row=this.db.prepare('SELECT u.id,u.name,u.role,s.csrf FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').get(digest(token),Date.now());
    fail(row,401,'Sign in required'); return row;
  }
  logout(token) { this.db.prepare('DELETE FROM sessions WHERE token_hash=?').run(digest(token)); }
}
