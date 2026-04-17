import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { getPostVisuals } from '../lib/postVisuals';
import { absoluteUrl } from '../lib/site';
import AppSection from '../components/AppList';
import CoupangBanner from '../components/CoupangBanner';
import GoogleAdSlot from '../components/GoogleAdSlot';
import SafeImage from '../components/SafeImage';
import HomeNoticePopup from '../components/HomeNoticePopup';

export const metadata: Metadata = {
  title: '울산 생활정보 아시나요? | 복지·지원금·행사·생활정보 안내',
  description:
    '울산광역시 시민을 위한 복지 혜택, 청년 지원금, 생활 꿀팁, 야간약국, 행사·관광 정보를 한눈에 정리한 지역 정보 포털입니다.',
  alternates: {
    canonical: '/',
  },
  keywords: ['울산 생활정보', '울산 지원금', '울산 복지', '울산 야간약국', '울산 행사', '울산 관광'],
  openGraph: {
    title: '울산 생활정보 아시나요? | 복지·지원금·행사·생활정보 안내',
    description:
      '울산광역시 시민을 위한 복지 혜택, 청년 지원금, 생활 꿀팁, 야간약국, 행사·관광 정보를 한눈에 확인해 보세요.',
    url: absoluteUrl('/'),
    type: 'website',
  },
};

const categoryColorMap: Record<string, string> = {
  '복지': 'bg-rose-50/95 text-rose-700 border-rose-200',
  '경제': 'bg-indigo-50/95 text-indigo-700 border-indigo-200',
  '생활': 'bg-sky-50/95 text-sky-700 border-sky-200',
  '행사': 'bg-amber-50/95 text-amber-700 border-amber-200',
  '명소': 'bg-emerald-50/95 text-emerald-700 border-emerald-200',
};

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);

  // 6개의 바로가기 링크
  const shortcutCards = [
    { title: '복지 정보', icon: '💝', link: '/blog?category=복지' },
    { title: '경제 정보', icon: '📈', link: '/blog?category=경제' },
    { title: '생활 정보', icon: '🏘️', link: '/blog?category=생활' },
    { title: '행사·축제', icon: '🎉', link: '/blog?category=행사' },
    { title: '명소·관광', icon: '📸', link: '/blog?category=명소' },
    { title: 'FAQ 안내', icon: '🤔', link: '/qna' },
  ];

  const featuredVisuals = latestPosts.map((post) => ({
    ...post,
    ...getPostVisuals(post),
  }));

  const faqPreviewItems = [
    { question: '울산 청년월세 지원은 어디서 신청하나요?', category: '경제 정보' },
    { question: '울산 대형폐기물 신고는 어떻게 하나요?', category: '생활 정보' },
    { question: '울산 야간약국은 어디서 찾을 수 있나요?', category: '생활 정보' },
  ];

  const topKeywords = [
    { label: '어르신 일자리', href: '/blog?category=복지' },
    { label: '청년 지원금', href: '/blog?category=경제' },
    { label: '야간 약국', href: '/blog?category=생활' },
    { label: '대형 폐기물', href: '/blog?category=생활' },
    { label: '행사·축제', href: '/blog?category=행사' },
    { label: '명소·관광', href: '/blog?category=명소' },
  ];

  const siteBenefits = [
    {
      title: '복지·지원금 빠른 확인',
      category: '복지 정보',
      desc: '청년, 임산부, 어르신, 소상공인 정보를 시민 눈높이로 쉽게 정리합니다.',
      href: '/blog?category=복지',
    },
    {
      title: '생활정보 실전형 안내',
      category: '생활 정보',
      desc: '야간약국, 교통, 앱, 대형폐기물 등 자주 찾는 생활 정보를 한곳에서 확인할 수 있습니다.',
      href: '/blog?category=생활',
    },
    {
      title: '행사·명소 최신 업데이트',
      category: '행사·관광',
      desc: '주말 나들이와 지역 축제, 관광 코스를 빠르게 모아 보여드립니다.',
      href: '/blog?category=행사',
    },
  ];

  const formatDisplayDate = (dateValue: string) => {
    const normalized = (dateValue || '').slice(0, 10);
    const [year, month, day] = normalized.split('-').map(Number);

    if (!year || !month || !day) {
      return dateValue;
    }

    return `${year}년 ${month}월 ${day}일`;
  };

  const currentYear = new Date().getFullYear();
  const latestDisplayDate = latestPosts[0] ? formatDisplayDate(latestPosts[0].date) : '';

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans selection:bg-[#C9A857]/30">
      <HomeNoticePopup enabled={false} triggerDelayMs={2400} />
      
      {/* 1. 메인 비주얼 (Hero Section) - 좌측 정렬, 감청색 배경, 세로폭 축소 */}
      <section className="relative overflow-hidden bg-[#0F1A2B] text-white py-9 md:py-12 flex flex-col justify-center px-6 border-b-[4px] border-[#C9A857]">
        {/* Subtle decorative background accents */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C9A857]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-block bg-[#1F2937]/50 backdrop-blur-sm border border-[#C9A857]/40 rounded-full px-4 py-1.5 text-[14px] md:text-[17px] font-[700] text-[#C9A857] tracking-wide">
              울산 생활정보 · 지원금 · 행사 업데이트
            </div>
            <h1 className="text-[32px] md:text-[46px] lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12] break-keep">
              울산 생활정보, 지원금, <br className="hidden md:block" />
              행사 일정까지 <br className="hidden md:block" />
              <span className="text-[#C9A857]">한눈에 확인하세요</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-slate-300 font-[400] max-w-xl break-keep mt-1 leading-relaxed">
              청년정책, 복지혜택, 생활 꿀팁, 야간약국, 행사·명소 정보를
              울산 시민 눈높이에 맞춰 쉽고 빠르게 정리해드립니다.
            </p>
            <div className="w-full overflow-x-auto pt-1 [scrollbar-width:none] [-ms-overflow-style:none]">
              <div className="flex flex-nowrap gap-2 min-w-max pr-4">
                {topKeywords.map((keyword) => (
                  <Link
                    key={keyword.label}
                    href={keyword.href}
                    className="whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] md:text-[12px] font-bold text-white hover:border-[#C9A857] hover:text-[#C9A857] transition-colors"
                  >
                    #{keyword.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-3 self-stretch">
            {featuredVisuals.map((item, index) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 ${index === 0 ? 'col-span-2 h-[200px]' : 'h-[145px]'}`}
              >
                <SafeImage
                  src={item.heroImage}
                  fallbackSrc={item.fallbackImage}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${item.overlayClass}`} />
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex h-[34px] items-center rounded-lg px-2.5 py-1 text-[14px] md:text-[16px] font-extrabold border ${item.badgeClass} backdrop-blur-md shadow-sm transition-colors group-hover:border-[#C9A857]/50`}>
                    {item.categoryLabel}
                  </span>
                  <span className="inline-flex h-[34px] items-center px-0.5 text-[12px] md:text-[13px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                    {formatDisplayDate(item.date)}
                  </span>
                </div>
                <div className="absolute left-0 right-0 bottom-0 p-3.5 z-10">
                  <h2 className="text-[16px] font-black text-white break-keep line-clamp-2">
                    {item.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 flex flex-col gap-12 md:gap-16 relative z-20">
        
        {/* 2. 바로가기 카드 (Shortcut Cards) - 컴팩트한 사이즈로 조정 */}
        <section>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {shortcutCards.map((card, idx) => (
              <div key={idx} className="flex justify-center">
                <Link
                  href={card.link}
                  className="group bg-white aspect-square border-[2px] border-[#0F1A2B] rounded-xl p-1.5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-[#C9A857] transition-all duration-500 w-full max-w-[110px] md:max-w-[140px]"
                >
                  <div className="w-[85%] aspect-square rounded-md bg-[#F5F7FA] text-[#0F1A2B] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] text-4xl md:text-5xl flex items-center justify-center transition-all duration-500 mb-1.5 shadow-inner shrink-0 leading-none group-hover:rotate-12">
                    <span className="transform transition-transform duration-500 group-hover:scale-110">
                      {card.icon}
                    </span>
                  </div>
                  <h3
                    className={`text-[14px] md:text-[18px] font-black text-[#1F2937] group-hover:text-[#0F1A2B] transition-colors text-center ${
                      card.title === '행사·축제' ? 'whitespace-normal leading-[1.05]' : 'whitespace-nowrap leading-tight'
                    }`}
                  >
                    {card.title === '행사·축제' ? (
                      <>
                        <span className="block">행사·축제</span>
                                              </>
                    ) : (
                      card.title
                    )}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {siteBenefits.map((item) => {
            // 카테고리별 스타일 결정
            const categoryKey = item.category.split(' ')[0];
            const badgeStyle = categoryColorMap[categoryKey] || 'bg-slate-50/95 text-slate-700 border-slate-200';

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex h-full flex-col bg-white rounded-2xl border-[2.5px] border-slate-300 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#C9A857] transition-all duration-300"
              >
                <div className="mb-3 flex items-center gap-2 flex-wrap min-h-[34px]">
                  <div className={`inline-flex h-[34px] items-center rounded-lg px-2.5 py-1 text-[14px] md:text-[16px] font-extrabold border ${badgeStyle} transition-colors group-hover:border-[#C9A857]/50`}>
                    {item.category}
                  </div>
                  {latestDisplayDate ? (
                    <span className="inline-flex h-[34px] items-center px-0.5 text-[12px] md:text-[13px] font-extrabold text-slate-500">
                      {latestDisplayDate}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-[20px] md:text-[22px] font-black text-[#0F1A2B] mb-2 break-keep group-hover:text-[#C9A857] transition-colors">{item.title}</h3>
                <p className="flex-1 text-slate-600 text-[16px] leading-relaxed break-keep">{item.desc}</p>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[14px] font-extrabold text-[#0F1A2B] group-hover:text-[#C9A857] transition-colors">
                  바로 보기 →
                </div>
              </Link>
            );
          })}
        </section>

        <GoogleAdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME}
          label="홈 메인 스폰서 배너"
        />

        {/* 3. 최신 글 (Latest Posts) - 이미지 높이 260px로 축소하여 전체 박스 너비 조절 */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b-[2px] border-[#0F1A2B] pb-4">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F1A2B] tracking-tight">최신 정보 업데이트</h2>
            <Link href="/blog" className="text-[17px] md:text-[19px] font-bold text-[#6B7280] hover:text-[#0F1A2B] transition-colors hidden md:flex items-center gap-1 group">
              전체보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {featuredVisuals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredVisuals.map((post) => {
                const { heroImage, fallbackImage, categoryLabel, badgeClass, overlayClass, toneName } = post;

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-[12px] border-[3px] border-[#0F1A2B] shadow-sm hover:shadow-lg hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group h-full"
                  >
                    {/* 이미지 창 280px 유지 */}
                    <div className="relative w-full h-[230px] md:h-[260px] bg-slate-100 overflow-hidden border-b-[3px] border-[#0F1A2B] shrink-0">
                      <SafeImage 
                        src={heroImage}
                        fallbackSrc={fallbackImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${overlayClass}`} />
                      <div className="absolute top-4 left-4 right-4 flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex h-[34px] items-center rounded-lg px-2.5 py-1 text-[14px] md:text-[16px] font-extrabold border ${badgeClass} backdrop-blur-md shadow-sm transition-colors group-hover:border-[#C9A857]/50`}>
                          {categoryLabel}
                        </span>
                        <span className="inline-flex h-[34px] items-center px-0.5 text-[12px] md:text-[13px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                          {formatDisplayDate(post.date)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col flex-1 bg-white">
                      {/* 상단 정보 영역 */}
                      <div className="flex flex-col flex-1">

                        {/* Date */}
                        <div className="mb-1.5 flex flex-wrap gap-2 items-center">
                          <div className="text-[12px] text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full w-fit">
                            📅 {post.date}
                          </div>
                          <span className="text-[10px] font-black tracking-[0.18em] text-[#C9A857] uppercase">
                            {toneName}
                          </span>
                        </div>

                        <h3 className="text-[20px] md:text-[22px] font-black text-[#1F2937] mb-1.5 group-hover:text-[#C9A857] transition-colors line-clamp-2 leading-snug break-keep shrink-0">
                          {post.title}
                        </h3>
                        
                        {/* 핵심 요약 상자 - flex-1을 추가하여 빈 공간을 이것이 채우게 함 */}
                        <div className="bg-[#F5F7FA] border border-slate-200 rounded-xl p-3.5 text-slate-700 font-[600] text-[15px] md:text-[16px] leading-[1.6] break-keep whitespace-pre-line shadow-inner flex flex-col flex-1">
                          {post.summaryBox?.includes('📝') ? (
                            <>
                               <div className="text-[#0F1A2B] font-black mb-1.5 border-b border-slate-200 pb-1 text-[17px] md:text-[19px]">{post.summaryBox.split('\n')[0]}</div>
                               <div className="opacity-95 leading-[1.6]">{post.summaryBox.split('\n').slice(1).join('\n')}</div>
                            </>
                          ) : (
                            post.summaryBox || post.summary || post.contentExcerpt
                          )}
                        </div>
                      </div>

                      {/* Bottom read more - 항상 맨 아래 고정 */}
                      <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center text-[#0F1A2B] font-extrabold text-[16px] md:text-[18px] group-hover:text-[#C9A857] transition-colors shrink-0">
                        자세히 보기 <span className="ml-1 text-[#C9A857] tracking-tighter">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-24 bg-white rounded-[12px] border border-slate-200">
                <p className="text-[#6B7280] font-medium">등록된 안내 정보가 없습니다. 곧 업데이트 될 예정입니다.</p>
             </div>
          )}
          
          {/* Mobile view 'read more' */}
          <div className="mt-6 text-center md:hidden">
            <Link href="/blog" className="inline-block bg-white border border-slate-300 text-[#1F2937] font-[600] py-3 px-6 rounded-[8px] hover:bg-slate-50 transition-colors w-full shadow-sm">
              전체 안내 정보 보기
            </Link>
          </div>
        </section>

        {/* 4. FAQ 미리보기 섹션 */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b-[2px] border-[#0F1A2B] pb-4">
            <div>
              <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F1A2B] tracking-tight">자주 묻는 질문</h2>
              <p className="text-slate-500 mt-2 break-keep">울산 시민들이 자주 찾는 질문을 먼저 확인해 보세요.</p>
            </div>
            <Link href="/qna" className="text-[17px] md:text-[19px] font-bold text-[#6B7280] hover:text-[#0F1A2B] transition-colors hidden md:flex items-center gap-1 group">
              FAQ 전체보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faqPreviewItems.map((item) => {
              // 카테고리별 스타일 결정
              const categoryKey = item.category.split(' ')[0];
              const badgeStyle = categoryColorMap[categoryKey] || 'bg-slate-50/95 text-slate-700 border-slate-200';

              return (
                <Link
                  key={item.question}
                  href="/qna"
                  className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#C9A857] transition-all flex flex-col"
                >
                  <div className="flex-1">
                    <div className={`inline-flex items-center rounded-lg px-4 py-2.5 text-[15px] md:text-[17px] font-extrabold mb-3 border ${badgeStyle} transition-colors group-hover:border-[#C9A857]/50`}>
                      {item.category}
                    </div>
                    <h3 className="text-[18px] md:text-[19px] font-extrabold text-[#0F1A2B] leading-snug break-keep group-hover:text-[#C9A857] transition-colors mb-3">
                      {item.question}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed break-keep">
                      핵심 답변과 관련 정보를 FAQ 페이지에서 바로 확인할 수 있습니다.
                    </p>
                  </div>
                  <div className="pt-4 mt-auto border-t border-slate-100 text-[#0F1A2B] font-bold group-hover:text-[#C9A857] transition-colors">
                    자세히 보기 →
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link href="/qna" className="inline-block bg-white border border-slate-300 text-[#1F2937] font-[600] py-3 px-6 rounded-[8px] hover:bg-slate-50 transition-colors w-full shadow-sm">
              FAQ 전체 보기
            </Link>
          </div>
        </section>

        {/* 쿠팡 파트너스 배너 추가 */}
        <CoupangBanner variant="default" topic="생활" />
      </div>

      {/* 앱 추천 섹션 추가 */}
      <AppSection />

      {/* 4. 푸터 영역 */}
      <footer className="bg-[#0F1A2B] border-t-4 border-[#C9A857] py-8 text-center px-6 text-[#6B7280] flex flex-col items-center">
        <div className="max-w-6xl w-full flex flex-col items-center gap-3">
          <p className="text-2xl font-black text-white/50 tracking-[0.2em] lowercase mb-2">
            ulsan365.com
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[15px] md:text-[16px] font-[600] text-slate-300">
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">홈페이지이용약관</Link>
            <Link href="/no-email" className="hover:text-white transition-colors">이메일무단수집거부</Link>
          </div>
          <div className="h-px w-24 bg-slate-800 my-2"></div>
          <p className="text-[15px] md:text-[17px] font-medium text-white leading-relaxed max-w-lg break-keep mx-auto mt-2">
            © {currentYear} 울산광역시 아시나요? All rights reserved. <br/>
            본 웹사이트는 울산시의 생활, 복지, 경제 정보를 시민들에게 알기 쉽게 전달하는 비영리 공공안내 포털입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
