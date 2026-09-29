import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { Auth } from '../infrastructure/auth.js';
import { RequestRepository } from '../infrastructure/request-repository.js';
import { RequestService } from '../application/request-service.js';
import { fail } from '../domain/policy.js';
async function body(req) {
  fail(req.headers['content-type']?.split(';')[0]==='application/json',415,'Use application/json');
  let size=0; const chunks=[];
  for await (const chunk of req) { size+=chunk.length; fail(size<=16384,413,'Request body is too large'); chunks.push(chunk); }
  try { const value=JSON.parse(Buffer.concat(chunks).toString('utf8')); fail(value&&typeof value==='object'&&!Array.isArray(value),400,'Expected a JSON object'); return value; }
  catch { fail(false,400,'Invalid JSON object'); }
}
export function createApp(db,{origin='http://127.0.0.1:3000',secure=false,logger=console.error}={}) {
  const auth=new Auth(db), service=new RequestService(new RequestRepository(db));
  const server=createServer(async(req,res)=>{
    const correlation=randomUUID();
    res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    res.setHeader('Referrer-Policy','no-referrer'); res.setHeader('X-Request-ID',correlation);
    if(secure) res.setHeader('Strict-Transport-Security','max-age=31536000');
    const send=(status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
    try {
      const url=new URL(req.url,origin),path=url.pathname,method=req.method;
      if(method==='GET'&&path==='/health') { db.prepare('SELECT 1').get(); return send(200,{status:'ok'}); }
      const token=(req.headers.cookie??'').split(';').map(s=>s.trim()).find(s=>s.startsWith('cc_session='))?.slice(11);
      if(!['GET','HEAD'].includes(method)) fail(req.headers.origin===origin,403,'Origin rejected');
      const cookie=t=>`cc_session=${t}; HttpOnly; SameSite=Strict; Path=/; ${t?'Max-Age=28800':'Max-Age=0'}${secure?'; Secure':''}`;
      if(method==='POST'&&path==='/api/login') {
        const input=await body(req),session=await auth.login(input.username,input.password,req.socket.remoteAddress);
        // Successful reauthentication invalidates the browser's previous session.
        if(token && /^[a-f0-9]{64}$/.test(token)) auth.logout(token);
        res.setHeader('Set-Cookie',cookie(session.token)); return send(200,{user:session.user,csrf:session.csrf});
      }
      const user=auth.session(token);
      if(!['GET','HEAD'].includes(method)) fail(req.headers['x-csrf-token']===user.csrf,403,'Invalid CSRF token');
      if(method==='GET'&&path==='/api/me') return send(200,{user:{id:user.id,name:user.name,role:user.role},csrf:user.csrf});
      if(method==='POST'&&path==='/api/logout') { auth.logout(token); res.setHeader('Set-Cookie',cookie('')); return send(200,{ok:true}); }
      if(method==='GET'&&path==='/api/categories') return send(200,db.prepare('SELECT id,name FROM categories WHERE active=1 ORDER BY name').all());
      if(method==='GET'&&path==='/api/staff') {
        fail(user.role==='Staff',403,'Staff access required');
        return send(200,db.prepare("SELECT u.id,u.name,s.category_id FROM users u JOIN staff_categories s ON s.user_id=u.id WHERE u.active=1 AND u.role='Staff' AND s.category_id IN (SELECT category_id FROM staff_categories WHERE user_id=?) ORDER BY u.name").all(user.id));
      }
      const filters=Object.fromEntries(url.searchParams);
      if(path==='/api/requests'&&method==='GET') return send(200,service.list(user,filters));
      if(path==='/api/requests'&&method==='POST') return send(201,service.create(user,await body(req)));
      if(path==='/api/reports'&&method==='GET') return send(200,service.report(user,filters));
      const match=path.match(/^\/api\/requests\/(\d+)(?:\/(assign|schedule|status|note))?$/);
      if(match&&method==='GET'&&!match[2]) return send(200,service.detail(user,Number(match[1])));
      if(match&&method==='POST'&&match[2]) return send(200,service.mutate(user,Number(match[1]),await body(req),match[2]));
      send(404,{error:'Endpoint not found',correlation});
    } catch(e) {
      const status=e.status??(String(e.code).includes('SQLITE_BUSY')?503:500);
      if(status>=500) logger(JSON.stringify({at:new Date().toISOString(),correlation,status,event:'request_failed'}));
      send(status,{error:status===500?'Unexpected error':status===503?'Database busy. Try again.':e.message,correlation});
    }
  });
  server.requestTimeout=15000; server.headersTimeout=10000;
  return server;
}
