import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { issueUploadTicket, normalizeManuscript, uploadFile, commitUpload, checkStorage } from '../functions/_lib/publish-upload.ts';

const env = { PUBLISH_ACCESS_KEY: 'test-key-only-'.repeat(4), PUBLISH_GITHUB_TOKEN: 'test-only', PUBLISH_BRANCH: 'test' };
const slug = '2026-11-17-test-publish';
const paths = [`src/content/posts/${slug}.md`, ...Array.from({ length: 7 }, (_, i) => `public/images/info/2026-11-17/${slug}-0${i}.webp`)];
const files = paths.map((path, i) => new File([i ? `image fixture ${i}` : 'fixture manuscript\n'], path.split('/').at(-1)));
const hashes = await Promise.all(files.map(async file => createHash('sha256').update(Buffer.from(await file.arrayBuffer())).digest('hex')));
const claims = { head: 'a'.repeat(40), branch: 'test', slug, paths, hashes };
const ticket = await issueUploadTicket(claims, env.PUBLISH_ACCESS_KEY);
const requests = [];
let remoteHead = claims.head;
let failPath;
globalThis.fetch = async (url, init) => {
  const path = new URL(url).pathname.split('/ulsan365.com')[1];
  const body = init.body ? JSON.parse(init.body) : undefined;
  requests.push({ path, method: init.method, body });
  if (path === failPath) return Response.json({ error: 'mock failure' }, { status: 503 });
  if (path === '/git/blobs') return Response.json({ sha: createHash('sha1').update(body.content).digest('hex') });
  if (path === '/git/ref/heads/test') return Response.json({ object: { sha: remoteHead } });
  if (path === '/git/commits/' + claims.head) return Response.json({ tree: { sha: 'b'.repeat(40) } });
  if (path === '/git/trees') return Response.json({ sha: 'c'.repeat(40) });
  if (path === '/git/commits') return Response.json({ sha: 'd'.repeat(40) });
  if (path === '/git/refs/heads/test') return Response.json({ object: { sha: 'd'.repeat(40) } });
  throw new Error('Unexpected GitHub path: ' + path);
};
function form(index, token = ticket, asset = files[index]) {
  const data = new FormData(); data.set('ticket', token); data.set('index', String(index)); data.set('asset', asset); return data;
}
async function rejectsWithoutWrites(fn, pattern) {
  requests.length = 0;
  await assert.rejects(fn, pattern);
  assert.equal(requests.filter(r => r.method !== 'GET').length, 0);
}

await rejectsWithoutWrites(() => uploadFile(form(0, ticket + 'bad'), env), /검사 정보/);
await rejectsWithoutWrites(() => uploadFile(form(0), { ...env, PUBLISH_BRANCH: 'main' }), /발행 대상/);
await rejectsWithoutWrites(() => uploadFile(form(0, ticket, new File(['changed'], files[0].name)), env), /파일이 바뀌/);
await rejectsWithoutWrites(() => uploadFile(form(0, ticket, new File(['fixture manuscript\n'], 'other.md')), env), /이름/);
const now = Date.now;
Date.now = () => now() - 16 * 60 * 1000;
const expired = await issueUploadTicket(claims, env.PUBLISH_ACCESS_KEY);
Date.now = now;
await rejectsWithoutWrites(() => uploadFile(form(0, expired), env), /유효시간/);

requests.length = 0;
const proofs = [];
for (let i = 0; i < files.length; i++) proofs.push((await uploadFile(form(i), env)).proof);
assert.equal(requests.length, 8);
assert.ok(requests.every(r => r.path === '/git/blobs' && r.method === 'POST'));
await rejectsWithoutWrites(() => commitUpload({ ticket, proofs: proofs.slice(1), coverReviewed: true }, env), /저장을 먼저/);
await rejectsWithoutWrites(() => commitUpload({ ticket, proofs: [proofs[0], ...proofs.slice(0, 7)], coverReviewed: true }, env), /중복/);
await rejectsWithoutWrites(() => commitUpload({ ticket, proofs, coverReviewed: false }, env), /대표 이미지/);
const other = await issueUploadTicket({ ...claims, head: 'e'.repeat(40) }, env.PUBLISH_ACCESS_KEY);
await rejectsWithoutWrites(() => commitUpload({ ticket: other, proofs, coverReviewed: true }, env), /저장 결과가 다릅/);
remoteHead = 'e'.repeat(40);
await rejectsWithoutWrites(() => commitUpload({ ticket, proofs, coverReviewed: true }, env), /브랜치/);
remoteHead = claims.head;
requests.length = 0;
failPath = '/git/trees';
await assert.rejects(() => commitUpload({ ticket, proofs, coverReviewed: true }, env), /HTTP 503/);
assert.ok(!requests.some(r => r.method === 'PATCH'));
failPath = undefined;
requests.length = 0;
const published = await commitUpload({ ticket, proofs: [...proofs].reverse(), coverReviewed: true }, env);
assert.equal(published.commit.oid, 'd'.repeat(40));
assert.equal(published.branch, 'test');
const tree = requests.find(r => r.path === '/git/trees').body;
assert.equal(tree.tree.length, 8);
assert.deepEqual(new Set(tree.tree.map(e => e.path)), new Set(paths));
assert.deepEqual(requests.at(-1), { path: '/git/refs/heads/test', method: 'PATCH', body: { sha: 'd'.repeat(40), force: false } });
const normalized = normalizeManuscript('Content\n\nAI 제작 홍보 이미지. 실제 시설·행사 현장 사진이 아닙니다.\n');
assert.equal(normalizeManuscript(normalized), normalized);
requests.length = 0;
assert.deepEqual(await checkStorage(env), { ok: true, protocol: 'staged-v1' });
assert.deepEqual(requests.map(r => r.path), ['/git/ref/heads/test', '/git/blobs']);
assert.ok(!requests.some(r => r.method === 'PATCH'));
console.log('PASS: signed uploads, unchanged files, expiry, branch conflicts, complete manifests, safe commit and normalization');
