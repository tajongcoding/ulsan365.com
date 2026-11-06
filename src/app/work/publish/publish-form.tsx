'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
type Published = { commit: { url: string; oid: string }; branch: string; slug: string };
const field = 'block w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900';
const button = 'w-full rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white disabled:bg-slate-500';

export default function PublishForm() {
  const [accessKey, setAccessKey] = useState('');
  const [manuscript, setManuscript] = useState<File>();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [preview, setPreview] = useState<Preview>();
  const [published, setPublished] = useState<Published>();
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState<'check' | 'publish'>();
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = new Map(images.map(file => [file.name, URL.createObjectURL(file)]));
    setImageUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  function invalidate() {
    setPreview(undefined);
    setApproved(false);
    setPublished(undefined);
    setError('');
  }

  async function submit(action: 'check' | 'publish') {
    if (!manuscript || busy) return;
    if (action === 'check') invalidate();
    setBusy(action);
    setError('');
    try {
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
      if (action === 'publish' && preview) form.set('receipt', preview.receipt);
      const response = await fetch('/api/mobile-publish', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessKey}` },
        body: form,
      });
      if (!response.headers.get('Content-Type')?.includes('application/json')) {
        throw new Error('발행 서버에 연결할 수 없습니다.');
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
      <p>공용보관함에서 받은 Markdown 원고와 대표 1장·본문 6장을 선택하세요.</p>
      <form className="space-y-4" onSubmit={event => { event.preventDefault(); void submit('check'); }}>
        <fieldset className="space-y-4" disabled={!!busy}>
          <label className="block space-y-1">
            <span>발행 접근 키</span>
            <input className={field} type="password" autoComplete="off" required value={accessKey}
              onChange={event => { invalidate(); setAccessKey(event.target.value); }} />
          </label>
          <label className="block space-y-1">
            <span>원고 (.md)</span>
            <input className={field} type="file" accept=".md,text/markdown" required
              onChange={event => { invalidate(); setManuscript(event.target.files?.[0]); }} />
          </label>
          <label className="block space-y-1">
            <span>이미지 7장 (00~06, 파일당 최대 2 MiB)</span>
            <input className={field} type="file" multiple accept=".webp,.png,.jpg,.jpeg" required
              onChange={event => { invalidate(); setImages(Array.from(event.target.files ?? [])); }} />
          </label>
          <button className={button} disabled={!!busy || images.length !== 7} type="submit">검사 및 미리보기</button>
        </fieldset>
      </form>
      {busy && <p role="status">{busy === 'check' ? '업로드 및 검사 중…' : 'GitHub에 저장 중…'}</p>}
      {error && <p role="alert" className="text-red-800">{error}</p>}
      {preview && (
        <section className="space-y-4 rounded-xl border border-slate-300 p-4">
          <h2 className="text-xl font-bold">미리보기</h2>
          <p>{preview.date} · {preview.branch === 'main' ? '운영' : `테스트 브랜치 ${preview.branch}`}</p>
          <h3 className="text-xl font-semibold">{preview.title}</h3>
          <p>{preview.summary}</p>
          {/* File URLs exist only in this browser session. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-auto w-full rounded-lg" src={imageUrl(preview.paths[0])} alt="대표 이미지" />
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
              <label className="flex items-start gap-2">
                <input className="mt-1 size-5" type="checkbox" checked={approved} disabled={!!busy}
                  onChange={event => setApproved(event.target.checked)} />
                <span>원고와 이미지 및 발행 대상을 확인했습니다.</span>
              </label>
              <button className={button} type="button" disabled={!approved || !!busy}
                onClick={() => void submit('publish')}>
                {preview.branch === 'main' ? '운영 발행 요청' : '테스트 브랜치에 저장'}
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
            <p>배포 완료 여부는 <a className="text-blue-800 underline" href={`/blog/${published.slug}/`}>공개 글 주소</a>에서 확인하세요.</p>
          )}
        </section>
      )}
    </main>
  );
}
