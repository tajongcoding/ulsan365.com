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
import { getApplicationStatus } from '@/lib/applicationStatus';

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

type ContentImage = {
  alt: string;
  src: string;
};

type ContentSection = {
  body: string;
  image?: ContentImage;
  key: string;
};

const MAX_BODY_IMAGES = 6;

function imageIdentity(src: string) {
  return src
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\?.*$/, '')
    .replace(/#.*$/, '');
}

function parseStandaloneImage(block: string): ContentImage | null {
  const markdownMatch = block.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);

  if (markdownMatch?.[2]) {
    return {
      alt: markdownMatch[1]?.trim() || '본문 이미지',
      src: markdownMatch[2].trim(),
    };
  }

  const htmlMatch = block.match(/^\s*<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*$/i);

  if (htmlMatch?.[1]) {
    const altMatch = block.match(/\balt=["']([^"']*)["']/i);

    return {
      alt: altMatch?.[1]?.trim() || '본문 이미지',
      src: htmlMatch[1].trim(),
    };
  }

  return null;
}

function shouldStartSection(block: string) {
  return /^##\s+/.test(block.trim());
}

function shouldReceiveFallbackImage(section: ContentSection) {
  return !/^##\s*(공식\s*상세출처|공식\s*출처|공식\s*확인|FAQ|자주\s*묻는\s*질문|문의|관련\s*링크|CTA)\b/i.test(
    section.body.trim(),
  );
}

function splitContentBlocks(content: string) {
  const blocks: string[] = [];
  const lines: string[] = [];

  const flushLines = () => {
    const block = lines.join('\n').trim();

    if (block) {
      blocks.push(block);
    }

    lines.length = 0;
  };

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushLines();
      return;
    }

    if (parseStandaloneImage(trimmedLine)) {
      flushLines();
      blocks.push(trimmedLine);
      return;
    }

    lines.push(line);
  });

  flushLines();

  return blocks;
}

function buildContentSections(
  content: string,
  images: string[],
  title: string,
  heroImage?: string | null,
): ContentSection[] {
  const used = new Set<string>();

  if (heroImage) {
    used.add(imageIdentity(heroImage));
  }

  const blocks = splitContentBlocks(content);

  const fallbackImages = images
    .filter(Boolean)
    .filter((src, index, source) => source.indexOf(src) === index)
    .filter((src) => !used.has(imageIdentity(src)))
    .slice(0, MAX_BODY_IMAGES);

  let fallbackIndex = 0;
  const pendingImages: ContentImage[] = [];
  let bodyImageCount = 0;
  let current: ContentSection | null = null;
  const sections: ContentSection[] = [];

  const finishCurrent = () => {
    if (current?.body.trim()) {
      sections.push(current);
    }

    current = null;
  };

  const startCurrent = (block: string) => {
    current = {
      body: block,
      image: pendingImages.shift(),
      key: `content-section-${sections.length}`,
    };
  };

  const appendBlock = (block: string) => {
    if (!current) {
      startCurrent(block);
      return;
    }

    current.body = `${current.body}\n\n${block}`;
  };

  blocks.forEach((block) => {
    const parsedImage = parseStandaloneImage(block);

    if (parsedImage) {
      const key = imageIdentity(parsedImage.src);

      if (!used.has(key) && bodyImageCount < MAX_BODY_IMAGES) {
        used.add(key);
        bodyImageCount += 1;

        if (current && !current.image) {
          current.image = parsedImage;
        } else {
          pendingImages.push(parsedImage);
        }
      }

      return;
    }

    if (shouldStartSection(block)) {
      finishCurrent();
      startCurrent(block);
      return;
    }

    appendBlock(block);
  });

  finishCurrent();

  if (pendingImages.length > 0 && sections.length > 0 && !sections[sections.length - 1].image) {
    sections[sections.length - 1].image = pendingImages.shift();
  }

  sections.forEach((section) => {
    if (section.image || !shouldReceiveFallbackImage(section)) {
      return;
    }

    let src: string | undefined;

    while (fallbackIndex < fallbackImages.length) {
      const candidate = fallbackImages[fallbackIndex];
      fallbackIndex += 1;

      if (!used.has(imageIdentity(candidate))) {
        src = candidate;
        break;
      }
    }

    if (!src) {
      return;
    }

    used.add(imageIdentity(src));
    section.image = {
      alt: `${title} 본문 이미지 ${fallbackIndex}`,
      src,
    };
  });

  return sections.length ? sections : [{ body: content.trim(), key: 'content-section-0' }];
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {content}
    </ReactMarkdown>
  );
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
  const applicationStatus = getApplicationStatus(post);
  const bodyGalleryImages = visuals.galleryImages.filter((image) => image !== visuals.heroImage);
  const contentSections = buildContentSections(
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

  const contentWidthClass = 'mx-auto w-full max-w-[1040px]';

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
            className="w-full aspect-video object-cover"
            loading="eager"
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
            {applicationStatus && (
              <span className={`inline-flex items-center border px-4 py-1.5 rounded-full text-[15px] md:text-[16px] font-extrabold ${applicationStatus.className}`}>
                {applicationStatus.label}
              </span>
            )}
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

        {/* PC에서는 이미지와 해당 본문을 좌우로 묶고, 모바일에서는 이미지가 먼저 보이도록 정리 */}
        <article className="flex flex-col gap-6">
          {contentSections.map((section) => (
            <section
              key={section.key}
              className={`rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm ${
                section.image ? 'md:grid md:grid-cols-[minmax(240px,0.42fr)_1fr] md:items-start md:gap-6' : ''
              }`}
            >
              {section.image && (
                <figure className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 md:mb-0">
                  <img
                    src={section.image.src}
                    alt={section.image.alt}
                    className="w-full h-auto max-h-[440px] object-contain"
                    loading="lazy"
                  />
                </figure>
              )}

              <div className="min-w-0 prose prose-base md:prose-lg prose-blue prose-slate max-w-none prose-p:my-4 prose-p:leading-relaxed prose-headings:font-black prose-headings:text-[#0F1A2B] prose-headings:mt-0 prose-headings:mb-4 prose-a:text-[#C9A857] prose-blockquote:not-italic prose-blockquote:border-[3px] prose-blockquote:!border-l-[3px] prose-blockquote:border-[#0F1A2B] prose-blockquote:bg-slate-50 prose-blockquote:shadow-sm prose-blockquote:rounded-[20px] prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:text-[#1F2937] prose-blockquote:mt-5 prose-ul:list-none prose-ul:pl-0 prose-img:rounded-xl prose-img:w-full prose-img:h-auto break-keep">
                <MarkdownContent content={section.body} />
              </div>
            </section>
          ))}
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
