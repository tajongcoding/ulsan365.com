import { Buffer } from 'node:buffer';

const repository = 'tajongcoding/ulsan365.com';
const maxAge = 15 * 60;
const MiB = 1024 * 1024;
const encoder = new TextEncoder();
type Env = { PUBLISH_ACCESS_KEY?: string; PUBLISH_GITHUB_TOKEN?: string; PUBLISH_BRANCH?: string };
type Ticket = { kind: 'upload'; expires: number; head: string; branch: string; slug: string; paths: string[]; hashes: string[] };
type Proof = { kind: 'blob'; expires: number; ticket: string; index: number; sha: string };

export function normalizeManuscript(markdown: string) {
  const notice = 'AI 생성 설명 이미지이며 실제 행사 장면·공식 예약 화면이 아닙니다.';
  const lines = /^(?:AI 생성 설명 이미지이며 실제 행사 장면·공식 예약 화면이 아닙니다\.|AI 제작 홍보 이미지\. 실제 시설·행사 현장 사진이 아닙니다\.)[ \t]*$/gm;
  return lines.test(markdown) ? markdown.replace(lines, '').trimEnd() + '\n\n' + notice + '\n' : markdown;
}

async function digest(bytes: Uint8Array) {
  return Buffer.from(await crypto.subtle.digest('SHA-256', bytes as Uint8Array<ArrayBuffer>)).toString('hex');
}
async function key(secret: string) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function seal(value: Ticket | Proof, secret: string) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  const signature = Buffer.from(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(payload))).toString('base64url');
  return payload + '.' + signature;
}
async function open(value: unknown, secret: string): Promise<Ticket | Proof> {
  if (typeof value !== 'string' || value.length > 8192) throw new Error('검사 정보가 올바르지 않습니다. 다시 검사해 주세요.');
  const parts = value.split('.');
  if (parts.length !== 2 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part)) ||
      !await crypto.subtle.verify('HMAC', await key(secret), Buffer.from(parts[1], 'base64url'), encoder.encode(parts[0]))) {
    throw new Error('검사 정보가 바뀌었습니다. 다시 검사해 주세요.');
  }
  const claims = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')) as Ticket | Proof;
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(claims.expires) || claims.expires <= now || claims.expires > now + maxAge) {
    throw new Error('검사 유효시간이 지났습니다. 다시 검사해 주세요.');
  }
  return claims;
}
async function ticket(value: unknown, env: Env) {
  const claims = await open(value, env.PUBLISH_ACCESS_KEY!);
  if (claims.kind !== 'upload' || claims.branch !== env.PUBLISH_BRANCH ||
      !/^[a-f0-9]{40}$/.test(claims.head) ||
      !/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(claims.slug) ||
      !Array.isArray(claims.paths) || claims.paths.length !== 8 ||
      new Set(claims.paths).size !== 8 || !Array.isArray(claims.hashes) || claims.hashes.length !== 8 ||
      !claims.hashes.every(hash => /^[a-f0-9]{64}$/.test(hash)) ||
      claims.paths[0] !== `src/content/posts/${claims.slug}.md` ||
      !claims.paths.slice(1).every((path, i) =>
        new RegExp(`^public/images/info/${claims.slug.slice(0, 10)}/${claims.slug}-0${i}\\.(png|jpe?g|webp)$`).test(path))) {
    throw new Error('발행 대상이 바뀌었습니다. 다시 검사해 주세요.');
  }
  return claims;
}

export async function issueUploadTicket(input: Omit<Ticket, 'kind' | 'expires'>, secret: string) {
  return seal({ ...input, kind: 'upload', expires: Math.floor(Date.now() / 1000) + maxAge }, secret);
}

async function github(env: Env, path: string, method = 'GET', body?: object) {
  const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.PUBLISH_GITHUB_TOKEN}`, Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json', 'User-Agent': 'ULSAN365-Mobile-Publish' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`GitHub 저장 단계에서 오류가 발생했습니다 (HTTP ${response.status}). 저장 여부를 확인한 뒤 다시 검사해 주세요.`);
  return await response.json() as { sha?: string; object?: { sha: string }; tree?: { sha: string } };
}
function sha(value: unknown): asserts value is string {
  if (typeof value !== 'string' || !/^[a-f0-9]{40}$/.test(value)) throw new Error('GitHub 저장 결과를 확인할 수 없습니다. 다시 검사해 주세요.');
}

// A detached text blob verifies write access without creating or changing a public post.
export async function checkStorage(env: Env, write = true) {
  const ref = await github(env, '/git/ref/heads/' + encodeURIComponent(env.PUBLISH_BRANCH!));
  sha(ref.object?.sha);
  if (!write) return { ok: true, protocol: 'staged-v1' };
  const blob = await github(env, '/git/blobs', 'POST', {
    encoding: 'utf-8', content: 'ULSAN365 publishing connection check. No public post.\n',
  });
  sha(blob.sha);
  return { ok: true, protocol: 'staged-v1' };
}

// Each request uploads one detached blob. No post is public until commitUpload advances the branch.
export async function uploadFile(form: FormData, env: Env) {
  const token = form.get('ticket');
  const checked = await ticket(token, env);
  const rawIndex = form.get('index');
  const index = typeof rawIndex === 'string' && /^[0-7]$/.test(rawIndex) ? Number(rawIndex) : -1;
  const asset = form.get('asset');
  if (index < 0 || !(asset instanceof File) || !asset.size || asset.size > (index === 0 ? 256 * 1024 : 4 * MiB) ||
      asset.name !== checked.paths[index].split('/').at(-1)) {
    throw new Error('저장할 파일의 이름·번호·크기를 확인해 주세요.');
  }
  let bytes = new Uint8Array(await asset.arrayBuffer());
  if (index === 0) bytes = encoder.encode(normalizeManuscript(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  if (await digest(bytes) !== checked.hashes[index]) throw new Error('검사 후 파일이 바뀌었습니다. 다시 검사해 주세요.');
  const blob = await github(env, '/git/blobs', 'POST', { encoding: 'base64', content: Buffer.from(bytes).toString('base64') });
  sha(blob.sha);
  return { proof: await seal({ kind: 'blob', expires: checked.expires, ticket: await digest(encoder.encode(token as string)), index, sha: blob.sha }, env.PUBLISH_ACCESS_KEY!) };
}

export async function commitUpload(input: { ticket?: unknown; proofs?: unknown; coverReviewed?: unknown }, env: Env) {
  const checked = await ticket(input.ticket, env);
  if (input.coverReviewed !== true) throw new Error('대표 이미지 검수를 먼저 완료해 주세요.');
  if (!Array.isArray(input.proofs) || input.proofs.length !== 8) throw new Error('원고와 이미지 7장의 저장을 먼저 완료해 주세요.');
  const identity = await digest(encoder.encode(input.ticket as string));
  const proofs: Proof[] = [];
  for (const token of input.proofs) {
    const proof = await open(token, env.PUBLISH_ACCESS_KEY!);
    if (proof.kind !== 'blob' || proof.ticket !== identity || !Number.isInteger(proof.index) || proof.index < 0 || proof.index > 7) {
      throw new Error('검사한 파일과 저장 결과가 다릅니다. 다시 검사해 주세요.');
    }
    sha(proof.sha);
    proofs.push(proof);
  }
  if (new Set(proofs.map(proof => proof.index)).size !== 8) throw new Error('같은 파일이 중복 저장됐습니다. 다시 검사해 주세요.');
  const ref = await github(env, '/git/ref/heads/' + encodeURIComponent(checked.branch));
  if (ref.object?.sha !== checked.head) throw new Error('브랜치가 갱신됐습니다. 다시 검사해 주세요.');
  const parent = await github(env, '/git/commits/' + checked.head);
  sha(parent.tree?.sha);
  const tree = await github(env, '/git/trees', 'POST', { base_tree: parent.tree.sha,
    tree: proofs.map(proof => ({ path: checked.paths[proof.index], mode: '100644', type: 'blob', sha: proof.sha })) });
  sha(tree.sha);
  const commit = await github(env, '/git/commits', 'POST', {
    message: `Publish ULSAN365 post: ${checked.slug}`, tree: tree.sha, parents: [checked.head],
  });
  sha(commit.sha);
  // force:false rejects a competing branch update; a partial upload never advances the branch.
  await github(env, '/git/refs/heads/' + encodeURIComponent(checked.branch), 'PATCH', { sha: commit.sha, force: false });
  return { commit: { oid: commit.sha, url: `https://github.com/${repository}/commit/${commit.sha}` }, branch: checked.branch, slug: checked.slug };
}
