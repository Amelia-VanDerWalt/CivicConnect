import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';
import { openDatabase } from '../src/infrastructure/database.js';
import { hashPassword } from '../src/infrastructure/auth.js';

const dir = mkdtempSync(join(tmpdir(), 'civic-perf-'));
const dbPath = join(dir, 'perf.sqlite');
const password = 'PerfTest-Password-2026!';

const db = openDatabase(dbPath);
const hash = await hashPassword(password);
db.prepare("INSERT INTO users(id,username,name,password_hash,role) VALUES(1,'requester','Perf Requester',?,'Requester'),(3,'staff','Perf Staff',?,'Staff')").run(hash, hash);
db.exec("INSERT INTO categories VALUES(1,'Facilities',1),(2,'IT support',1); INSERT INTO staff_categories VALUES(3,1),(3,2);");

const insertReq = db.prepare("INSERT INTO requests(reference,requester_id,category_id,category_label,title,description,location,status,priority,created_at) VALUES(?,1,1,'Facilities',?,?,?,'Received','Normal',?)");
db.exec('BEGIN IMMEDIATE');
for (let i = 1; i <= 200; i++) {
  insertReq.run(`CC-PERF-${i}`, `Performance test issue ${i}`, 'Seeded request for queue load check', 'Block A', new Date().toISOString());
}
db.exec('COMMIT');
db.close();

const child = spawn(process.execPath, ['src/server.js'], {
  cwd: join(import.meta.dirname, '..'),
  env: { ...process.env, DB_PATH: dbPath, HOST: '127.0.0.1', PORT: '0', APP_ORIGIN: 'http://127.0.0.1:3999', COOKIE_SECURE: 'false' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let origin;

function percentile(sorted, p) {
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx].toFixed(2);
}

try {
  origin = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Server startup timeout'));
    }, 5000);

    child.stdout.on('data', chunk => {
      const match = chunk.toString().match(/http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[0]);
      }
    });

    child.once('error', err => {
      clearTimeout(timer);
      reject(err);
    });

    child.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Perf server exited prematurely with code ${code}`));
    });
  });

  const suiteStart = performance.now();

  const reqLogin = await fetch(`${origin}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3999' },
    body: JSON.stringify({ username: 'requester', password })
  });
  const reqCookie = reqLogin.headers.get('set-cookie').split(';')[0];
  const reqSession = await reqLogin.json();

  const staffLogin = await fetch(`${origin}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3999' },
    body: JSON.stringify({ username: 'staff', password })
  });
  const staffCookie = staffLogin.headers.get('set-cookie').split(';')[0];

  // Workload Part A: 10 Write operations (POST /api/requests)
  const writeTimes = [];
  let writeFailures = 0;
  for (let i = 1; i <= 10; i++) {
    const t0 = performance.now();
    const res = await fetch(`${origin}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:3999', Cookie: reqCookie, 'X-CSRF-Token': reqSession.csrf },
      body: JSON.stringify({ title: `Live write ${i}`, description: 'Write latency check', category_id: 1, location: 'Hallway' })
    });
    await res.json();
    writeTimes.push(performance.now() - t0);
    if (res.status !== 201) writeFailures++;
  }

  // Workload Part B: 50 Read/Filter operations (GET /api/requests?status=Received&q=issue)
  const readTimes = [];
  let readFailures = 0;
  for (let i = 1; i <= 50; i++) {
    const t0 = performance.now();
    const res = await fetch(`${origin}/api/requests?status=Received&q=issue`, { headers: { Cookie: staffCookie } });
    await res.json();
    readTimes.push(performance.now() - t0);
    if (res.status !== 200) readFailures++;
  }

  const totalDurationMs = (performance.now() - suiteStart).toFixed(2);
  readTimes.sort((a, b) => a - b);
  writeTimes.sort((a, b) => a - b);

  const readAvg = (readTimes.reduce((a, b) => a + b, 0) / readTimes.length).toFixed(2);
  const readP95 = percentile(readTimes, 95);
  const readMax = readTimes[readTimes.length - 1].toFixed(2);

  const writeAvg = (writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length).toFixed(2);
  const writeP95 = percentile(writeTimes, 95);
  const writeMax = writeTimes[writeTimes.length - 1].toFixed(2);

  console.log('=== CIVICCONNECT M3 PERFORMANCE TEST RESULTS ===');
  console.log(`Environment       : Node.js ${process.version} (${process.platform}/${process.arch}), SQLite WAL`);
  console.log(`Dataset           : 200 pre-seeded requests + 10 live writes`);
  console.log(`Total Duration    : ${totalDurationMs} ms`);
  console.log(`Reads (50 ops)    : ${50 - readFailures}/50 OK | avg=${readAvg} ms | p95=${readP95} ms | max=${readMax} ms (Target <= 2000 ms)`);
  console.log(`Writes (10 ops)   : ${10 - writeFailures}/10 OK | avg=${writeAvg} ms | p95=${writeP95} ms | max=${writeMax} ms (Target <= 3000 ms)`);

  if (readFailures > 0 || writeFailures > 0 || Number(readP95) > 2000 || Number(writeP95) > 3000) {
    process.exitCode = 1;
  }
} finally {
  if (child.exitCode === null && !child.killed) {
    child.kill();
  }

  setTimeout(() => {
    rmSync(dir, { recursive: true, force: true });
  }, 500);
}