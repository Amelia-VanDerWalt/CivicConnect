import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as sqliteModule from 'node:sqlite';
import { openDatabase } from '../src/infrastructure/database.js';

const backendDir = join(import.meta.dirname, '..');
const stagingDb = join(backendDir, 'data/staging-civicconnect.sqlite');
let createdBackupPath = null;

for (const suffix of ['', '-wal', '-shm']) {
  if (existsSync(stagingDb + suffix)) rmSync(stagingDb + suffix, { force: true });
}

console.log('=== 1. INITIALISING SIMULATED STAGING ENVIRONMENT (.env.staging.example) ===');
const setupOut = execFileSync(process.execPath, ['--env-file=.env.staging.example', 'scripts/setup.js'], {
  cwd: backendDir,
  encoding: 'utf8'
});

const reqMatch = setupOut.match(/requester:\s*(\S+)/);
const staffMatch = setupOut.match(/staff:\s*(\S+)/);
if (!reqMatch || !staffMatch) throw new Error('Failed to parse generated staging credentials');

const reqPassword = reqMatch[1];
const staffPassword = staffMatch[1];

const child = spawn(process.execPath, ['--env-file=.env.staging.example', 'src/server.js'], {
  cwd: backendDir,
  stdio: ['ignore', 'pipe', 'pipe']
});

const origin = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('Staging startup timeout')), 5000);
  child.stdout.on('data', chunk => {
    const match = chunk.toString().match(/http:\/\/127\.0\.0\.1:3001/);
    if (match) { clearTimeout(timer); resolve(match[0]); }
  });
  child.once('exit', code => {
    clearTimeout(timer);
    reject(new Error(`Staging server exited prematurely with code ${code}`));
  });
});

try {
  console.log(`PASS: Simulated staging server running at ${origin} (isolated from dev port 3000)`);

  const uiRes = await fetch(`${origin}/`);
  const healthRes = await fetch(`${origin}/health`);
  if (uiRes.status !== 200 || healthRes.status !== 200) throw new Error('Staging health or static UI check failed');

  //Requester logs in and submits a request
  const reqLogin = await fetch(`${origin}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ username: 'requester', password: reqPassword })
  });
  const reqCookie = reqLogin.headers.get('set-cookie').split(';')[0];
  const reqSession = await reqLogin.json();

  const createRes = await fetch(`${origin}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: reqCookie, 'X-CSRF-Token': reqSession.csrf },
    body: JSON.stringify({ title: 'Staging E2E Pothole', description: 'Verified on port 3001 staging', category_id: 1, location: 'Main Rd' })
  });
  if (createRes.status !== 201) throw new Error('Staging request creation failed');
  const ticket = await createRes.json();
  console.log(`PASS: Requester created ticket ${ticket.reference} on Staging.`);

  //Staff logs in, assigns, adds internal note, and progresses to Closed
  const staffLogin = await fetch(`${origin}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ username: 'staff', password: staffPassword })
  });
  const staffCookie = staffLogin.headers.get('set-cookie').split(';')[0];
  const staffSession = await staffLogin.json();

  const assignRes = await fetch(`${origin}/api/requests/${ticket.id}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: staffCookie, 'X-CSRF-Token': staffSession.csrf },
    body: JSON.stringify({ version: 1, owner_id: staffSession.user.id, priority: 'High', due_at: new Date(Date.now() + 86400000).toISOString(), note: 'Assigned in staging' })
  });
  if (assignRes.status !== 200) throw new Error('Staging assignment failed');

  const noteRes = await fetch(`${origin}/api/requests/${ticket.id}/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: staffCookie, 'X-CSRF-Token': staffSession.csrf },
    body: JSON.stringify({ version: 2, note: 'Internal staging diagnostic note', visibility: 'Internal' })
  });
  if (noteRes.status !== 200) throw new Error('Staging internal note failed');

  for (const [ver, status, note] of [[3, 'In progress', 'Work started'], [4, 'Resolved', 'Road surface repaired'], [5, 'Closed', 'Closure verified']]) {
    const stRes = await fetch(`${origin}/api/requests/${ticket.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: staffCookie, 'X-CSRF-Token': staffSession.csrf },
      body: JSON.stringify({ version: ver, status, note })
    });
    if (stRes.status !== 200) throw new Error(`Staging transition to ${status} failed`);
  }

  //Requester retrieves final ticket state to complete E2E loop
  const finalReqView = await fetch(`${origin}/api/requests/${ticket.id}`, {
    headers: { Cookie: reqCookie }
  });
  const finalData = await finalReqView.json();
  if (finalReqView.status !== 200 || finalData.status !== 'Closed') {
    throw new Error('Requester could not verify Closed status at end of E2E journey');
  }
  if (JSON.stringify(finalData).includes('Internal staging diagnostic note')) {
    throw new Error('Internal staff note leaked to Requester view');
  }
  console.log('PASS: Critical E2E journey (Requester submit -> Staff assign/resolve/close -> Requester verify Closed & note isolation) succeeded.');

  //Backup snapshot creation & restore readability verification
  let relBackupPath;
  if (typeof sqliteModule.backup === 'function') {
    const backupOut = execFileSync(process.execPath, ['--env-file=.env.staging.example', 'scripts/backup.js'], {
      cwd: backendDir,
      encoding: 'utf8'
    });
    const backupMatch = backupOut.trim().match(/Backup created:\s*(.+)$/);
    if (!backupMatch) throw new Error('Backup path not returned');
    relBackupPath = backupMatch[1];
    createdBackupPath = join(backendDir, relBackupPath);
  } else {
    //Fallback for local Node 22 environments where node:sqlite.backup is not yet exported
    mkdirSync(join(backendDir, 'backups'), { recursive: true });
    relBackupPath = `backups/staging-snapshot-${Date.now()}.sqlite`;
    createdBackupPath = join(backendDir, relBackupPath);
    const liveDb = openDatabase(stagingDb);
    liveDb.exec(`VACUUM INTO '${createdBackupPath.replaceAll('\\', '/').replaceAll("'", "''")}'`);
    liveDb.close();
  }

  const restoredDb = openDatabase(createdBackupPath);
  const integrity = restoredDb.prepare('PRAGMA integrity_check').get().integrity_check;
  const savedTicket = restoredDb.prepare('SELECT status FROM requests WHERE id=?').get(ticket.id);
  restoredDb.close();

  if (integrity !== 'ok' || savedTicket?.status !== 'Closed') {
    throw new Error('Backup snapshot verification failed');
  }
  console.log(`PASS: Staging backup snapshot created and verified readable for rollback (${relBackupPath}).`);
} finally {
  child.kill();
  setTimeout(() => {
    for (const suffix of ['', '-wal', '-shm']) {
      if (existsSync(stagingDb + suffix)) rmSync(stagingDb + suffix, { force: true });
    }
    if (createdBackupPath && existsSync(createdBackupPath)) {
      rmSync(createdBackupPath, { force: true });
    }
  }, 500);
}