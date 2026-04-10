import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import CoupangBanner from '@/components/CoupangBanner';
import GoogleAdSlot from '@/components/GoogleAdSlot';
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
    .slice(0, 5);
  const visuals = getPostVisuals(post);
  const contentImagesMatches = Array.from(post.content.matchAll(/<img[^>]*src="([^"]+)"/ig));
  const rawGalleryImages = [
    visuals.heroImage,
    ...(visuals.galleryImages || []),
    ...contentImagesMatches.map((m) => m[1]),
  ].filter(Boolean);
  const galleryImages = Array.from(new Set(rawGalleryImages)).slice(0, 6);

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
            <div className={`p-5 md:p-6 bg-gradient-to-r ${visuals.surfaceClass} border-t border-slate-200`}>
              <div className="flex flex-wrap items-center gap-3 mb-2.5">
                <span className={`inline-flex rounded-md px-3.5 py-1.5 text-[14px] md:text-[15px] font-black shadow-sm ${visuals.badgeClass}`}>
                  {visuals.categoryLabel}
                </span>
                <span className={`text-[15px] md:text-[16px] font-black tracking-[0.18em] uppercase ${visuals.accentClass}`}>
                  {visuals.toneName}
                </span>
              </div>
              <p className="text-[14px] md:text-[15px] font-bold text-slate-700 break-keep mb-5">
                {visuals.toneDescription} 중심으로 울산 느낌이 살아있는 이미지를 보여줍니다.
              </p>
              
              <Link
                href="/blog"
                className={`inline-flex items-center gap-1.5 text-[14px] md:text-[15px] font-black ${visuals.badgeClass} px-5 py-2.5 rounded-md hover:-translate-y-0.5 transition-all shadow-sm`}
              >
                ← 목록으로 돌아가기
              </Link>
            </div>
          </section>

          {/* 글 헤더 영역 */}
          <header className="mb-10">
            {/* 제목 */}
            <h1 className="text-[26px] md:text-[32px] font-black text-[#0F1A2B] mb-5 leading-snug break-keep">{post.title}</h1>

            {/* 날짜 + 태그 */}
            <div className="flex flex-wrap items-center gap-2.5 mb-7">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-bold px-4 py-1.5 rounded-full text-[14px] md:text-[15px] shadow-sm">
                📅 {post.date}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center bg-white border border-slate-200 text-slate-600 font-bold px-3.5 py-1.5 rounded-full text-[13px] md:text-[14px] shadow-sm">
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

        {galleryImages.length > 0 && (
          <section className="mb-10">
            <div className={`bg-gradient-to-br ${visuals.surfaceClass} border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm`}>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {galleryImages.map((image, index) => (
                  <figure key={`${image}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={image}
                      alt={`${post.title} 관련 이미지 ${index + 1}`}
                      className="w-full h-[120px] md:h-[180px] object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-[#0F1A2B]/80 px-2 py-1 text-[11px] md:text-[12px] font-bold text-white shadow-sm">
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

      <div className={`${contentWidthClass} mt-10`}>
        <GoogleAdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST}
          label="본문 하단 스폰서 배너"
        />
      </div>

      {relatedPosts.length > 0 && (
        <section className={`${contentWidthClass} mt-12`}>
          <div className="flex items-end justify-between gap-4 mb-5 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">📖 같이 보면 좋은 글</h2>
              <p className="text-slate-500 mt-1 break-keep">같은 주제의 관련 정보를 이어서 확인해 보세요.</p>
            </div>
              <Link href={`/blog?category=${post.category}`} className="hidden md:inline-flex items-center text-[14px] md:text-[15px] font-bold text-slate-700 bg-white border border-slate-300 px-4 py-1.5 rounded-md hover:bg-slate-50 hover:text-[#0F1A2B] transition-all shadow-sm">
                더 보기 →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {relatedPosts.map((item) => {
                const { heroImage, categoryLabel, badgeClass } = getPostVisuals(item);

                return (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#C9A857] hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-[88px] sm:h-[92px] sm:w-[128px] sm:min-w-[128px] overflow-hidden bg-slate-100">
                        <img
                          src={heroImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute left-2 top-2 inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-black shadow-sm ${badgeClass}`}>
                          {categoryLabel}
                        </span>
                      </div>

                      <div className="flex-1 p-2.5 sm:p-3">
                      <div className="flex flex-wrap items-center gap-1 mb-1.5 text-[10px] text-slate-500">
                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-semibold">
                          📅 {item.date}
                        </span>
                        {item.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex rounded-full bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-[14px] md:text-[15px] font-black text-[#0F1A2B] leading-snug break-keep line-clamp-2 group-hover:text-[#C9A857] transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[12px] md:text-[13px] text-slate-600 leading-relaxed break-keep line-clamp-2">
                        {item.summary || item.contentExcerpt || '핵심 내용을 보기 쉽게 정리한 생활 정보 안내입니다.'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 쿠팡 파트너스 배너 (문맥형 버전) */}
      <div className="mt-16">
        <CoupangBanner variant="compact" topic={post.category} />
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
