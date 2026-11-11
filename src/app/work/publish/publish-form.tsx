'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { readPackage } from './read-package';

type Preview = {
  receipt: string;
  slug: string;
  branch: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  paths: string[];
};
type DriveItem = { id: string; name: string; mimeType: string; size?: string };
type DriveFolder = Pick<DriveItem, 'id' | 'name'>;
type Published = { commit: { url: string; oid: string }; branch: string; slug: string };
const field = 'block w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900';
const button = 'w-full rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white disabled:bg-slate-500';

export default function PublishForm() {
  const [accessKey, setAccessKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [manuscript, setManuscript] = useState<File>();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [preview, setPreview] = useState<Preview>();
  const [published, setPublished] = useState<Published>();
  const [liveStatus, setLiveStatus] = useState<'waiting' | 'verified' | 'pending'>('waiting');
  const [approved, setApproved] = useState(false);
  const [coverReviewed, setCoverReviewed] = useState(false);
  const [coverRatioValid, setCoverRatioValid] = useState<boolean>();
  const [busy, setBusy] = useState<'check' | 'publish' | 'zip' | 'drive'>();
  const [error, setError] = useState('');
  const [packageName, setPackageName] = useState('');
  const [driveItems, setDriveItems] = useState<DriveItem[]>([]);
  const [driveTrail, setDriveTrail] = useState<DriveFolder[]>([]);
  const [driveCursor, setDriveCursor] = useState<string>();

  useEffect(() => {
    async function refresh() {
      try {
        const response = await fetch('/api/publish-session', {cache:'no-store', signal: AbortSignal.timeout(10000)});
        const signedIn = response.ok && (await response.json()).authenticated === true;
        setAuthenticated(signedIn);
        if (!signedIn) { setPreview(undefined); setApproved(false); setCoverReviewed(false); }
      } catch { setAuthenticated(false); }
    }
    void refresh();
    window.addEventListener('ulsan-admin-session',refresh);
    window.addEventListener('focus',refresh);
    return ()=>{window.removeEventListener('ulsan-admin-session',refresh);window.removeEventListener('focus',refresh);};
  }, []);
  async function login() {
    if (authenticated) return;
    const response = await fetch('/api/publish-session', {
      method:'POST', headers:{Authorization:`Bearer ${accessKey}`}, signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '관리자 로그인에 실패했습니다.');
    setAuthenticated(true); setAccessKey('');
    window.dispatchEvent(new Event('ulsan-admin-session'));
  }
  useEffect(() => {
    const urls = new Map(images.map(file => [file.name, URL.createObjectURL(file)]));
    setImageUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!published || !preview || published.branch !== 'main') return;
    const controller = new AbortController();
    setLiveStatus('waiting');
    async function verify() {
      for (let attempt = 0; attempt < 24 && !controller.signal.aborted; attempt++) {
        try {
          const response = await fetch(`/blog/${published!.slug}/?verify=${published!.commit.oid}`, {
            cache: 'no-store', signal: controller.signal,
          });
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          const metadata = [...doc.querySelectorAll('script[type="application/ld+json"]')]
            .map(script => { try { return JSON.parse(script.textContent ?? '{}'); } catch { return {}; } });
          const heading = metadata.find(item => item['@type'] === 'BlogPosting')?.headline;
          const imagePaths = [...doc.querySelectorAll('main img')].map(image => image.getAttribute('src'));
          const ready = response.ok && heading === preview?.title &&
            preview!.paths.every(path => imagePaths.includes(path));
          if (ready) {
            const checks = await Promise.all(preview!.paths.map(path => fetch(path, {
              method: 'HEAD', cache: 'no-store', signal: controller.signal,
            })));
            if (checks.every(result => result.ok)) {
              if (!controller.signal.aborted) setLiveStatus('verified');
              return;
            }
          }
        } catch {
          if (controller.signal.aborted) return;
        }
        await new Promise<void>(resolve => {
          const timer = setTimeout(resolve, 5000);
          controller.signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
        });
      }
      if (!controller.signal.aborted) setLiveStatus('pending');
    }
    void verify();
    return () => controller.abort();
  }, [published, preview]);

  function invalidate() {
    setPreview(undefined);
    setCoverReviewed(false);
    setCoverRatioValid(undefined);
    setApproved(false);
    setPublished(undefined);
    setError('');
  }

  async function selectZip(zip: File) {
    invalidate();
    setManuscript(undefined);
    setImages([]);
    setPackageName('');
    setBusy('zip');
    try {
      const selected = await readPackage(zip);
      setManuscript(selected.manuscript);
      setImages(selected.images);
      setPackageName(zip.name);
    } catch (cause) {
      setError(cause instanceof Error && (cause.name === 'TimeoutError' || cause.name === 'AbortError') ? '응답 시간이 초과됐습니다. 다시 시도해 주세요. 공개 작업이었다면 먼저 저장 여부를 확인하세요.' : cause instanceof Error ? cause.message : 'ZIP을 읽지 못했습니다.');
    } finally {
      setBusy(undefined);
    }
  }

  async function driveRequest(input: object) {
    await login();
    const response = await fetch('/api/publish-drive', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(35000),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || '공용보관함에 연결할 수 없습니다.');
    }
    return response;
  }

  async function browse(folder?: DriveFolder, cursor?: string, trail?: DriveFolder[]) {
    setBusy('drive');
    setError('');
    try {
      const response = await driveRequest({ action: 'list', id: folder?.id, cursor });
      const result = await response.json();
      setDriveItems(previous => cursor ? [...previous, ...result.files] : result.files);
      setDriveCursor(result.nextPageToken);
      if (!cursor) setDriveTrail(trail ?? (folder ? [...driveTrail, result.folder] : [result.folder]));
      if (result.incompleteSearch) setError('목록 일부를 읽지 못했습니다. 새로고침해 주세요.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '공용보관함 목록을 읽지 못했습니다.');
    } finally {
      setBusy(undefined);
    }
  }

  async function chooseDriveZip(item: DriveItem) {
    invalidate();
    setManuscript(undefined);
    setImages([]);
    setPackageName('');
    setBusy('drive');
    setError('');
    try {
      const response = await driveRequest({ action: 'download', id: item.id });
      await selectZip(new File([await response.blob()], item.name, { type: 'application/zip' }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ZIP을 가져오지 못했습니다.');
    } finally {
      setBusy(undefined);
    }
  }

  async function submit(action: 'check' | 'publish') {
    if (!manuscript || busy) return;
    if (action === 'check') invalidate();
    setBusy(action);
    setError('');
    try {
      await login();
      if (action === 'check') {
        await Promise.all(images.map(async file => {
          const url = URL.createObjectURL(file);
          try {
            const image = new Image();
            image.src = url;
            await image.decode();
          } catch {
            throw new Error(`${file.name} 파일을 이미지로 열 수 없습니다.`);
          } finally {
            URL.revokeObjectURL(url);
          }
        }));
      }
      const form = new FormData();
      form.set('action', action);
      form.set('manuscript', manuscript);
      for (const image of images) form.append('images', image);
      if (action === 'publish' && preview) {
        form.set('receipt', preview.receipt);
        if (coverReviewed && coverRatioValid) form.set('coverReviewed', 'true');
      }
      const response = await fetch('/api/mobile-publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessKey}` },
        body: form,
        signal: AbortSignal.timeout(action === 'publish' ? 120000 : 60000),
      });
      if (!response.headers.get('Content-Type')?.includes('application/json')) {
        const message = await response.text();
        const code = message.match(/(?:Error code|error code|error)[:\s]*(\d{4})/i)?.[1];
        throw new Error(`발행 서버 오류 (HTTP ${response.status}${code ? ` · Cloudflare ${code}` : ''}). 저장 여부를 확인한 뒤 다시 검사해 주세요.`);
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (action === 'check') setPreview(result);
      else {
        setPublished(result);
        setApproved(false);
      }
    } catch (cause) {
      if (action === 'publish') invalidate();
      setError(cause instanceof Error ? cause.message : '처리 중 오류가 발생했습니다.');
    } finally {
      setBusy(undefined);
    }
  }

  function imageUrl(path: string) {
    return imageUrls.get(path.split('/').at(-1) ?? '');
  }

  return (
    <main className="mx-auto max-w-2xl space-y-5 bg-white p-4 text-slate-900 sm:p-8">
      <h1 className="text-2xl font-bold">울산365 간단 발행</h1>
      <p>공용보관함 또는 휴대폰에서 ZIP 하나를 선택한 뒤 검사 → 미리보기 → 공개 승인 순서로 진행하세요.</p>
      <form className="space-y-4" onSubmit={event => { event.preventDefault(); void submit('check'); }}>
        <fieldset className="space-y-4" disabled={!!busy}>
          {authenticated ? <p role="status" className="rounded-lg bg-green-50 p-3 text-green-900">관리자 로그인 중 · 7일간 유지</p> : <label className="block space-y-1">
            <span>발행 접근 키</span>
            <input className={field} type="password" autoComplete="off" required value={accessKey}
              onChange={event => {
                invalidate();
                setAccessKey(event.target.value);
                setDriveItems([]);
                setDriveTrail([]);
                setDriveCursor(undefined);
              }} />
          </label>}
          {!authenticated && <button className={button} type="button" disabled={!!busy || (!authenticated && accessKey.length < 32)}
            onClick={()=>{setError('');void login().catch(cause=>setError(cause instanceof Error ? cause.message : '로그인 실패'));}}>관리자 로그인</button>}
          <section className="space-y-3 rounded-xl border border-slate-300 p-3">
            <h2 className="text-lg font-bold">공용보관함</h2>
            <button className={button} type="button" disabled={!!busy || (!authenticated && accessKey.length < 32)}
              onClick={() => void browse()}>최종 WORK용 열기</button>
            {driveTrail.length > 0 && (
              <div className="space-y-2">
                <p>{driveTrail.map(folder => folder.name).join(' / ')}</p>
                <div className="flex gap-3">
                  {driveTrail.length > 1 && (
                    <button className="rounded border p-2" type="button" onClick={() => {
                      const trail = driveTrail.slice(0, -1);
                      void browse(trail.at(-1), undefined, trail);
                    }}>상위 폴더</button>
                  )}
                  <button className="rounded border p-2" type="button"
                    onClick={() => void browse(driveTrail.at(-1), undefined, driveTrail)}>새로고침</button>
                </div>
                <ul className="space-y-2">
                  {driveItems.map(item => (
                    <li key={item.id}>
                      <button className="w-full rounded-lg border p-3 text-left break-all" type="button"
                        onClick={() => item.mimeType === 'application/vnd.google-apps.folder'
                          ? void browse(item) : void chooseDriveZip(item)}>
                        {item.mimeType === 'application/vnd.google-apps.folder' ? '폴더 · ' : 'ZIP · '}{item.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {driveItems.length === 0 && <p>이 폴더에는 하위 폴더와 ZIP이 없습니다.</p>}
                {driveCursor && <button className={button} type="button"
                  onClick={() => void browse(driveTrail.at(-1), driveCursor)}>더 보기</button>}
              </div>
            )}
          </section>
          <label className="block space-y-1">
            <span>휴대폰·PC에서 ZIP 선택</span>
            <input className={field} type="file" accept=".zip,application/zip"
              onChange={event => {
                const zip = event.target.files?.[0];
                if (zip) void selectZip(zip);
                event.target.value = '';
              }} />
          </label>
          {packageName && (
            <p role="status">선택 완료 · {packageName}<br />원고 1개 · 이미지 {images.length}장</p>
          )}
          <details className="space-y-2">
            <summary className="cursor-pointer p-2">원고·이미지 개별 선택</summary>
            <label className="block space-y-1">
              <span>원고 (.md)</span>
              <input className={field} type="file" accept=".md,text/markdown"
                onChange={event => { invalidate(); setPackageName(''); setManuscript(event.target.files?.[0]); }} />
            </label>
            <label className="block space-y-1">
              <span>이미지 7장 (00~06, 파일당 최대 4 MiB)</span>
              <input className={field} type="file" multiple accept=".webp,.png,.jpg,.jpeg"
                onChange={event => { invalidate(); setPackageName(''); setImages(Array.from(event.target.files ?? [])); }} />
            </label>
          </details>
          <button className={button} disabled={!!busy || !manuscript || images.length !== 7} type="submit">검사 및 미리보기</button>
        </fieldset>
      </form>
      {busy && <p role="status">{busy === 'check' ? '업로드 및 검사 중…' : busy === 'zip' ? 'ZIP 원고와 이미지 연결 중…' :
        busy === 'drive' ? '공용보관함에서 불러오는 중…' : 'GitHub에 저장 중…'}</p>}
      {error && <p role="alert" className="text-red-800">{error}</p>}
      {preview && (
        <section className="space-y-4 rounded-xl border border-slate-300 p-4">
          <h2 className="text-xl font-bold">미리보기</h2>
          <p>{preview.date} · {preview.branch === 'main' ? '운영' : `테스트 브랜치 ${preview.branch}`}</p>
          <h3 className="text-xl font-semibold">{preview.title}</h3>
          <p>{preview.summary}</p>
          {/* File URLs exist only in this browser session. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-auto w-full rounded-lg" src={imageUrl(preview.paths[0])} alt="대표 이미지"
            onLoad={({ currentTarget: image }) => setCoverRatioValid(Math.abs(image.naturalWidth / image.naturalHeight - 16 / 9) < 0.01)} />
          <article className="prose max-w-none break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
              img: ({ src, alt }) => {
                const url = typeof src === 'string' ? imageUrl(src) : undefined;
                // eslint-disable-next-line @next/next/no-img-element
                return url ? <img src={url} alt={alt ?? '본문 이미지'} /> : null;
              },
            }}>{preview.content}</ReactMarkdown>
          </article>
          {!published && (
            <>
              {coverRatioValid === false && <p role="alert" className="text-red-800">대표 이미지를 16:9 비율로 교체해 주세요.</p>}
              <label className="flex items-start gap-2">
                <input className="mt-1 size-5" type="checkbox" checked={coverReviewed}
                  disabled={!!busy || coverRatioValid !== true}
                  onChange={event => setCoverReviewed(event.target.checked)} />
                <span>대표 이미지를 별도로 검수했습니다. 제목·일정·대상·혜택·장소를 공식 자료와 대조하고 모바일에서 문구가 읽히며 잘리지 않는지 확인했습니다.</span>
              </label>
              <label className="flex items-start gap-2">
                <input className="mt-1 size-5" type="checkbox" checked={approved} disabled={!!busy}
                  onChange={event => setApproved(event.target.checked)} />
                <span>원고와 이미지 및 발행 대상을 확인했습니다.</span>
              </label>
              <button className={button} type="button" disabled={!approved || !coverReviewed || !coverRatioValid || !!busy}
                onClick={() => void submit('publish')}>
                {preview.branch === 'main' ? '공개 승인 및 발행' : '테스트 발행 승인'}
              </button>
            </>
          )}
        </section>
      )}
      {published && (
        <section role="status" className="space-y-2 rounded-xl border border-green-700 p-4">
          <p>원고와 이미지 7장 저장 완료 · {published.branch}</p>
          <a className="text-blue-800 underline" href={published.commit.url}>저장된 커밋 확인</a>
          {published.branch === 'main' && (
            <p>{liveStatus === 'verified' ? '공개 확인 완료 · 원고와 이미지 7장' :
              liveStatus === 'waiting' ? '홈페이지 배포 확인 중…' : '배포 확인 대기 · 공개 주소를 확인해 주세요.'} <a className="text-blue-800 underline" href={`/blog/${published.slug}/`}>공개 글 주소</a></p>
          )}
        </section>
      )}
    </main>
  );
}
