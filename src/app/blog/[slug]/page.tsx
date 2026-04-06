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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    image: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
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
                {visuals.categoryLabel}
              </span>
              <span className={`text-[11px] font-black tracking-[0.18em] uppercase ${visuals.accentClass}`}>
                {visuals.toneName}
              </span>
            </div>
            <p className="text-[13px] md:text-[14px] font-semibold text-slate-600 break-keep">
              {visuals.toneDescription} 중심으로 울산 느낌이 살아있는 이미지를 보여줍니다.
            </p>
          </div>
        </section>

        {/* 글 헤더 영역 */}
        <header className="mb-10">
          {/* 상단 네비게이션 - 목록 가기 버튼과 카테고리 태그를 나란히 맨 왼쪽에 배치 */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
            >
              ← 목록으로 돌아가기
            </Link>

            {/* 카테고리 뱃지 - 목록 가기와 나란히 배치 */}
            <span className="inline-flex items-center text-[15px] md:text-[16px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full">
              {visuals.categoryLabel}
            </span>
          </div>

          {/* 제목 */}
          <h1 className="text-[26px] md:text-[32px] font-black text-[#0F1A2B] mb-4 leading-snug break-keep">{post.title}</h1>

          {/* 날짜 + 태그 */}
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mb-6">
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">
              📅 {post.date}
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full text-[12px]">
                #{tag}
              </span>
            ))}
          </div>

          {/* 요약 박스 (서제목 역할을 하므로 본문과 동일한 18px 크기 적용) */}
          {post.summary && (
            <div className="bg-slate-50 border-l-4 border-[#0F1A2B] rounded-r-xl px-6 py-4 shadow-sm hover:border-[#C9A857] transition-colors mb-4">
              <p className="text-[18px] font-medium text-[#374151] leading-relaxed break-keep m-0">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {visuals.galleryImages.length > 0 && (
          <section className="mb-10">
            <div className={`bg-gradient-to-br ${visuals.surfaceClass} border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm`}>
              <div className="mb-4">
                <p className="text-[12px] font-black tracking-widest text-[#C9A857] uppercase mb-2">본문 고정 이미지</p>
                <h2 className="text-[20px] md:text-[24px] font-black text-[#0F1A2B] break-keep">
                  글 내용과 맞는 이미지 미리보기 {visuals.galleryImages.length}장
                </h2>
                <p className={`mt-1 text-[13px] font-bold ${visuals.accentClass}`}>
                  {visuals.toneName} · {visuals.toneDescription}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {visuals.galleryImages.slice(0, 4).map((image, index) => (
                  <figure key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={image}
                      alt={`${post.title} 관련 이미지 ${index + 1}`}
                      className="w-full h-[84px] md:h-[120px] object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-[#0F1A2B]/80 px-2 py-1 text-[10px] md:text-[11px] font-bold text-white">
                      {index + 1}컷
                    </span>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 구분선 */}
        <hr className="mb-10 border-slate-200" />

        {/* 마크다운 본문 렌더링 - 단락 여백 감소, 요약 박스 테두리 폭발적 디자인, 리스트 점 제거 */}
        <article className="prose prose-base md:prose-lg prose-blue prose-slate max-w-none prose-p:my-4 prose-p:leading-relaxed prose-headings:font-black prose-headings:text-[#0F1A2B] prose-headings:mt-9 prose-a:text-[#C9A857] prose-blockquote:not-italic prose-blockquote:border-[3px] prose-blockquote:!border-l-[3px] prose-blockquote:border-[#0F1A2B] prose-blockquote:bg-slate-50 prose-blockquote:shadow-sm prose-blockquote:rounded-[20px] prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:text-[#1F2937] prose-blockquote:mt-8 prose-ul:list-none prose-ul:pl-0 prose-img:rounded-xl prose-img:w-full break-keep">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>

      {relatedPosts.length > 0 && (
        <section className={`${contentWidthClass} mt-12`}>
          <div className="flex items-end justify-between gap-4 mb-5 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">같이 보면 좋은 글</h2>
              <p className="text-slate-500 mt-1 break-keep">같은 주제의 관련 정보를 이어서 확인해 보세요.</p>
            </div>
            <Link href={`/blog?category=${post.category}`} className="hidden md:inline-flex text-[15px] font-bold text-[#0F1A2B] hover:text-[#C9A857] transition-colors">
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
