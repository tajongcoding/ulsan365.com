import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { getPostVisuals } from '../lib/postVisuals';
import { absoluteUrl } from '../lib/site';
import AppSection from '../components/AppList';
import CoupangBanner from '../components/CoupangBanner';

export const metadata: Metadata = {
  title: '울산365 | 울산 생활·복지·경제·행사·관광 통합 포털',
  description:
    '울산에 꼭 필요한 생활·복지·경제·행사·관광 정보를 쉽고 정확하게 전하는 울산365 공공형 지역 포털입니다.',
  alternates: {
    canonical: '/',
  },
  keywords: ['울산 생활정보', '울산 복지', '울산 경제', '울산 행사', '울산 관광', '울산 포털'],
  openGraph: {
    title: '울산365 | 울산 생활·복지·경제·행사·관광 통합 포털',
    description:
      '생활 정보부터 문화·관광까지 한 화면에서 찾는 울산365 지역 포털입니다.',
    url: absoluteUrl('/'),
    type: 'website',
    images: [absoluteUrl('/og-default.svg')],
  },
};

export default function Home() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 8);

  const featuredVisuals = latestPosts.slice(0, 3).map((post) => ({
    ...post,
    ...getPostVisuals(post),
  }));

  const quickServices = [
    {
      title: '복지·지원',
      icon: '💝',
      desc: '청년·어르신·가족 지원 제도를 빠르게 확인',
      link: '/blog?category=복지',
      tone: '가장 많이 찾음',
    },
    {
      title: '일자리·경제',
      icon: '📈',
      desc: '창업, 취업, 전통시장, 생활 경제 정보',
      link: '/blog?category=경제',
      tone: '실전형 정보',
    },
    {
      title: '민원·생활',
      icon: '🏘️',
      desc: '교통, 앱, 대형폐기물, 공공서비스 안내',
      link: '/blog?category=생활',
      tone: '매일 쓰는 정보',
    },
    {
      title: '문화·행사',
      icon: '🎉',
      desc: '가족 행사, 축제, 공연, 주말 일정 정리',
      link: '/blog?category=행사',
      tone: '주말 추천',
    },
    {
      title: '명소·관광',
      icon: '📸',
      desc: '드라이브, 산책, 바다, 역사 코스 큐레이션',
      link: '/blog?category=명소',
      tone: '여행 감성',
    },
    {
      title: 'FAQ 안내',
      icon: '🤔',
      desc: '자주 묻는 질문을 짧고 쉽게 먼저 확인',
      link: '/qna',
      tone: '바로 해결',
    },
  ];

  const topKeywords = [
    { label: '청년 지원금', href: '/blog?category=복지' },
    { label: '버스·교통', href: '/blog?category=생활' },
    { label: '주말 행사', href: '/blog?category=행사' },
    { label: '드라이브 코스', href: '/blog?category=명소' },
    { label: '전통시장', href: '/blog?category=경제' },
    { label: 'FAQ', href: '/qna' },
  ];

  const categorySections = [
    {
      key: '복지',
      title: '복지·지원',
      heading: '가족과 시민을 위한 복지 정보',
      desc: '청년, 한부모가정, 어르신, 장애인 이동지원까지 생활 가까운 복지 정보를 묶었습니다.',
      link: '/blog?category=복지',
      points: ['청년·가족 지원', '어르신·돌봄 서비스', '이동·생활 보조 제도'],
    },
    {
      key: '경제',
      title: '일자리·경제',
      heading: '생활비 절약과 일자리 정보를 함께',
      desc: '취업, 창업, 채용박람회, 전통시장 혜택처럼 바로 체감되는 경제 정보를 큐레이션합니다.',
      link: '/blog?category=경제',
      points: ['채용·취업 정보', '창업·소상공인 지원', '시장·상품권 혜택'],
    },
    {
      key: '생활',
      title: '민원·생활',
      heading: '매일 쓰는 생활 서비스를 쉽게',
      desc: '버스, 도서관, 공공와이파이, 대형폐기물처럼 시민이 자주 찾는 생활정보를 정리했습니다.',
      link: '/blog?category=생활',
      points: ['교통·대중교통', '디지털·도서관', '생활 민원 안내'],
    },
    {
      key: '행사',
      title: '문화·행사',
      heading: '주말이 즐거워지는 울산 행사 큐레이션',
      desc: '아이와 함께 가기 좋은 체험 행사부터 야시장, 공연, 축제 일정까지 한눈에 볼 수 있습니다.',
      link: '/blog?category=행사',
      points: ['가족 체험 행사', '축제·공연 일정', '주말 야외 코스'],
    },
    {
      key: '명소',
      title: '명소·관광',
      heading: '울산다운 풍경을 담은 대표 명소',
      desc: '간절곶, 반구대, 주전해변처럼 울산의 풍경과 스토리가 살아있는 코스를 차곡차곡 쌓아갑니다.',
      link: '/blog?category=명소',
      points: ['바다·드라이브 코스', '역사·산책 명소', '사진 찍기 좋은 장소'],
    },
  ]
    .map((section) => {
      const posts = allPosts
        .filter((post) => post.category === section.key)
        .slice(0, 2)
        .map((post) => ({
          ...post,
          ...getPostVisuals(post),
        }));

      const leadVisual = posts[0];

      return {
        ...section,
        posts,
        badgeClass: leadVisual?.badgeClass ?? 'bg-slate-100 text-slate-700 border border-slate-200',
        surfaceClass: leadVisual?.surfaceClass ?? 'from-slate-50 via-white to-slate-100',
      };
    })
    .filter((section) => section.posts.length > 0);

  const faqPreviewItems = [
    { question: '울산 청년월세 지원은 어디서 신청하나요?', category: '복지·지원' },
    { question: '울산 버스 환승 시간과 앱은 어떻게 확인하나요?', category: '민원·생활' },
    { question: '주말 가족 행사는 어디서 빠르게 찾을 수 있나요?', category: '문화·행사' },
  ];

  const getLocalDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#1F2937] font-sans selection:bg-[#C9A857]/30">
      <section className="relative overflow-hidden bg-[#081221] text-white border-b-[4px] border-[#C9A857]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(201,168,87,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_30%)]" />
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 lg:py-14 relative z-10">
          <div className="grid lg:grid-cols-[1.14fr_0.86fr] gap-6 lg:gap-8 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-[#C9A857]/40 bg-white/10 px-3.5 py-1.5 text-[14px] md:text-[15px] font-bold tracking-[0.04em] text-[#FFE08A]">
                복지·지원 · 일자리·경제 · 민원·생활
              </div>
              <h1 className="mt-4 text-[34px] md:text-[48px] lg:text-[56px] font-black leading-[1.18] tracking-tight break-keep text-white">
                <span className="block">문화·행사 · 명소·관광</span>
                <span className="block">자주 찾는 울산 메뉴를</span>
                <span className="block text-[#FFE08A]">한곳에 모은 울산365</span>
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] md:text-[18px] text-slate-100 font-medium leading-[1.8] break-keep">
                복지·지원, 일자리·경제, 민원·생활, 문화·행사, 명소·관광 정보를
                상단 메뉴에서 빠르게 확인할 수 있도록 구성했습니다.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {topKeywords.map((keyword) => (
                  <Link
                    key={keyword.label}
                    href={keyword.href}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] md:text-[13px] font-bold text-white hover:border-[#C9A857] hover:text-[#FFE08A] transition-colors"
                  >
                    #{keyword.label}
                  </Link>
                ))}
              </div>


            </div>

            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {featuredVisuals.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 ${index === 0 ? 'col-span-2 h-[220px]' : 'h-[165px]'}`}
                >
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.overlayClass}`} />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black mb-2 ${item.badgeClass}`}>
                      {item.categoryLabel}
                    </p>
                    <h2 className="text-[15px] md:text-[17px] font-black text-white break-keep line-clamp-2">
                      {item.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 flex flex-col gap-12 md:gap-14">
        <section>
          <div className="mb-5">
            <p className="text-[12px] font-black tracking-[0.1em] text-[#C9A857] mb-2">울산365 빠른 메뉴</p>
            <h2 className="text-[28px] md:text-[34px] font-black text-[#0F1A2B] leading-tight break-keep">
              한눈에 찾는 울산 생활 서비스
            </h2>
            <p className="text-slate-600 mt-2 text-[15px] leading-relaxed break-keep">
              자주 찾는 복지·경제·생활·행사·관광 정보를 첫 화면에 배치해,
              클릭 한 번으로 바로 이동할 수 있도록 구성했습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-3">
            {quickServices.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:border-[#C9A857] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F1A2B]/5 text-2xl">
                    {item.icon}
                  </span>
                  <span className="rounded-full bg-[#FFF7E1] px-2 py-1 text-[10px] font-black text-[#8B6B15]">
                    {item.tone}
                  </span>
                </div>
                <h3 className="text-[18px] font-black text-[#0F1A2B] leading-snug group-hover:text-[#C9A857] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] text-slate-700 leading-relaxed break-keep">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: '오늘 많이 찾는 신청 정보',
              desc: '청년 지원, 어르신 돌봄, 한부모가정 지원처럼 자주 찾는 제도를 빠르게 확인할 수 있도록 정리했습니다.',
            },
            {
              title: '주말 행사·나들이 안내',
              desc: '야시장, 체험 행사, 드라이브 코스처럼 주말에 가볍게 즐길 수 있는 울산 코스를 모았습니다.',
            },
            {
              title: '생활 밀착형 지역 정보',
              desc: '카테고리별로 꼭 필요한 지역 정보를 차곡차곡 모아 한 번에 살펴볼 수 있도록 구성했습니다.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[12px] font-black tracking-[0.1em] text-[#C9A857]">울산365 추천</p>
              <h3 className="mt-2 text-[21px] font-black text-[#0F1A2B] leading-snug break-keep">{item.title}</h3>
              <p className="mt-2 text-[15px] text-slate-700 leading-relaxed break-keep">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <p className="text-[12px] font-black tracking-[0.1em] text-[#C9A857] mb-2">울산 콘텐츠 아카이브</p>
              <h2 className="text-[28px] md:text-[34px] font-black text-[#0F1A2B] leading-tight break-keep">
                분야별로 모아보는 울산 콘텐츠
              </h2>
              <p className="text-slate-600 mt-2 text-[15px] leading-relaxed break-keep">
                카테고리별 특성이 잘 드러나도록 생활 정보와 지역 매력을 함께 담아 보기 쉽게 구성했습니다.
              </p>
            </div>
            <Link href="/blog" className="inline-flex items-center text-[15px] font-black text-[#0F1A2B] hover:text-[#C9A857] transition-colors">
              전체 카테고리 보기 →
            </Link>
          </div>

          {categorySections.map((section) => (
            <section key={section.key} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[280px_1fr]">
                <div className={`p-6 md:p-7 bg-gradient-to-br ${section.surfaceClass} border-b lg:border-b-0 lg:border-r border-slate-200`}>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-black ${section.badgeClass}`}>
                    {section.title}
                  </span>
                  <h3 className="mt-3 text-[22px] md:text-[24px] font-black text-[#0F1A2B] break-keep">
                    {section.heading}
                  </h3>
                  <p className="mt-2 text-[14px] text-slate-600 leading-relaxed break-keep">
                    {section.desc}
                  </p>
                  <ul className="mt-4 space-y-2 text-[13px] text-slate-600 font-medium">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 break-keep">
                        <span className="mt-0.5 text-[#C9A857]">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={section.link}
                    className="mt-5 inline-flex items-center rounded-xl bg-[#0F1A2B] px-4 py-2.5 text-[14px] font-black text-white hover:bg-[#C9A857] hover:text-[#0F1A2B] transition-colors"
                  >
                    {section.title} 더 보기
                  </Link>
                </div>

                <div className="p-4 md:p-5 grid md:grid-cols-2 gap-4">
                  {section.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white hover:-translate-y-1 hover:border-[#C9A857] hover:shadow-md transition-all"
                    >
                      <div className="relative h-[170px] overflow-hidden bg-slate-100">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${post.overlayClass}`} />
                        <span className={`absolute left-3 top-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${post.badgeClass}`}>
                          {post.categoryLabel}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[12px] font-bold text-slate-500 mb-2">
                          📅 {post.date} · <span className="text-[#C9A857] uppercase tracking-[0.16em]">{post.toneName}</span>
                        </p>
                        <h4 className="text-[18px] font-black text-[#0F1A2B] leading-snug break-keep line-clamp-2 group-hover:text-[#C9A857] transition-colors">
                          {post.title}
                        </h4>
                        <p className="mt-2 text-[14px] text-slate-600 leading-relaxed break-keep line-clamp-3">
                          {post.summary || post.contentExcerpt}
                        </p>
                        <span className="mt-3 inline-flex items-center text-[14px] font-extrabold text-[#0F1A2B] group-hover:text-[#C9A857] transition-colors">
                          자세히 보기 →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </section>

        <section>
          <div className="flex justify-between items-end mb-6 border-b-[2px] border-[#0F1A2B] pb-4">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B] tracking-tight">자주 묻는 질문</h2>
              <p className="text-slate-500 mt-2 break-keep">시민들이 실제로 자주 찾는 질문을 먼저 배치했습니다.</p>
            </div>
            <Link href="/qna" className="text-[16px] md:text-[18px] font-black text-[#6B7280] hover:text-[#0F1A2B] transition-colors hidden md:flex items-center gap-1 group">
              FAQ 전체보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faqPreviewItems.map((item) => (
              <Link
                key={item.question}
                href="/qna"
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#C9A857] transition-all"
              >
                <div className="inline-flex items-center rounded-full bg-[#0F1A2B]/5 px-2.5 py-1 text-[12px] font-bold text-[#0F1A2B] mb-3">
                  {item.category}
                </div>
                <h3 className="text-[18px] md:text-[19px] font-extrabold text-[#0F1A2B] leading-snug break-keep group-hover:text-[#C9A857] transition-colors">
                  {item.question}
                </h3>
                <p className="mt-3 text-[14px] text-slate-500 leading-relaxed break-keep">
                  관련 정보와 핵심 답변을 FAQ 페이지에서 바로 확인할 수 있습니다.
                </p>
                <div className="pt-3 mt-4 border-t border-slate-100 text-[#0F1A2B] font-bold group-hover:text-[#C9A857] transition-colors">
                  자세히 보기 →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CoupangBanner variant="default" />
      </div>

      <AppSection />

      <footer className="bg-[#0F1A2B] border-t-4 border-[#C9A857] py-8 text-center px-6 text-[#6B7280] flex flex-col items-center">
        <div className="max-w-6xl w-full flex flex-col items-center gap-3">
          <p className="text-2xl font-black text-white/50 tracking-[0.2em] lowercase mb-2">
            ulsan365.com
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[15px] md:text-[16px] font-[600] text-slate-300">
            <span className="cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-white transition-colors">홈페이지이용약관</span>
            <span className="cursor-pointer hover:text-white transition-colors">이메일무단수집거부</span>
          </div>
          <div className="h-px w-24 bg-slate-800 my-2"></div>
          <p className="text-[15px] md:text-[17px] font-medium text-white leading-relaxed max-w-2xl break-keep mx-auto mt-2">
            © {getLocalDate().split('년')[0]} 울산365 포털. <br />
            본 웹사이트는 울산의 생활·복지·경제·행사·관광 정보를 시민이 이해하기 쉽게 정리해 제공하는 지역 안내 포털입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
