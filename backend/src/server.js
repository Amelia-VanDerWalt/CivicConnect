/*import { openDatabase } from './infrastructure/database.js';
import { createApp } from './http/app.js';
const host=process.env.HOST??'127.0.0.1',port=Number(process.env.PORT??3000),origin=process.env.APP_ORIGIN??`http://${host}:${port}`;
const secure=process.env.COOKIE_SECURE==='true';
if(!['127.0.0.1','::1','localhost'].includes(host)&&!secure) throw new Error('Non-loopback binding requires HTTPS configuration and COOKIE_SECURE=true');
if(secure&&!origin.startsWith('https://')) throw new Error('Secure cookies require an HTTPS APP_ORIGIN');
const db=openDatabase(process.env.DB_PATH??'data/civicconnect.sqlite');
const server=createApp(db,{origin,secure});
server.listen(port,host,()=>console.log(`CivicConnect available at ${origin}`));
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.close(()=>{db.close();process.exit(0);}));*/

import { openDatabase } from './infrastructure/database.js';
import { createApp } from './http/app.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname } from 'node:path';

const db = openDatabase(process.env.DB_PATH ?? 'data/civicconnect.sqlite');
const app = createApp(db);

const apiHandler = app.listeners('request')[0];
app.removeAllListeners('request');

app.on('request', async (req, res) => {
    if (req.url.startsWith('/api') || req.url === '/health') {
        return apiHandler(req, res);
    }
    
    try {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = filePath.split('?')[0];

        const __dirname = fileURLToPath(new URL('.', import.meta.url));
        const fullPath = join(__dirname, '../../src/frontend', filePath);
        
        const content = await readFile(fullPath);
        
        const ext = extname(fullPath);
        const types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript'
        };
        
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(content);
    } catch (err) {
        if (req.url !== '/favicon.ico') {
            res.writeHead(404);
            res.end('Frontend file not found');
        }
    }
});

app.listen(3000, '127.0.0.1', () => {
    console.log('CivicConnect Frontend & API running at http://127.0.0.1:3000');
});
