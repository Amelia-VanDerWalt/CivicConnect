import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes, createHash } from 'node:crypto';
import { mkdtemp, rm, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { DatabaseSync, backup } from 'node:sqlite';

const backend = resolve(process.argv[2] || process.cwd());
const project = resolve(backend, '..');
const { openDatabase } = await import(pathToFileURL(join(backend, 'src/infrastructure/database.js')));
const { hashPassword } = await import(pathToFileURL(join(backend, 'src/infrastructure/auth.js')));
const temporary = await mkdtemp(join(tmpdir(), 'civic-m4-acceptance-'));
const primary = join(temporary, 'primary.sqlite');
const snapshot = join(temporary, 'snapshot.sqlite');
const restored = join(temporary, 'restored.sqlite');
const configuredOrigin = 'http://127.0.0.1:3999';
const children = new Set();
let server;
let origin;
const password = randomBytes(24).toString('base64url');
const report = {
    date: new Date().toISOString(),
    environment: `${process.version} ${process.platform}/${process.arch}`,
    baseCommit: spawnSync('git', ['rev-parse','HEAD'], {cwd:project,encoding:'utf8'}).stdout?.trim() || 'unknown',
    sourceHashes: {}, checks: [],
    boundaries: [
        'Isolated synthetic database and temporary child servers only; demonstration database untouched.',
        'HTTP/API and recovery checks, not browser interaction or representative-user usability.',
        'Forced application-process termination is not a host power-loss or disk-failure test.',
        'Timed restoration uses a fresh local snapshot and the same code/host; no off-site retention, scheduled 24-hour backup operation or disaster-site recovery is established.',
        'No new load, TLS, outage-alert or final release approval evidence is created.'
    ]
};
for (const file of ['src/frontend/index.html','src/frontend/app.js','src/frontend/requester-history.js','src/frontend/staff-workflows.js','backend/src/server.js','backend/src/http/app.js','backend/src/application/request-service.js','backend/src/domain/policy.js','backend/src/infrastructure/request-repository.js','backend/src/infrastructure/database.js','backend/src/infrastructure/auth.js','backend/db/migrations/001_initial.sql']) {
    try { report.sourceHashes[file] = createHash('sha256').update(await readFile(join(project,file))).digest('hex'); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
}
async function check(name, fn) {
    const start = performance.now();
    try {
        const detail = await fn();
        report.checks.push({name,status:'PASS',durationMs:Number((performance.now()-start).toFixed(2)),detail:detail || ''});
        console.log(`PASS: ${name}${detail ? ' — '+detail : ''}`);
    } catch (e) {
        report.checks.push({name,status:'FAIL',durationMs:Number((performance.now()-start).toFixed(2)),detail:e.message});
        throw e;
    }
}
function start(path) {
    return new Promise((resolveStart,reject) => {
        const child = spawn(process.execPath,['src/server.js'],{
            cwd:backend,
            env:{...process.env,DB_PATH:path,HOST:'127.0.0.1',PORT:'0',APP_ORIGIN:configuredOrigin,COOKIE_SECURE:'false'},
            stdio:['ignore','pipe','pipe']
        });
        children.add(child);
        let output = '';
        const timer = setTimeout(()=>reject(new Error('Temporary server startup timed out')),15000);
        child.stdout.on('data',chunk=>{
            output += chunk.toString();
            const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
            if (match) { clearTimeout(timer); resolveStart({child,origin:match[0]}); }
        });
        child.stderr.on('data',()=>{});
        child.once('error',e=>{clearTimeout(timer);reject(e);});
        child.once('close',(code,signal)=>{
            children.delete(child); clearTimeout(timer);
            reject(new Error(`Temporary server exited: ${code ?? signal}`));
        });
    });
}
async function stop(child, force = false) {
    if (!child || child.exitCode !== null || child.signalCode !== null) return;
    await new Promise((resolveStop,reject)=>{
        const timer = setTimeout(()=>{child.kill('SIGKILL');reject(new Error('Temporary server cleanup timed out'));},10000);
        child.once('close',()=>{clearTimeout(timer);resolveStop();});
        child.kill(force ? 'SIGKILL' : 'SIGTERM');
    });
}
async function boot(path) { const started = await start(path); server = started.child; origin = started.origin; }
async function api(path, session, method='GET', body, expected=200) {
    const headers = {Accept:'application/json'};
    if (session) headers.Cookie = session.cookie;
    if (method !== 'GET') {
        headers.Origin = configuredOrigin; headers['Content-Type'] = 'application/json';
        if (session) headers['X-CSRF-Token'] = session.csrf;
    }
    const response = await fetch(origin+path,{method,headers,body:body === undefined ? undefined : JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    const result = await response.json();
    assert.equal(response.status,expected,`${method} ${path}: expected ${expected}, got ${response.status} (${result.error || 'unexpected response'})`);
    return {result,response};
}
async function login(username) {
    const {result,response} = await api('/api/login',null,'POST',{username,password});
    assert(result.csrf && result.user?.id);
    const cookie = response.headers.get('set-cookie')?.split(';')[0];
    assert(cookie); return {cookie,csrf:result.csrf,user:result.user};
}
async function detail(id, who) { return (await api(`/api/requests/${id}`,who)).result; }
async function mutate(r,who,kind,body,expected=200) {
    return (await api(`/api/requests/${r.id}/${kind}`,who,'POST',{version:r.version,...body},expected)).result;
}
function business(path) {
    const db = new DatabaseSync(path,{readOnly:true});
    try {
        assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
        assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
        return {
            users:db.prepare('SELECT id,username,name,password_hash,role,active FROM users ORDER BY id').all(),
            categories:db.prepare('SELECT * FROM categories ORDER BY id').all(),
            scope:db.prepare('SELECT * FROM staff_categories ORDER BY user_id,category_id').all(),
            requests:db.prepare('SELECT * FROM requests ORDER BY id').all(),
            activities:db.prepare('SELECT * FROM activities ORDER BY id').all()
        };
    } finally { db.close(); }
}
try {
    const db = openDatabase(primary);
    try {
        const hash = await hashPassword(password);
        const insert = db.prepare('INSERT INTO users(id,username,name,password_hash,role) VALUES(?,?,?,?,?)');
        for (const [id,name,role] of [[1,'requester','Requester'],[2,'requester2','Requester'],[3,'staff','Staff'],[4,'itstaff','Staff'],[5,'secondstaff','Staff'],[6,'oversight','Oversight']]) insert.run(id,name,`Synthetic ${name}`,hash,role);
        db.exec("INSERT INTO categories VALUES(1,'Facilities',1),(2,'IT support',1); INSERT INTO staff_categories VALUES(3,1),(4,2),(5,1);");
    } finally { db.close(); }
    await boot(primary);
    const requester = await login('requester'), staff = await login('staff'), second = await login('secondstaff');
    const other = await login('requester2'), it = await login('itstaff'), oversight = await login('oversight');
    const create = async title => (await api('/api/requests',requester,'POST',{title,description:'Synthetic M4 verification record',category_id:1},201)).result;
    let r;
    await check('Assignment, eligibility and actual reassignment',async()=>{
        r = await create('M4 isolated reassignment check');
        const before = await detail(r.id,staff);
        await mutate(r,staff,'assign',{owner_id:3,priority:'High',note:'Missing due-time negative check'},400);
        assert.deepEqual(await detail(r.id,staff),before);
        const due_at = new Date(Date.now()+2*86400000).toISOString();
        r = await mutate(r,staff,'assign',{owner_id:3,priority:'High',due_at,note:'Assign to eligible Facilities staff'});
        const assigned = await detail(r.id,staff);
        await mutate(r,staff,'assign',{owner_id:4,priority:'High',due_at,note:'Ineligible owner check'},400);
        assert.deepEqual(await detail(r.id,staff),assigned);
        r = await mutate(r,staff,'assign',{owner_id:5,priority:'High',due_at,note:'Reassigned from staff 3 to staff 5'});
        assert.equal(r.owner_id,5);
        const history = (await detail(r.id,second)).activities;
        const assignment = history.filter(a=>a.kind==='assign').at(-1);
        assert.equal(assignment.old_values.owner_id,3); assert.equal(assignment.new_values.owner_id,5);
        const publicView = await detail(r.id,requester);
        assert(publicView.activities.some(a=>a.note==='Reassigned from staff 3 to staff 5'));
        return 'Owner changed 3 to 5; old/new audit values and requester-visible update verified; invalid assignment made no change.';
    });
    await check('Notes, lifecycle, blank resolution and stale-edit conflict',async()=>{
        const before = await detail(r.id,second);
        await mutate(r,second,'status',{status:'Closed',note:'Invalid jump'},400);
        assert.deepEqual(await detail(r.id,second),before);
        r = await mutate(r,second,'status',{status:'In progress',note:'Inspection started'});
        const stale = {...r};
        r = await mutate(r,second,'note',{visibility:'Internal',note:'M4 INTERNAL synthetic marker'});
        const afterNote = await detail(r.id,second);
        await mutate(stale,second,'note',{visibility:'Public',note:'Stale update'},409);
        assert.deepEqual(await detail(r.id,second),afterNote);
        r = await mutate(r,second,'note',{visibility:'Public',note:'M4 PUBLIC synthetic marker'});
        const visible = await detail(r.id,requester);
        assert(visible.activities.some(a=>a.note==='M4 PUBLIC synthetic marker'));
        assert(!visible.activities.some(a=>a.visibility!=='Public'||a.note==='M4 INTERNAL synthetic marker'||'old_values' in a||'new_values' in a));
        const beforeResolution = await detail(r.id,second);
        await mutate(r,second,'status',{status:'Resolved',note:''},400);
        assert.deepEqual(await detail(r.id,second),beforeResolution);
        r = await mutate(r,second,'status',{status:'Resolved',note:'Synthetic repair completed'});
        r = await mutate(r,second,'status',{status:'Closed',note:'Synthetic work accepted'});
        assert.equal((await detail(r.id,requester)).status,'Closed');
    });
    await check('Rejection reason, cross-account/category isolation and Oversight read-only',async()=>{
        let rejection = await create('M4 isolated rejection check');
        const before = await detail(rejection.id,staff);
        await mutate(rejection,staff,'status',{status:'Rejected',note:'   '},400);
        assert.deepEqual(await detail(rejection.id,staff),before);
        rejection = await mutate(rejection,staff,'status',{status:'Rejected',note:'Synthetic duplicate request'});
        assert((await detail(rejection.id,requester)).activities.some(a=>a.note==='Synthetic duplicate request'));
        await api(`/api/requests/${r.id}`,other,'GET',undefined,404);
        await api(`/api/requests/${r.id}`,it,'GET',undefined,404);
        await mutate(r,oversight,'note',{visibility:'Public',note:'Forbidden oversight write'},403);
        const groups = (await api('/api/reports',oversight)).result;
        assert.equal(groups.length,1); assert.equal(groups[0].total,2);
        assert.equal(groups[0].closed,1); assert.equal(groups[0].rejected,1); assert.equal(groups[0].open,0);
        assert(Number.isFinite(groups[0].mttr_hours) && groups[0].mttr_hours>=0);
        await api('/api/logout',other,'POST',{});
        await api('/api/requests',other,'GET',undefined,401);
    });
    const acknowledged = business(primary);
    await check('Forced application termination preserves acknowledged business state',async()=>{
        const startTime = performance.now();
        await stop(server,true); await boot(primary);
        assert.deepEqual(business(primary),acknowledged);
        const session = await login('requester');
        assert.equal((await detail(r.id,session)).status,'Closed');
        report.forcedRestartMs = Number((performance.now()-startTime).toFixed(2));
        return `Zero acknowledged request/activity loss; integrity and role/category/account data match; restart/read check ${report.forcedRestartMs} ms.`;
    });
    const backupStarted = new Date();
    const source = new DatabaseSync(primary);
    try { await backup(source,snapshot); } finally { source.close(); }
    assert.deepEqual(business(snapshot),acknowledged);
    await check('Timed application restoration from a local SQLite backup',async()=>{
        const startTime = performance.now();
        await stop(server,true);
        // Recovery uses a different file, with the original primary unavailable to the new process.
        await copyFile(snapshot,restored);
        await boot(restored);
        assert.equal((await api('/health')).result.status,'ok');
        assert.deepEqual(business(restored),acknowledged);
        const restoredRequester = await login('requester');
        assert.equal((await detail(r.id,restoredRequester)).status,'Closed');
        const restoredStaff = await login('secondstaff');
        assert.equal((await detail(r.id,restoredStaff)).owner_id,5);
        const restoredOversight = await login('oversight');
        const groups = (await api('/api/reports',restoredOversight)).result;
        assert.equal(groups[0].total,2); assert.equal(groups[0].closed,1); assert.equal(groups[0].rejected,1);
        report.restoreMs = Number((performance.now()-startTime).toFixed(2));
        report.backupAgeAtRecoveryMs = Date.now()-backupStarted.getTime();
        report.acknowledgedBusinessRecordsLost = 0;
        assert(report.restoreMs <= 60*60*1000,'Restoration exceeded 60 minutes');
        return `Health, account logins, requests, activities, category permissions and report counts restored in ${report.restoreMs} ms; zero acknowledged business-record loss in this drill.`;
    });
    report.status = 'PASS';
} catch (e) {
    report.status = 'FAIL'; report.error = e.message; process.exitCode = 1;
    console.error(`FAIL: ${e.message}`);
} finally {
    const cleanup = await Promise.allSettled([...children].map(child=>stop(child,true)));
    if (cleanup.some(result=>result.status==='rejected')) {
        report.cleanup = 'A temporary process could not be confirmed stopped'; report.status='FAIL'; process.exitCode=1;
    }
    const output = join(backend,'docs/quality/m3');
    await mkdir(output,{recursive:true});
    const jsonPath = join(output,'m4-api-recovery-results.json');
    await writeFile(jsonPath,JSON.stringify(report,null,2)+'\n','utf8');
    const lines = ['# M4 API and local recovery verification','',`Executed: ${report.date}`,`Environment: ${report.environment}`,`Base commit: ${report.baseCommit}`,`Overall result: ${report.status}`,'','Exact source SHA-256 values are in m4-api-recovery-results.json.','','| Check | Result | Duration (ms) | Evidence |','|---|---|---:|---|',...report.checks.map(c=>`| ${c.name} | ${c.status} | ${c.durationMs} | ${c.detail.replaceAll('|','/').replaceAll('\n',' ')} |`),'','## Limits','',...report.boundaries.map(s=>'- '+s),''];
    if (report.error) lines.push(`Failure: ${report.error}`);
    await writeFile(join(output,'m4-api-recovery-results.md'),lines.join('\n'),'utf8');
    try { await rm(temporary,{recursive:true,force:true,maxRetries:10,retryDelay:200}); }
    catch { console.error('Temporary test directory cleanup incomplete.');process.exitCode=1; }
    console.log(`Evidence saved: ${jsonPath}`);
}
