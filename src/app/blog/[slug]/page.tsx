import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import CoupangBanner from '@/components/CoupangBanner';
import Link from 'next/link';
import { getPostVisuals } from '@/lib/postVisuals';
import { absoluteUrl, buildPostSeoTitle, siteConfig } from '@/lib/site';

// 빌드 시 존재하는 모든 slug를 미리 생성 (정적 페이지 생성)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// 각 페이지의 SEO 메타 정보 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const pageTitle = buildPostSeoTitle(post.title, post.category);
  const description = post.summary || post.contentExcerpt || '울산 시민을 위한 지역 생활 정보 상세 안내입니다.';
  const visuals = getPostVisuals(post);
  const ogImage = visuals.heroImage || post.thumbnailUrl || absoluteUrl(siteConfig.ogImage);

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: absoluteUrl(`/blog/${post.slug}`),
    },
    keywords: [...post.tags, '울산 생활정보', `${post.category} 정보`],
    openGraph: {
      title: pageTitle,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: 'article',
      publishedTime: post.date,
      authors: ['울산광역시 생활 정보통 에디터'],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

function replacePostImagesWithMatchedGallery(
  content: string,
  images: string[],
  title: string,
  heroImage?: string | null,
) {
  const MAX_BODY_IMAGES = 6;

  const imageIdentity = (src: string) =>
    src
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\?.*$/, '')
      .replace(/#.*$/, '');

  const used = new Set<string>();

  if (heroImage) {
    used.add(imageIdentity(heroImage));
  }

  const collectedImages: string[] = [];

  // 기존 Markdown 본문 이미지는 URL을 보존하되 원래 위치에서는 제거한다.
  // 이후 최대 6장을 본문 흐름에 맞게 다시 분산 배치한다.
  const standaloneMarkdownImagePattern =
    /^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/gm;

  let cleanedContent = content.replace(
    standaloneMarkdownImagePattern,
    (fullMatch: string, _alt: string, src: string) => {
      const cleanSrc = src.trim();
      if (!cleanSrc) return '';

      const key = imageIdentity(cleanSrc);

      if (used.has(key)) {
        return '';
      }

      used.add(key);

      if (collectedImages.length < MAX_BODY_IMAGES) {
        collectedImages.push(fullMatch.trim());
      }

      return '';
    },
  );

  cleanedContent = cleanedContent
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 기존 Markdown 이미지가 6장보다 부족할 때만 postVisuals 이미지로 보충한다.
  for (const src of images) {
    if (collectedImages.length >= MAX_BODY_IMAGES) break;
    if (!src) continue;

    const key = imageIdentity(src);

    if (used.has(key)) continue;

    used.add(key);

    const imageNumber = collectedImages.length + 1;
    const safeAlt = `${title} 본문 이미지 ${imageNumber}`
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    collectedImages.push(
      `<img src="${src}" alt="${safeAlt}" style="width:100%; max-width:760px; height:auto; margin:32px auto; display:block; border-radius:14px;" />`,
    );
  }

  if (!collectedImages.length || !cleanedContent) {
    return cleanedContent;
  }

  const blocks = cleanedContent
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const stopInsertPattern =
    /^##\s*(공식\s*상세출처|공식\s*출처|FAQ|자주\s*묻는\s*질문|문의|관련\s*링크|CTA)\b/i;

  const stopIndex = blocks.findIndex((block) =>
    stopInsertPattern.test(block),
  );

  const safeBlockCount =
    stopIndex === -1 ? blocks.length : stopIndex;

  if (safeBlockCount <= 0) {
    return cleanedContent;
  }

  const imageCount = collectedImages.length;

  // 같은 위치가 계산되어도 이미지가 덮어써지지 않도록 배열로 보관한다.
  const insertAfter = new Map<number, string[]>();

  for (let i = 0; i < imageCount; i += 1) {
    const position = Math.floor(
      ((i + 1) * safeBlockCount) / (imageCount + 1),
    );

    const safePosition = Math.min(
      Math.max(position, 0),
      safeBlockCount - 1,
    );

    const existing = insertAfter.get(safePosition) ?? [];
    existing.push(collectedImages[i]);
    insertAfter.set(safePosition, existing);
  }

  const result: string[] = [];

  blocks.forEach((block, index) => {
    result.push(block);

    const positionedImages = insertAfter.get(index) ?? [];
    positionedImages.forEach((image) => {
      result.push(image);
    });
  });

  return result.join('\n\n');
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // 해당 글이 없으면 404 페이지로 이동
  if (!post) {
    notFound();
  }

  const relatedPosts = getAllPosts()
    .filter((item) => item.slug !== post.slug && item.category === post.category)
    .slice(0, 3);
  const visuals = getPostVisuals(post);
  const bodyGalleryImages = visuals.galleryImages.filter((image) => image !== visuals.heroImage);
  const renderedContent = replacePostImagesWithMatchedGallery(
    post.content,
    bodyGalleryImages,
    post.title,
    visuals.heroImage,
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    image: visuals.heroImage ? [visuals.heroImage] : undefined,
    author: {
      '@type': 'Organization',
      name: '울산광역시 생활 정보통',
    },
    publisher: {
      '@type': 'Organization',
      name: '울산광역시 생활 정보통',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/favicon.ico'),
      },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: '블로그', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  const contentWidthClass = 'mx-auto w-full max-w-[860px]';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-6 py-7 md:py-9">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
      {/* 본문 읽기 영역 - 좌우 균형을 맞추기 위해 전체 폭을 조금 넓혀 통일 */}
      <div className={contentWidthClass}>
        <section className="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <img
            src={visuals.heroImage}
            alt={post.title}
            className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover"
          />
          <div className={`px-5 py-4 bg-gradient-to-r ${visuals.surfaceClass} border-t border-slate-200`}>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${visuals.badgeClass}`}>
                {post.category}
              </span>
            </div>
          </div>
        </section>

        {/* 글 헤더 영역 */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
            >
              ← 목록으로 돌아가기
            </Link>

            <span className="inline-flex items-center text-[15px] md:text-[16px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full">
              {post.category}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mb-6">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">
              📅 {post.date}
            </span>
            {(post.tags || []).map((tag) => (
              <span key={tag} className="inline-flex items-center bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full text-[12px]">
                #{tag}
              </span>
            ))}
          </div>

          {post.summary && (
            <div className="bg-slate-50 border-l-4 border-[#0F1A2B] rounded-r-xl px-6 py-4 shadow-sm hover:border-[#C9A857] transition-colors mb-4">
              <p className="text-[18px] font-medium text-[#374151] leading-relaxed break-keep m-0">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {/* 구분선 */}
        <hr className="mb-10 border-slate-200" />

        {/* 마크다운 본문 렌더링 - 단락 여백 감소, 요약 박스 테두리 폭발적 디자인, 리스트 점 제거 */}
        <article className="prose prose-base md:prose-lg prose-blue prose-slate max-w-none prose-p:my-4 prose-p:leading-relaxed prose-headings:font-black prose-headings:text-[#0F1A2B] prose-headings:mt-9 prose-a:text-[#C9A857] prose-blockquote:not-italic prose-blockquote:border-[3px] prose-blockquote:!border-l-[3px] prose-blockquote:border-[#0F1A2B] prose-blockquote:bg-slate-50 prose-blockquote:shadow-sm prose-blockquote:rounded-[20px] prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:text-[#1F2937] prose-blockquote:mt-8 prose-ul:list-none prose-ul:pl-0 prose-img:rounded-xl prose-img:w-full prose-img:max-w-[760px] prose-img:h-auto prose-img:mx-auto break-keep">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {renderedContent}
          </ReactMarkdown>
        </article>

        <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600 leading-relaxed break-keep">
          본 정보는 울산광역시 및 공공데이터를 참고하여 정리한 콘텐츠입니다.
        </p>
      </div>

      {relatedPosts.length > 0 && (
        <section className={`${contentWidthClass} mt-12`}>
          <div className="flex items-end justify-between gap-4 mb-5 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">같이 보면 좋은 글</h2>
              <p className="text-slate-500 mt-1 break-keep">같은 주제의 관련 정보를 이어서 확인해 보세요.</p>
            </div>
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hidden md:inline-flex text-[15px] font-bold text-[#0F1A2B] hover:text-[#C9A857] transition-colors">
              더 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:border-[#C9A857] hover:shadow-md transition-all"
              >
                <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[12px] font-bold text-[#0F1A2B] mb-3">
                  {item.category}
                </div>
                <h3 className="text-[17px] font-extrabold text-[#0F1A2B] leading-snug break-keep line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] text-slate-500 line-clamp-3 break-keep">
                  {item.summary || item.contentExcerpt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 쿠팡 파트너스 배너 (문맥형 버전) */}
      <div className="mt-16">
        <CoupangBanner variant="compact" />
      </div>

      {/* 하단 뒤로 가기 */}
      <div className={`${contentWidthClass} mt-14 pt-7 border-t border-slate-200 flex justify-center`}>
        <Link
          href="/blog"
          className="bg-[#0F1A2B] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C9A857] transition-colors shadow-sm"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
