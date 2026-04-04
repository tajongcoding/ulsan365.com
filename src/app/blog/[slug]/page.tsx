import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { notFound } from 'next/navigation';
import CoupangBanner from '@/components/CoupangBanner';
import Link from 'next/link';

// 빌드 시 존재하는 모든 slug를 미리 생성 (정적 페이지 생성)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// 각 페이지의 SEO 메타 정보 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | 울산광역시 생활 정보통`,
    description: post.summary,
    openGraph: {
      title: `${post.title} | 울산광역시 생활 정보통`,
      description: post.summary,
      url: `https://my-local-info.pages.dev/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["울산광역시 생활 정보통 에디터"],
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.summary,
    author: {
      '@type': 'Organization',
      name: '울산광역시 생활 정보통',
    },
    publisher: {
      '@type': 'Organization',
      name: '울산광역시 생활 정보통',
      logo: {
        '@type': 'ImageObject',
        url: 'https://my-local-info.pages.dev/favicon.ico',
      },
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://my-local-info.pages.dev' },
      { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://my-local-info.pages.dev/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://my-local-info.pages.dev/blog/${post.slug}` },
    ],
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
      {/* 본문 읽기 영역 (너무 넓어지면 가독성이 떨어지므로 가운데 4xl로 제한) */}
      <div className="max-w-4xl mx-auto">
        {/* 뒤로 가기 버튼 */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[15px] font-bold text-slate-500 hover:text-[#0F1A2B] transition-colors mb-8"
        >
          ← 목록으로 돌아가기
        </Link>

        {/* 글 헤더 영역 */}
        <header className="mb-10">

          {/* 카테고리 뱃지 */}
          <span className="inline-flex items-center text-[13px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>

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

          {/* 요약 박스 */}
          {post.summary && (
            <div className="bg-slate-50 border-l-4 border-[#0F1A2B] rounded-r-xl px-6 py-4 shadow-sm hover:border-[#C9A857] transition-colors">
              <p className="text-[15px] font-medium text-[#374151] leading-relaxed break-keep m-0">
                {post.summary}
              </p>
            </div>
          )}
        </header>

        {/* 구분선 */}
        <hr className="mb-10 border-slate-200" />

        {/* 마크다운 본문 렌더링 - 단락 여백 감소, 요약 박스 테두리 폭발적 디자인, 리스트 점 제거 */}
        <article className="prose prose-lg prose-blue prose-slate max-w-none prose-p:my-4 prose-p:leading-relaxed prose-headings:font-black prose-headings:text-[#0F1A2B] prose-headings:mt-10 prose-a:text-[#C9A857] prose-blockquote:not-italic prose-blockquote:border-[3px] prose-blockquote:!border-l-[3px] prose-blockquote:border-[#0F1A2B] prose-blockquote:bg-slate-50 prose-blockquote:shadow-sm prose-blockquote:rounded-[20px] prose-blockquote:py-5 prose-blockquote:px-8 prose-blockquote:text-[#1F2937] prose-blockquote:mt-8 prose-ul:list-none prose-ul:pl-0 prose-img:rounded-xl prose-img:w-full break-keep">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>

      {/* 쿠팡 파트너스 배너 (메인 페이지와 동일한 전체 폭(6xl) 적용을 위해 div 밖으로 분리) */}
      <div className="mt-16">
        <CoupangBanner />
      </div>

      {/* 하단 뒤로 가기 */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200 flex justify-center">
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
