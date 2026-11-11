import { Buffer } from 'node:buffer';
import { load } from 'js-yaml';
import { authorize, json } from '../_lib/publish-access';

type Env = {
  PUBLISH_ACCESS_KEY?: string;
  PUBLISH_GITHUB_TOKEN?: string;
  PUBLISH_BRANCH?: string;
};
type Context = { request: Request; env: Env };
type Addition = { path: string; contents: string };
const repository = 'tajongcoding/ulsan365.com';
const categories = ['복지 정보', '경제 정보', '생활 정보', '행사·축제', '관광·명소'];
const MiB = 1024 * 1024;
async function digest(bytes: ArrayBuffer) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}

function base64(bytes: Uint8Array) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
}

async function github<T>(token: string, query: string, variables: object): Promise<T> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ULSAN365-Mobile-Publish',
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json() as { data?: T; errors?: { type?: string }[] };
  if (result.errors?.some(error => error.type === 'STALE_DATA')) {
    throw new Error('브랜치가 갱신됐습니다. 다시 검사해 주세요.');
  }
  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error('GitHub 처리에 실패했습니다. 다시 검사해 저장 여부를 확인해 주세요.');
  }
  return result.data;
}

export async function onRequestPost({ request, env }: Context) {
  const { PUBLISH_ACCESS_KEY: key, PUBLISH_GITHUB_TOKEN: token, PUBLISH_BRANCH: branch } = env;
  if (!key || key.length < 32 || !token || !branch) {
    return json({ error: '발행 서버 설정이 필요합니다.' }, 503);
  }
  const denied = authorize(request, env);
  if (denied) return denied;
  const size = Number(request.headers.get('Content-Length'));
  if (!Number.isSafeInteger(size) || size <= 0 || size > 16 * MiB) return json({ error: '전체 업로드는 16 MiB 이하여야 합니다.' }, 413);

  try {
    const form = await request.formData();
    const action = form.get('action');
    const manuscript = form.get('manuscript');
    if ((action !== 'check' && action !== 'publish') || !(manuscript instanceof File) ||
        !manuscript.size || manuscript.size > 256 * 1024 ||
        !/^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(manuscript.name) ||
        manuscript.name.length > 125) {
      return json({ error: '날짜로 시작하는 Markdown 원고(.md, 최대 256 KiB)를 선택해 주세요.' }, 400);
    }
    const slug = manuscript.name.slice(0, -3);
    const date = slug.slice(0, 10);
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
    const parsedDate = new Date(date);
    if (!Number.isFinite(+parsedDate) || parsedDate.toISOString().slice(0, 10) !== date || date > today) {
      return json({ error: '게시일은 실제 날짜이며 한국 시간 기준 오늘까지여야 합니다.' }, 400);
    }
    const source = await manuscript.arrayBuffer();
    const markdown = new TextDecoder('utf-8', { fatal: true }).decode(source);
    const header = markdown.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!header) return json({ error: '원고 상단에 YAML 메타데이터가 필요합니다.' }, 400);
    const parsed = load(header[1]);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return json({ error: '원고의 YAML 메타데이터를 확인해 주세요.' }, 400);
    }
    const data = parsed as Record<string, unknown>;
    const content = markdown.slice(header[0].length);
    const postDate = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
    if (postDate !== date || (data.pubDate !== undefined && data.pubDate !== date) ||
        typeof data.title !== 'string' || !data.title.trim() ||
        typeof data.summary !== 'string' || !data.summary.trim() ||
        typeof data.category !== 'string' || !categories.includes(data.category) ||
        !Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === 'string') ||
        data.bodyImagesPending || !content.trim() ||
        /<\/?[a-z][^<>]*>|<!--/i.test(content.replace(/<https?:\/\/[^<>]+>/g, ''))) {
      return json({ error: '제목, 요약, 날짜, 카테고리, 태그와 본문을 확인해 주세요. 본문은 Markdown 형식으로 입력해야 합니다.' }, 400);
    }

    const assets = form.getAll('images');
    const paths: string[] = [];
    const hashes = [await digest(source)];
    const postPath = `src/content/posts/${slug}.md`;
    const additions: Addition[] = action === 'publish' ? [{ path: postPath, contents: base64(new Uint8Array(source)) }] : [];
    if (assets.length !== 7 || !Array.isArray(data.images) || data.images.length !== 7) {
      return json({ error: '대표 1장과 본문 6장, 총 7장 및 원고의 images 목록이 필요합니다.' }, 400);
    }
    for (const [index, imagePath] of data.images.entries()) {
      if (typeof imagePath !== 'string') return json({ error: '이미지 경로를 확인해 주세요.' }, 400);
      const asset = assets.find(file => file instanceof File && `/images/info/${date}/${file.name}` === imagePath);
      const prefix = `${slug}-0${index}.`;
      if (!(asset instanceof File) || !asset.name.startsWith(prefix) ||
          !asset.size || asset.size > 4 * MiB) {
        return json({ error: `${index + 1}번째 이미지의 이름, 경로 또는 크기(최대 4 MiB)를 확인해 주세요.` }, 400);
      }
      const imageBytes = await asset.arrayBuffer();
      const bytes = new Uint8Array(imageBytes);
      const signature = new TextDecoder().decode(bytes.subarray(0, 12));
      const extension = asset.name.slice(prefix.length);
      const supported = (extension === 'webp' && signature.startsWith('RIFF') && signature.slice(8) === 'WEBP') ||
        (extension === 'png' && bytes[0] === 137 && signature.slice(1, 8) === 'PNG\r\n\x1a\n') ||
        ((extension === 'jpg' || extension === 'jpeg') && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255);
      if (!supported) return json({ error: `${asset.name}의 이미지 형식이 올바르지 않습니다.` }, 400);
      const hash = await digest(imageBytes);
      if (hashes.includes(hash)) return json({ error: '동일한 이미지 파일이 포함되어 있습니다.' }, 400);
      hashes.push(hash);
      paths.push(imagePath);
      if (action === 'publish') additions.push({ path: `public${imagePath}`, contents: base64(bytes) });
    }
    const mapped = [...content.matchAll(/^\s*!\[[^\]\n]*\]\(([^\s)]+)\)\s*$/gm)].map(match => match[1]);
    const imageMarkers = [...content.matchAll(/!\[/g)].length;
    if (imageMarkers !== 6 || JSON.stringify(mapped) !== JSON.stringify(paths.slice(1))) {
      return json({ error: '본문에 01~06 이미지를 각각 한 번씩 순서대로 배치해 주세요.' }, 400);
    }

    const filePaths = [postPath, ...paths.map(path => `public${path}`)];
    const variables = Object.fromEntries(filePaths.map((path, index) => [`p${index}`, `${branch}:${path}`]));
    const { repository: state } = await github<{ repository: Record<string, unknown> & { ref?: { target?: { oid?: string } } } }>(
      token,
      `query($ref: String!, ${filePaths.map((_, i) => `$p${i}: String!`).join(', ')}) {
        repository(owner:"tajongcoding", name:"ulsan365.com") {
          ref(qualifiedName:$ref) { target { oid } }
          ${filePaths.map((_, i) => `f${i}: object(expression:$p${i}) { oid }`).join('\n')}
        }
      }`,
      { ref: `refs/heads/${branch}`, ...variables },
    );
    const head = state?.ref?.target?.oid;
    if (!head) return json({ error: '발행 대상 브랜치에 접근할 수 없습니다.' }, 503);
    if (filePaths.some((_, i) => state[`f${i}`])) {
      return json({ error: '같은 주소의 글 또는 이미지가 이미 저장되어 있습니다.' }, 409);
    }

    const receipt = await digest(new TextEncoder().encode([head, slug, ...hashes].join(':')).buffer);
    if (action === 'check') {
      return json({ receipt, slug, branch, title: data.title, date, summary: data.summary, content, paths });
    }
    if (form.get('coverReviewed') !== 'true') {
      return json({ error: '대표 이미지 검수를 먼저 완료해 주세요.' }, 400);
    }
    if (form.get('receipt') !== receipt) {
      return json({ error: '원고, 이미지 또는 브랜치가 바뀌었습니다. 다시 검사해 주세요.' }, 409);
    }

    const { createCommitOnBranch } = await github<{ createCommitOnBranch: { commit: { url: string; oid: string } } }>(
      token,
      'mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input:$input) { commit { oid url } } }',
      { input: {
        branch: { repositoryNameWithOwner: repository, branchName: branch },
        expectedHeadOid: head,
        message: { headline: `Publish ULSAN365 post: ${slug}` },
        fileChanges: { additions },
      } },
    );
    return json({ commit: createCommitOnBranch.commit, branch, slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.startsWith('GitHub') || message.startsWith('브랜치')) return json({ error: message }, 502);
    return json({ error: '업로드를 읽을 수 없습니다. UTF-8 Markdown과 이미지 파일을 확인해 주세요.' }, 400);
  }
}
