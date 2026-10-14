import { openDatabase } from './infrastructure/database.js';
import { createApp } from './http/app.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative, isAbsolute, extname } from 'node:path';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be an integer from 0 to 65535');
const origin = process.env.APP_ORIGIN ?? `http://${host}:${port}`;
const secure = process.env.COOKIE_SECURE === 'true';
if (!['127.0.0.1', '::1', 'localhost'].includes(host) && !secure) throw new Error('Non-loopback binding requires HTTPS configuration and COOKIE_SECURE=true');
if (secure && !origin.startsWith('https://')) throw new Error('Secure cookies require an HTTPS APP_ORIGIN');
const db = openDatabase(process.env.DB_PATH ?? 'data/civicconnect.sqlite');
const app = createApp(db, { origin, secure });
const apiHandler = app.listeners('request')[0];
app.removeAllListeners('request');
const root = fileURLToPath(new URL('../../src/frontend/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8' };

app.on('request', async (req, res) => {
  // Read the raw path before URL normalisation so traversal is never silently normalised.
  const raw = (req.url ?? '/').split('?')[0];
  if (raw === '/api' || raw.startsWith('/api/') || raw === '/health') return apiHandler(req, res);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  const end = status => { res.writeHead(status); res.end(); };
  if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return end(405); }
  try {
    const path = decodeURIComponent(raw);
    if (!path.startsWith('/') || path.includes('\\') || path.includes('\0') || path.split('/').includes('..')) return end(404);
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    const rel = relative(root, file);
    if (rel.startsWith('..') || isAbsolute(rel) || !types[extname(file)]) return end(404);
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)], 'Content-Length': bytes.length });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch { end(404); }
});
app.listen(port, host, () => console.log(`CivicConnect Frontend & API running at http://${host}:${app.address().port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  app.close(() => { db.close(); process.exit(0); });
  app.closeIdleConnections();
});
app.on('error', () => { console.error('Server startup failed; check binding and configuration.'); db.close(); process.exitCode = 1; });
