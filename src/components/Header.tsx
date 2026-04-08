"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 시 헤더 디자인 변경 효과
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 현재 페이지 내용은 유지하면서 주소창에는 루트 도메인만 보이도록 정리
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentHost = window.location.hostname;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentHost === 'ulsan365.com' && currentUrl !== '/') {
      window.history.replaceState(window.history.state, '', '/');
    }
  }, [pathname]);

  const menuItems = [
    {
      name: '복지·지원',
      path: '/blog?category=복지',
      subMenu: [
        { name: '📁 복지 정보 전체보기', path: '/blog?category=복지' },
        { name: '👨‍👩‍👧 한부모가정 지원', path: '/blog/2026-04-07-welfare-single-parent' },
        { name: '♿ 장애인 이동지원', path: '/blog/2026-04-07-welfare-disability-transport' },
      ],
    },
    {
      name: '일자리·경제',
      path: '/blog?category=경제',
      subMenu: [
        { name: '📁 경제 정보 전체보기', path: '/blog?category=경제' },
        { name: '💼 울산 채용박람회', path: '/blog/2026-04-07-economy-job-fair' },
        { name: '🛍️ 전통시장 혜택', path: '/blog/2026-04-07-economy-traditional-market' },
      ],
    },
    {
      name: '민원·생활',
      path: '/blog?category=생활',
      subMenu: [
        { name: '📁 생활 정보 전체보기', path: '/blog?category=생활' },
        { name: '🚌 버스·환승 이용 팁', path: '/blog/2026-04-07-life-bus-transfer' },
        { name: '📚 공공도서관 가이드', path: '/blog/2026-04-07-life-library-guide' },
      ],
    },
    {
      name: '문화·행사',
      path: '/blog?category=행사',
      subMenu: [
        { name: '📁 행사·축제 전체보기', path: '/blog?category=행사' },
        { name: '🌃 울산 야시장 모음', path: '/blog/2026-04-07-event-night-market' },
        { name: '👨‍👩‍👧 가족 체험 행사', path: '/blog/2026-04-07-event-family-festival' },
      ],
    },
    {
      name: '명소·관광',
      path: '/blog?category=명소',
      subMenu: [
        { name: '📁 명소·관광 전체보기', path: '/blog?category=명소' },
        { name: '🚗 주전 드라이브 코스', path: '/blog/2026-04-07-attraction-jujeon-drive' },
        { name: '🗿 반구대 산책 코스', path: '/blog/2026-04-07-attraction-bangudae' },
      ],
    },
    { name: 'FAQ', path: '/qna', highlight: true },
  ];

  return (
    <header className={`bg-[#0F1A2B] text-white h-[76px] md:h-[84px] sticky top-0 z-50 flex items-center transition-all duration-300 ${scrolled ? 'shadow-[0_4px_15px_rgba(0,0,0,0.3)] border-b border-slate-700' : 'border-b border-slate-800/50'}`}>
      <div className="max-w-6xl mx-auto w-full px-4 md:px-5 flex justify-between items-center h-full gap-4 md:gap-6 lg:gap-8">
        {/* Logo - 포털 스타일 로고 디자인 */}
        <Link href="/" className="flex items-center group flex-shrink-0 gap-3">
          {/* 로고 이미지 (크기 확대 및 반짝이는 움직임 효과 추가) */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_0_20px_rgba(201,168,87,0.4)] animate-[pulse_2s_infinite]">
            <img src="/ulsan_logo.png" alt="울산 로고" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="flex flex-col justify-between py-1 h-12 md:h-14">
            <span className="text-[25px] md:text-[30.5px] font-black tracking-[-0.04em] text-white group-hover:text-[#C9A857] transition-colors duration-300 lowercase leading-none">
              ulsan365<span className="text-[#C9A857]">.</span>com
            </span>
            <div className="w-full flex justify-between items-center px-0.5">
              {"ULSAN 365 INFO".split("").map((char, i) => (
                <span key={i} className="text-[12px] md:text-[15.5px] font-black text-[#C9A857] leading-none uppercase">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
        </Link>
        
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-[24px] xl:gap-[30px]">
          {menuItems.map((item, idx) => {
            const isActive = item.path === '/qna'
              ? pathname === '/qna'
              : item.path.startsWith('/blog')
                ? pathname.startsWith('/blog')
                : pathname === item.path;

            return (
              <div key={idx} className="relative group/menu h-full flex items-center">
                <Link
                  href={item.path}
                  className={`relative text-[17px] md:text-[19px] font-extrabold transition-all duration-300 group/item whitespace-nowrap flex items-center gap-1.5 py-6 ${item.highlight
                    ? isActive
                      ? 'text-[#FFE08A]'
                      : 'text-[#C9A857] hover:text-[#FFE08A]'
                    : isActive
                      ? 'text-white'
                      : 'text-slate-100/90 hover:text-white'}`}
                >
                  {item.highlight && <span className="text-[12px] font-black">✨</span>}
                  {item.name}
                  {item.subMenu && (
                    <svg className="w-4 h-4 text-slate-500 group-hover/menu:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#C9A857] transition-all duration-300 group-hover/item:w-full"></span>
                </Link>

                {item.subMenu && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-50">
                    <div className="bg-[#1F2937] border border-slate-700 rounded-xl py-3 px-2 shadow-2xl w-48 -mt-2">
                      {item.subMenu.map((sub, sIdx) => {
                        const isExternal = /^https?:\/\//.test(sub.path);

                        return isExternal ? (
                          <a
                            key={sIdx}
                            href={sub.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-[14px] font-bold text-slate-100 hover:text-[#C9A857] hover:bg-slate-800/50 rounded-lg transition-colors"
                          >
                            {sub.name}
                          </a>
                        ) : (
                          <Link
                            key={sIdx}
                            href={sub.path}
                            className="block px-4 py-2 text-[14px] font-bold text-slate-100 hover:text-[#C9A857] hover:bg-slate-800/50 rounded-lg transition-colors"
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/blog"
            title="전체 콘텐츠 보기"
            aria-label="전체 콘텐츠 보기"
            className="ml-1 inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-[#C9A857]/80 bg-[#152033] text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[#C9A857] hover:bg-[#1A2942] hover:text-[#FFE08A] hover:shadow-[0_10px_24px_rgba(201,168,87,0.18)]"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 animate-[pulse_1.8s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button 
          className="lg:hidden p-2 text-slate-200 hover:text-[#C9A857] focus:outline-none transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 모바일 전체 화면 메뉴 (오버레이 스타일) */}
      <div className={`fixed inset-0 top-[72px] bg-[#0F1A2B] z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col py-8 px-6 gap-2 h-full overflow-y-auto pb-20">
          {menuItems.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className={`py-4 text-[20px] font-bold border-b border-slate-800/50 flex justify-between items-center group active:text-[#C9A857] ${item.highlight ? 'text-[#C9A857]' : 'text-white'}`}>
                <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 ${item.highlight ? 'px-3 py-1 rounded-full bg-[#C9A857]/10' : ''}`}>
                  {item.highlight && <span className="text-[12px]">✨</span>}
                  {item.name}
                </Link>
                {item.subMenu && <span className="text-[12px] text-[#C9A857]">추천 앱 포함</span>}
                {item.highlight && !item.subMenu && <span className="text-[12px] text-[#C9A857]">빠른 확인</span>}
              </div>
              
              {item.subMenu && (
                <div className="bg-slate-900/50 rounded-xl mt-2 p-2 grid grid-cols-2 gap-2">
                  {item.subMenu.map((sub, sIdx) => {
                    const isExternal = /^https?:\/\//.test(sub.path);

                    return isExternal ? (
                      <a
                        key={sIdx}
                        href={sub.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-[14px] font-bold text-slate-400 bg-slate-800/30 rounded-lg active:bg-[#C9A857] active:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </a>
                    ) : (
                      <Link
                        key={sIdx}
                        href={sub.path}
                        className="p-3 text-[14px] font-bold text-slate-400 bg-slate-800/30 rounded-lg active:bg-[#C9A857] active:text-white transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div className="mt-12 text-center text-slate-500 text-sm">
            © 2026 울산365 포털
          </div>
        </div>
      </div>
    </header>
  );
}
