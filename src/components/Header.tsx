"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { siteConfig } from '@/lib/site';

function HeaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
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

  const menuItems = [
    { name: '울산365 소개', path: '/about' },
    { name: '복지 정보', path: '/blog?category=%EB%B3%B5%EC%A7%80' },
    { name: '경제 정보', path: '/blog?category=%EA%B2%BD%EC%A0%9C' },
    { name: '생활 정보', path: '/blog?category=%EC%83%9D%ED%99%9C' },
    { name: '행사·축제', path: '/blog?category=%ED%96%89%EC%82%AC' },
    { name: '관광명소', path: '/blog?category=%EB%AA%85%EC%86%8C' },
    { name: 'FAQ', path: '/qna', highlight: true },
  ];

  return (
    <header className={`bg-[#0F1A2B] text-white h-[76px] md:h-[84px] sticky top-0 z-50 flex items-center transition-all duration-300 ${scrolled ? 'shadow-[0_4px_15px_rgba(0,0,0,0.3)] border-b border-slate-700' : 'border-b border-slate-800/50'}`}>
      <div className="max-w-6xl mx-auto w-full px-3 md:px-5 flex justify-between items-center h-full gap-2 md:gap-6 lg:gap-8">
        {/* Logo - 포털 스타일 로고 디자인 */}
        <Link href="/" className="flex min-w-0 flex-1 items-center group gap-2 md:flex-shrink-0 md:gap-3">
          {/* 로고 이미지 (크기 확대 및 반짝이는 움직임 효과 추가) */}
          <div className="relative h-10 w-10 shrink-0 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_0_20px_rgba(201,168,87,0.4)] animate-[pulse_2s_infinite]">
            <img src="/ulsan_logo.png" alt="울산 로고" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="flex min-w-0 flex-col justify-between py-1 h-10 md:h-14">
            <span className="truncate text-[21px] sm:text-[24px] md:text-[30.5px] font-black tracking-normal text-white group-hover:text-[#C9A857] transition-colors duration-300 lowercase leading-none">
              ulsan365<span className="text-[#C9A857]">.</span>com
            </span>
            <div className="w-full flex justify-between items-center px-0.5">
              {"ULSAN PORTAL INFO".split("").map((char, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] md:text-[15.5px] font-black text-[#C9A857] leading-none uppercase">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </div>
          </div>
        </Link>
        
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-[24px] xl:gap-[30px]">
          {menuItems.map((item, idx) => {
            const itemCategory = item.path.includes('category=') ? decodeURIComponent(item.path.split('category=')[1]) : '';
            const isActive = item.path === '/qna'
              ? pathname === '/qna'
              : item.path.startsWith('/blog')
                ? pathname.startsWith('/blog') && itemCategory === currentCategory
                : pathname === item.path;

            return (
              <div key={idx} className="relative group/menu h-full flex items-center">
                <Link
                  href={item.path}
                  className={`relative text-[16px] md:text-[19px] font-[900] transition-colors duration-200 group/item whitespace-nowrap flex items-center gap-1.5 py-6 ${
                    isActive
                      ? 'text-[#FFE08A] drop-shadow-[0_0_8px_rgba(255,224,138,0.5)]'
                      : 'text-white hover:text-[#FFE08A]'
                  }`}
                >
                  {item.highlight && <span className="text-[12px] font-black">✨</span>}
                  {item.name}
                  <span className={`absolute bottom-4 left-0 h-[3px] bg-[#C9A857] shadow-[0_0_10px_rgba(201,168,87,0.5)] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover/item:w-full'}`}></span>
                </Link>

              </div>
            );
          })}

          <Link
            href="/blog"
            title="울산365 전체 검색"
            aria-label="울산365 전체 검색"
            className="ml-1 relative inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,224,138,0.22),rgba(21,32,51,0.96)_58%)] text-[#FFE08A] shadow-[0_0_18px_rgba(201,168,87,0.28),0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[radial-gradient(circle_at_30%_30%,rgba(255,240,180,0.34),rgba(26,41,66,1)_58%)] hover:text-[#FFF4BF] hover:shadow-[0_0_26px_rgba(255,224,138,0.45),0_12px_28px_rgba(0,0,0,0.24)]"
          >
            <span className="absolute right-1 top-1 text-[10px] font-black text-[#FFF4BF] drop-shadow-[0_0_6px_rgba(255,224,138,0.8)]">
              ↗
            </span>
            <svg className="w-5.5 h-5.5 md:w-6.5 md:h-6.5 animate-[pulse_1.4s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(255,224,138,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-300 hover:text-[#C9A857] focus:outline-none transition-colors lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
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
                <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex min-h-11 flex-1 items-center gap-2 ${item.highlight ? 'px-3 py-1 rounded-full bg-[#C9A857]/10' : ''}`}>
                  {item.highlight && <span className="text-[12px]">✨</span>}
                  {item.name}
                </Link>
                {item.highlight && <span className="text-[12px] text-[#C9A857]">빠른 확인</span>}
              </div>
            </div>
          ))}
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#C9A857] px-5 py-3 text-[16px] font-black text-[#0F1A2B] shadow-sm"
          >
            전체 검색하기
          </Link>
          <div className="mt-12 text-center text-slate-500 text-sm">
            © 2026 {siteConfig.name} 포털
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
