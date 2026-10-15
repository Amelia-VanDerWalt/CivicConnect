import { execFileSync, execSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '../..');
const backendDir = resolve(import.meta.dirname, '..');
const selfPath = resolve(import.meta.filename);

// Collect tracked files plus any new untracked files that aren't ignored by Git
const gitFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  cwd: rootDir,
  encoding: 'utf8'
})
  .split(/\r?\n/)
  .filter(Boolean);

const jsFiles = [];
const staticIssues = [];
const forbiddenTrackedFiles = [];
const secretFindings = [];

const secretRegex = new RegExp([
  'BEGIN RSA ' + 'PRIVATE KEY',
  'BEGIN OPENSSH ' + 'PRIVATE KEY',
  'ghp_[A-Za-z0-9]{30,}',
  'sk-[A-Za-z0-9]{30,}'
].join('|'));

for (const relPath of gitFiles) {
  const fullPath = resolve(rootDir, relPath);
  let stat;
  try {
    stat = statSync(fullPath);
  } catch {
    continue;
  }
  if (!stat.isFile()) continue;

  const baseName = relPath.split('/').pop();
  const ext = extname(relPath);

  if (ext === '.js') jsFiles.push({ relPath, fullPath });

  // 1. Check if forbidden runtime/secret files are unignored/staged
  if (
    (baseName === '.env' || baseName.startsWith('.env.')) &&
    baseName !== '.env.example' &&
    baseName !== '.env.staging.example'
  ) {
    forbiddenTrackedFiles.push(relPath);
  }
  if (relPath.endsWith('.sqlite') || relPath.endsWith('.sqlite-wal') || relPath.endsWith('.sqlite-shm')) {
    forbiddenTrackedFiles.push(relPath);
  }

  // 2. Scan code/config files for accidental secret tokens (excluding this script itself)
  if (fullPath !== selfPath && ['.js', '.html', '.css', '.json', '.yml', '.md'].includes(ext)) {
    const content = readFileSync(fullPath, 'utf8');
    if (secretRegex.test(content)) secretFindings.push(relPath);
  }
}

console.log('=== 1. STATIC CODE ANALYSIS (Syntax & Code-Quality Rules) ===');
for (const { relPath, fullPath } of jsFiles) {
  execFileSync(process.execPath, ['--check', fullPath], { stdio: 'inherit' });
  if (fullPath === selfPath) continue;
  const src = readFileSync(fullPath, 'utf8');
  if (/\beval\s*\(/.test(src)) staticIssues.push(`${relPath}: forbidden eval() usage`);
  if (/\bdebugger\b/.test(src)) staticIssues.push(`${relPath}: leftover debugger statement`);
  if (/\bvar\s+[A-Za-z_$]/.test(src)) staticIssues.push(`${relPath}: legacy var declaration (use const/let)`);
}

if (staticIssues.length > 0) {
  console.error('FAIL: Static code-quality violations found:', staticIssues);
  process.exit(1);
}
console.log(`PASS: ${jsFiles.length} JavaScript files passed syntax and static quality rules.`);

console.log('\n=== 2. SECURITY & SECRETS CHECK (Git Hygiene & Dependency Audit) ===');
if (forbiddenTrackedFiles.length > 0) {
  console.error('FAIL: Forbidden .env or SQLite database file is not ignored by Git:', forbiddenTrackedFiles);
  process.exit(1);
}
if (secretFindings.length > 0) {
  console.error('FAIL: Potential hardcoded secret token found in repository files:', secretFindings);
  process.exit(1);
}
console.log('PASS: Zero exposed .env files, SQLite databases, or hardcoded secret tokens.');

execSync('npm audit --audit-level=high', { cwd: backendDir, stdio: 'inherit' });
console.log('PASS: npm audit confirmed 0 high/critical dependency vulnerabilities.');