export type PublishAccessEnv = { PUBLISH_ACCESS_KEY?: string };
const name = '__Host-ulsan_admin';
const ttl = 604800;
const enc = new TextEncoder();
export function json(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}
async function signingKey(env: PublishAccessEnv) {
  return crypto.subtle.importKey('raw', enc.encode(env.PUBLISH_ACCESS_KEY), {name:'HMAC',hash:'SHA-256'}, false, ['sign','verify']);
}
export async function hasSession(request: Request, env: PublishAccessEnv) {
  if (!env.PUBLISH_ACCESS_KEY || env.PUBLISH_ACCESS_KEY.length < 32) return false;
  const value = (request.headers.get('Cookie') || '').split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='))?.slice(name.length+1) || '';
  const p = value.split('.');
  if (p.length !== 3 || !/^[0-9]{10}$/.test(p[0]) || !/^[a-f0-9]{32}$/.test(p[1]) || !/^[a-f0-9]{64}$/.test(p[2])) return false;
  const now = Math.floor(Date.now()/1000);
  if (+p[0] <= now || +p[0] > now+ttl) return false;
  return crypto.subtle.verify('HMAC', await signingKey(env), Uint8Array.from(p[2].match(/../g)!, x=>parseInt(x,16)), enc.encode(new URL(request.url).origin+':'+p.slice(0,2).join('.')));
}
export async function sessionCookie(request: Request, env: PublishAccessEnv) {
  const nonce = [...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const payload = (Math.floor(Date.now()/1000)+ttl)+'.'+nonce;
  const signature = [...new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(env), enc.encode(new URL(request.url).origin+':'+payload)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  return name+'='+payload+'.'+signature+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age='+ttl;
}
export function clearSessionCookie() {
  return name+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
}
export async function authorize(request: Request, env: PublishAccessEnv) {
  const key = env.PUBLISH_ACCESS_KEY;
  if (!key || key.length < 32) return json({ error:'발행 접근 키 설정이 필요합니다.' },503);
  const actual = request.headers.get('Authorization') || '', expected = 'Bearer '+key;
  let diff = actual.length ^ expected.length;
  for (let i=0;i<expected.length;i++) diff |= (actual.charCodeAt(i)||0)^expected.charCodeAt(i);
  if (request.headers.get('Origin') !== new URL(request.url).origin || (diff !== 0 && !await hasSession(request,env))) return json({error:'관리자 로그인이 필요합니다. 발행 접근 키를 확인해 주세요.'},403);
}
