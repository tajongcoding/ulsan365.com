import { authorize, json, type PublishAccessEnv } from '../_lib/publish-access';

type Env = PublishAccessEnv & { PUBLISH_DRIVE_SERVICE_ACCOUNT?: string };
type DriveFile = { id: string; name: string; mimeType: string; size?: string; parents?: string[]; trashed?: boolean; shortcutDetails?: unknown };
const root = '1sAYEGK5B0aksoXblmykZylje-d5ykZYI';
const folderType = 'application/vnd.google-apps.folder';
const maxSize = 16 * 1024 * 1024;
const fileFields = 'id,name,mimeType,size,parents,trashed,shortcutDetails';
const idPattern = /^[a-zA-Z0-9_-]{10,150}$/;

function encoded(bytes: Uint8Array) {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function accessToken(credentials: string) {
  const account = JSON.parse(credentials) as { client_email?: string; private_key?: string };
  if (!account.client_email || !account.private_key) throw new Error('credentials');
  const now = Math.floor(Date.now() / 1000);
  const encodeJson = (value: object) => encoded(new TextEncoder().encode(JSON.stringify(value)));
  const assertion = [
    encodeJson({ alg: 'RS256', typ: 'JWT' }),
    encodeJson({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  ].join('.');
  const pem = account.private_key.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), char => char.charCodeAt(0)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(assertion));
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${assertion}.${encoded(new Uint8Array(signature))}`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('credentials');
  const result = await response.json() as { access_token?: string };
  if (!result.access_token) throw new Error('credentials');
  return result.access_token;
}

async function drive(token: string, path: string, params: Record<string, string>) {
  const url = new URL(`https://www.googleapis.com/drive/v3/${path}`);
  url.search = new URLSearchParams({ ...params, supportsAllDrives: 'true' }).toString();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('drive');
  return response;
}

async function metadata(token: string, id: string): Promise<DriveFile> {
  return (await drive(token, `files/${id}`, { fields: fileFields })).json();
}

async function inFolder(token: string, file: DriveFile) {
  for (let depth = 0; depth < 10; depth++) {
    if (file.trashed || file.shortcutDetails) return false;
    if (file.id === root) return file.mimeType === folderType;
    if (file.parents?.length !== 1) return false;
    file = await metadata(token, file.parents[0]);
  }
  return false;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const denied = authorize(request, env);
  if (denied) return denied;
  if (!env.PUBLISH_DRIVE_SERVICE_ACCOUNT) {
    return json({ error: '공용보관함 연결 설정이 필요합니다. 휴대폰의 ZIP 선택으로도 검사할 수 있습니다.' }, 503);
  }
  if (Number(request.headers.get('Content-Length')) > 8192) return json({ error: '요청이 너무 큽니다.' }, 413);
  try {
    const input = await request.json() as { action?: string; id?: string; cursor?: string };
    if (!['list', 'download'].includes(input.action ?? '') ||
        (input.id !== undefined && !idPattern.test(input.id)) ||
        (input.cursor !== undefined && (typeof input.cursor !== 'string' || input.cursor.length > 4096))) {
      return json({ error: '보관함 선택 요청을 확인해 주세요.' }, 400);
    }
    const token = await accessToken(env.PUBLISH_DRIVE_SERVICE_ACCOUNT);
    const file = await metadata(token, input.id ?? root);
    if (!await inFolder(token, file)) return json({ error: '공용보관함 안의 폴더와 ZIP만 선택할 수 있습니다.' }, 403);

    if (input.action === 'list') {
      if (file.mimeType !== folderType) return json({ error: '폴더를 선택해 주세요.' }, 400);
      const response = await drive(token, 'files', {
        q: `'${file.id}' in parents and trashed = false and (mimeType = '${folderType}' or mimeType = 'application/zip' or mimeType = 'application/x-zip-compressed' or name contains '.zip' or name contains '.ZIP')`,
        fields: 'nextPageToken,incompleteSearch,files(id,name,mimeType,size)',
        pageSize: '100',
        orderBy: 'folder,name',
        includeItemsFromAllDrives: 'true',
        ...(input.cursor ? { pageToken: input.cursor } : {}),
      });
      const result = await response.json() as { files: DriveFile[]; nextPageToken?: string; incompleteSearch?: boolean };
      return json({ folder: { id: file.id, name: file.name }, ...result });
    }
    const size = Number(file.size);
    if (!/\.zip$/i.test(file.name) || !Number.isSafeInteger(size) || size < 1 || size > maxSize) {
      return json({ error: '16 MiB 이하의 ZIP 파일을 선택해 주세요.' }, 400);
    }
    const response = await drive(token, `files/${file.id}`, { alt: 'media' });
    const reader = response.body?.getReader();
    if (!reader) throw new Error('drive');
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    let received = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > maxSize) throw new Error('large');
        chunks.push(value as Uint8Array<ArrayBuffer>);
      }
    } finally {
      await reader.cancel();
    }
    if (received !== size) throw new Error('changed');
    return new Response(new Blob(chunks), {
      headers: { 'Content-Type': 'application/zip', 'Cache-Control': 'no-store', 'Content-Length': String(received) },
    });
  } catch {
    return json({ error: '보관함을 읽지 못했습니다. 연결 계정의 폴더 접근 권한과 설정을 확인해 주세요.' }, 502);
  }
}
