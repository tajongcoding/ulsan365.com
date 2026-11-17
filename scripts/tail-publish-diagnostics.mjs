import { spawn } from 'node:child_process';

// Never print request headers, cookies, bodies, environment bindings or tail URLs.
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects/my-local-info`, {
  headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
});
if (!response.ok) throw new Error(`Cannot identify production deployment (HTTP ${response.status}).`);
const project = await response.json();
const deployment = project.result?.canonical_deployment?.id;
if (typeof deployment !== 'string' || !/^[a-f0-9-]{36}$/.test(deployment)) throw new Error('Production deployment identifier is unavailable.');
const child = spawn('npx', ['wrangler', 'pages', 'deployment', 'tail', deployment, '--project-name', 'my-local-info', '--format', 'json', '--method', 'POST'], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
let current = '', depth = 0, inString = false, escaped = false, observed = 0;
function clean(value) {
  let text = String(value);
  for (const name of ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID']) {
    const secret = process.env[name]; if (secret) text = text.split(secret).join('[redacted]');
  }
  return text.replace(/Bearer\s+\S+|(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]+/g, '[redacted]').slice(0, 700);
}
child.stderr.on('data', chunk => {
  const text = clean(chunk.toString());
  if (/ERROR|error|permission|authentication|code:|not found/i.test(text)) console.log('Tail connection:', text);
});
child.stdout.on('data', chunk => {
  for (const char of chunk.toString()) {
    if (!depth) {
      if (char !== '{') continue;
      current = '{'; depth = 1; inString = false; escaped = false; continue;
    }
    current += char;
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
    } else if (char === '"') inString = true;
    else if (char === '{') depth++;
    else if (char === '}') depth--;
    if (depth) continue;
    try {
      const event = JSON.parse(current);
      const path = new URL(event.event?.request?.url ?? 'https://invalid.local').pathname;
      if (path !== '/api/mobile-publish') continue;
      observed++;
      console.log(JSON.stringify({ outcome: event.outcome, status: event.event?.response?.status,
        exceptions: (event.exceptions ?? []).map(error => ({ name: clean(error.name), message: clean(error.message), stack: clean(error.stack) })),
        logs: (event.logs ?? []).filter(log => String(log.message).includes('ULSAN365')).map(log => ({ level: log.level, message: clean(log.message) })) }));
    } catch { /* Discard non-event CLI output. */ }
    current = '';
  }
});
console.log('Listening for a publishing connection check; only sanitized outcomes and exceptions are recorded.');
const timer = setTimeout(() => { try { process.kill(-child.pid, 'SIGTERM'); } catch { child.kill('SIGTERM'); } }, 90000);
child.on('error', error => { clearTimeout(timer); console.log('Tail process:', clean(error.message)); process.exitCode = 1; });
child.on('close', code => { clearTimeout(timer); console.log('Publishing requests observed:', observed); if (code && code !== 143) process.exitCode = code; });
