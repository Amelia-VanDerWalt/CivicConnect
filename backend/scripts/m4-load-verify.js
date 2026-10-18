import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes, createHash } from 'node:crypto';
import { mkdtemp, rm, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import { setTimeout as delay } from 'node:timers/promises';

const backend = resolve(process.argv[2] || process.cwd()), project = resolve(backend,'..');
const {openDatabase} = await import(pathToFileURL(join(backend,'src/infrastructure/database.js')));
const {hashPassword,digest} = await import(pathToFileURL(join(backend,'src/infrastructure/auth.js')));
const durationSeconds = Number(process.env.M4_LOAD_SECONDS || 900);
assert(Number.isFinite(durationSeconds) && durationSeconds>=1 && durationSeconds<=3600,'Invalid load duration');
const formal = durationSeconds>=900;
const temp = await mkdtemp(join(tmpdir(),'civic-m4-load-'));
const dbPath = join(temp,'load.sqlite');
const configuredOrigin = 'http://127.0.0.1:3999';
const sessions = [];
const abort = new AbortController();
let child, origin;
const result = {
    at:new Date().toISOString(),environment:`${process.version} ${process.platform}/${process.arch}`,
    baseCommit:spawnSync('git',['rev-parse','HEAD'],{cwd:project,encoding:'utf8'}).stdout?.trim()||'unknown',
    requestedDurationSeconds:durationSeconds,formalWorkloadRequested:formal,
    seededActiveRecords:5000,concurrentVirtualUsers:20,
    userMix:'10 Requesters and 10 Staff; one distinct account/session per virtual user',
    workload:'Each round has 100 operations: 80 reads and 20 writes. Each user performs 5 sequential actions, paced every 2 seconds; rounds start no faster than every 10 seconds. No fixed throughput requirement is assumed.',
    authentication:'Synthetic authenticated sessions provisioned in the isolated fixture; login/TLS/browser rendering are outside the measured workload.',
    sourceHashes:{},failures:[],
    limits:['Loopback HTTP on this single test host; no production network/TLS or municipal deployment claim.','Database grows as acknowledged writes are added. Think time is excluded from request latency.','Search/list/detail response content and created-record fields are asserted, not status alone.','An abbreviated diagnostic run cannot satisfy AC-N04.']
};
for (const name of ['backend/src/server.js','backend/src/http/app.js','backend/src/application/request-service.js','backend/src/infrastructure/request-repository.js','backend/src/infrastructure/database.js','backend/src/infrastructure/auth.js','backend/src/domain/policy.js','backend/db/migrations/001_initial.sql','src/frontend/index.html','src/frontend/app.js','src/frontend/requester-history.js','src/frontend/staff-workflows.js']) {
    try { result.sourceHashes[name] = createHash('sha256').update(await readFile(join(project,name))).digest('hex'); }
    catch(e) { if(e.code!=='ENOENT') throw e; }
}
const reads=[],writes=[];
function metrics(values) {
    if (!values.length) return {count:0,averageMs:null,p95Ms:null,maxMs:null};
    const sorted=values.slice().sort((a,b)=>a-b);
    return {count:values.length,averageMs:Number((values.reduce((a,b)=>a+b,0)/values.length).toFixed(2)),p95Ms:Number(sorted[Math.ceil(sorted.length*0.95)-1].toFixed(2)),maxMs:Number(sorted.at(-1).toFixed(2))};
}
async function start() {
    child=spawn(process.execPath,['src/server.js'],{cwd:backend,env:{...process.env,DB_PATH:dbPath,HOST:'127.0.0.1',PORT:'0',APP_ORIGIN:configuredOrigin,COOKIE_SECURE:'false'},stdio:['ignore','pipe','pipe']});
    origin=await new Promise((resolveStart,reject)=>{
        let output=''; const timer=setTimeout(()=>reject(new Error('Load server startup timed out')),15000);
        child.stdout.on('data',chunk=>{output+=chunk.toString();const match=output.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolveStart(match[0]);}});
        child.stderr.on('data',()=>{});
        child.once('error',e=>{clearTimeout(timer);reject(e);});
        child.once('close',code=>{clearTimeout(timer);reject(new Error(`Load server exited: ${code}`));});
    });
}
async function request(user,action,round,measured=true) {
    const writing=user.role==='Requester' && [1,4].includes(action);
    const title=`Live load user ${user.id} round ${round} action ${action}`;
    let endpoint;
    if(writing) endpoint='/api/requests';
    else if(user.role==='Requester') {
        endpoint=action===2 ? `/api/requests/${user.id}` : action===3 ? '/api/requests?q=Live%20load&sort=created_at&direction=desc' : '/api/requests?q=Seed&status=Received';
    } else {
        endpoint=[1,4].includes(action) ? `/api/requests/${user.id-100}` : action===3 ? '/api/requests?q=Seed&sort=due_at&direction=asc' : '/api/requests?q=Seed&status=Received&category=1&priority=Normal';
    }
    const headers={Accept:'application/json',Cookie:user.cookie};
    const options={headers,signal:AbortSignal.any([abort.signal,AbortSignal.timeout(15000)])};
    if(writing) {
        options.method='POST'; headers.Origin=configuredOrigin;headers['Content-Type']='application/json';headers['X-CSRF-Token']=user.csrf;
        options.body=JSON.stringify({title,description:'Synthetic formal M4 load verification',category_id:1,location:'Test fixture'});
    }
    const began=performance.now();
    try {
        const response=await fetch(origin+endpoint,options),data=await response.json();
        assert.equal(response.status,writing?201:200,`${writing?'Write':'Read'} status ${response.status}`);
        if(writing) {
            assert(Number.isSafeInteger(data.id));assert.equal(data.requester_id,user.id);assert.equal(data.title,title);
            assert.equal(data.status,'Received');assert.equal(data.priority,'Normal');assert.equal(data.category_id,1);assert.match(data.reference,/^CC-/);
        } else if(Array.isArray(data)) {
            const seeded=endpoint.includes('q=Seed');
            if(seeded) assert.equal(data.length,user.role==='Requester'?500:5000,'Seed filter returned incorrect count');
            else assert(data.length>=1,'Expected earlier live write in requester list');
            for(const record of data) {
                assert.equal(record.category_id,1);assert.equal(record.status,'Received');
                if(user.role==='Requester') assert.equal(record.requester_id,user.id);
                if(seeded) assert(record.title.startsWith('Seed '));
                else assert(record.title.startsWith('Live load '));
            }
            if(endpoint.includes('sort=due_at')) assert(data.every(r=>r.due_at===null),'Seed due dates should be unscheduled');
        } else {
            assert.equal(data.id,user.role==='Requester'?user.id:user.id-100);
            assert.equal(data.category_id,1);assert(Array.isArray(data.activities));
            if(user.role==='Requester') assert.equal(data.requester_id,user.id);
        }
        const elapsed=performance.now()-began;
        if(measured) (writing?writes:reads).push(elapsed);
    } catch(e) {
        if(result.failures.length<20) result.failures.push({user:user.id,operation:writing?'write':'read',message:e.message});
        throw e;
    }
}
let started;
try {
    const db=openDatabase(dbPath);
    try {
        const hash=await hashPassword(randomBytes(24).toString('base64url'));
        const addUser=db.prepare('INSERT INTO users(id,username,name,password_hash,role) VALUES(?,?,?,?,?)');
        const addSession=db.prepare('INSERT INTO sessions VALUES(?,?,?,?)');
        for(let i=1;i<=20;i++) {
            const role=i<=10?'Requester':'Staff',id=i<=10?i:100+i-10;
            addUser.run(id,`load${id}`,`Synthetic load ${id}`,hash,role);
            const token=randomBytes(32).toString('hex'),csrf=randomBytes(32).toString('hex');
            addSession.run(digest(token),id,csrf,Date.now()+2*3600000);
            sessions.push({id,role,cookie:`cc_session=${token}`,csrf});
        }
        db.exec("INSERT INTO categories VALUES(1,'Facilities',1); INSERT INTO staff_categories SELECT id,1 FROM users WHERE role='Staff';");
        const insert=db.prepare("INSERT INTO requests(reference,requester_id,category_id,category_label,title,description,status,priority,created_at) VALUES(?,?,1,'Facilities',?,'Synthetic seed record','Received','Normal',?)");
        db.exec('BEGIN IMMEDIATE');
        try {
            const at=new Date().toISOString();
            for(let i=0;i<5000;i++) insert.run(`CC-LOAD-SEED-${i+1}`,i%10+1,`Seed ${i+1}`,at);
            db.exec('COMMIT');
        } catch(e) { db.exec('ROLLBACK');throw e; }
        assert.equal(db.prepare('SELECT count(*) AS n FROM requests').get().n,5000);
    } finally { db.close(); }
    await start();
    // Warm selected reads before the measured window, without creating extra records.
    await Promise.all(sessions.map(s=>request(s,0,-1,false)));
    console.log(`Starting ${formal?'FORMAL':'ABBREVIATED DIAGNOSTIC'} load: ${durationSeconds}s, 5000 active records, 20 virtual users, 80/20 read/write.`);
    started=performance.now();
    const end=started+durationSeconds*1000;
    let round=0,lastProgress=-1;
    while(performance.now()<end) {
        const roundStart=performance.now();
        const tasks=sessions.map(async user=>{
            for(let action=0;action<5;action++) {
                const wait=roundStart+action*2000-performance.now();
                if(wait>0) await delay(wait,undefined,{signal:abort.signal});
                await request(user,action,round);
            }
        });
        try { await Promise.all(tasks); }
        catch(e) {abort.abort();await Promise.allSettled(tasks);throw e;}
        round++;
        const wait=Math.min(roundStart+10000,end)-performance.now();
        if(wait>0) await delay(wait);
        const minute=Math.floor((performance.now()-started)/60000);
        if(minute>lastProgress) {
            lastProgress=minute;
            console.log(`Elapsed ${((performance.now()-started)/1000).toFixed(0)}s; reads=${reads.length}, writes=${writes.length}`);
        }
    }
    result.measuredDurationSeconds=Number(((performance.now()-started)/1000).toFixed(3));
    result.completedRounds=round;result.reads=metrics(reads);result.writes=metrics(writes);
    result.readFraction=reads.length/(reads.length+writes.length);
    assert.equal(reads.length,round*80);assert.equal(writes.length,round*20);assert.equal(result.readFraction,0.8);
    const verificationDb=openDatabase(dbPath);
    try {
        result.finalActiveRecords=verificationDb.prepare('SELECT count(*) AS n FROM requests').get().n;
        assert.equal(result.finalActiveRecords,5000+writes.length,'Acknowledged writes did not all persist');
        assert.equal(verificationDb.prepare('PRAGMA integrity_check').get().integrity_check,'ok');
    } finally { verificationDb.close(); }
    assert(result.reads.p95Ms<=2000,`Read p95 ${result.reads.p95Ms} ms exceeds 2000 ms`);
    assert(result.writes.p95Ms<=3000,`Write p95 ${result.writes.p95Ms} ms exceeds 3000 ms`);
    if(formal) assert(result.measuredDurationSeconds>=900,'Formal run shorter than 15 minutes');
    result.status=formal?'PASS':'DIAGNOSTIC PASS — NOT FORMAL ACCEPTANCE';
} catch(e) {
    abort.abort();result.status='FAIL';result.error=e.message;process.exitCode=1;
    result.measuredDurationSeconds=started?Number(((performance.now()-started)/1000).toFixed(3)):0;
    result.reads=metrics(reads);result.writes=metrics(writes);
    console.error(`FAIL: ${e.message}`);
} finally {
    if(child && child.exitCode===null && child.signalCode===null) {
        await new Promise(resolveStop=>{
            const timer=setTimeout(()=>{child.kill('SIGKILL');resolveStop();},10000);
            child.once('close',()=>{clearTimeout(timer);resolveStop();});child.kill('SIGTERM');
        });
    }
    const out=join(backend,'docs/quality/m3');await mkdir(out,{recursive:true});
    await writeFile(join(out,'m4-formal-load-results.json'),JSON.stringify(result,null,2)+'\n','utf8');
    const lines=['# M4 load verification','',`Executed: ${result.at}`,`Result: ${result.status}`,`Environment: ${result.environment}`,`Base commit: ${result.baseCommit}`,'',`Initial active records: 5000. Concurrent virtual users: 20.`,result.userMix,result.workload,result.authentication,'',`Measured duration: ${result.measuredDurationSeconds} seconds.`,`Reads: ${JSON.stringify(result.reads)}`,`Writes: ${JSON.stringify(result.writes)}`,`Final active records: ${result.finalActiveRecords ?? 'not established'}`,'','Exact source hashes and any failures are in m4-formal-load-results.json.','','## Limits','',...result.limits.map(s=>'- '+s),''];
    if(result.error) lines.push(`Failure: ${result.error}`);
    await writeFile(join(out,'m4-formal-load-results.md'),lines.join('\n'),'utf8');
    await rm(temp,{recursive:true,force:true,maxRetries:10,retryDelay:200});
    console.log(`RESULT: ${result.status}`);console.log(`Read p95: ${result.reads?.p95Ms} ms; Write p95: ${result.writes?.p95Ms} ms.`);
    console.log(`Evidence: ${join(out,'m4-formal-load-results.json')}`);
}
