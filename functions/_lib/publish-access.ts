export type PublishAccessEnv = { PUBLISH_ACCESS_KEY?: string };

export function json(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function authorize(request: Request, env: PublishAccessEnv) {
  const key = env.PUBLISH_ACCESS_KEY;
  if (!key || key.length < 32) return json({ error: '발행 접근 키 설정이 필요합니다.' }, 503);
  const actual = request.headers.get('Authorization') ?? '';
  const expected = `Bearer ${key}`;
  let difference = actual.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) difference |= (actual.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
  if (difference || request.headers.get('Origin') !== new URL(request.url).origin) {
    return json({ error: '발행 접근 키를 확인해 주세요.' }, 403);
  }
}
