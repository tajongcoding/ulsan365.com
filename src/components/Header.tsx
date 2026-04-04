"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
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
    { name: '아시나요', path: '/about' },
    { name: '복지 정보', path: '/blog?category=복지' },
    { name: '경제 정보', path: '/blog?category=경제' },
    { 
      name: '생활 정보', 
      path: '/blog?category=생활',
      subMenu: [
        { name: '📁 생활 정보 전체보기', path: '/blog?category=생활' },
        { name: '💳 울산페이(지역화폐)', path: 'https://play.google.com/store/apps/details?id=com.konai.parkland.ulsan' },
        { name: '🚌 울산 버스정보', path: 'https://play.google.com/store/apps/details?id=com.unibus.ulsan' },
        { name: '🏰 울산 관광 가이드', path: 'https://play.google.com/store/apps/details?id=com.ulsankr.tour' },
        { name: '🏙️ 모바일 울산', path: 'https://play.google.com/store/apps/details?id=kr.go.ulsan.mobile' },
        { name: '🔔 똑똑 울산', path: 'https://play.google.com/store/apps/details?id=kr.go.ulsan.ddp' },
        { name: '🍱 착한배달 울산', path: 'https://play.google.com/store/apps/details?id=com.good.delivery.ulsan' },
      ]
    },
    { name: '행사·축제', path: '/blog?category=행사' },
    { name: '명소·관광', path: '/blog?category=명소' },
    { name: '궁금해요?', path: '/qna' },
  ];

  return (
    <header className={`bg-[#0F1A2B] text-white h-[76px] md:h-[84px] sticky top-0 z-50 flex items-center transition-all duration-300 ${scrolled ? 'shadow-[0_4px_15px_rgba(0,0,0,0.3)] border-b border-slate-700' : 'border-b border-slate-800/50'}`}>
      <div className="max-w-6xl mx-auto w-full px-6 flex justify-between items-center h-full">
        {/* Logo - 포털 스타일 로고 디자인 */}
        <Link href="/" className="flex items-center group flex-shrink-0 gap-3">
          {/* 로고 이미지 (크기 확대 및 반짝이는 움직임 효과 추가) */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_0_20px_rgba(201,168,87,0.4)] animate-[pulse_2s_infinite]">
            <img src="/ulsan_logo.png" alt="울산 로고" className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[26px] md:text-[30px] font-black tracking-tighter text-white group-hover:text-[#C9A857] transition-colors duration-300 lowercase">
              ulsan365<span className="text-[#C9A857]">.</span>com
            </span>
            <span className="text-[11px] md:text-[13px] font-bold text-[#C9A857] tracking-[0.25em] mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              ULSAN PORTAL
            </span>
          </div>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-[30px]">
          {menuItems.map((item, idx) => (
            <div key={idx} className="relative group/menu h-full flex items-center">
              <Link 
                href={item.path} 
                className="relative text-[16px] md:text-[18px] font-extrabold text-slate-300 hover:text-white transition-all duration-300 group/item whitespace-nowrap flex items-center gap-1.5 py-6"
              >
                {item.name}
                {item.subMenu && (
                  <svg className="w-4 h-4 text-slate-500 group-hover/menu:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C9A857] transition-all duration-300 group-hover/item:w-full"></span>
              </Link>

              {/* Sub Menu (Dropdown) */}
              {item.subMenu && (
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-50">
                  <div className="bg-[#1F2937] border border-slate-700 rounded-xl py-3 px-2 shadow-2xl w-48 -mt-2">
                    {item.subMenu.map((sub, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={sub.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-[14px] font-[600] text-slate-300 hover:text-[#C9A857] hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        {sub.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="ml-4 h-6 w-px bg-slate-700/50"></div>
          <button className="p-2 text-slate-400 hover:text-[#C9A857] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button 
          className="lg:hidden p-2 text-slate-300 hover:text-[#C9A857] focus:outline-none transition-colors"
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
              <div className="py-4 text-[20px] font-bold text-white border-b border-slate-800/50 flex justify-between items-center group active:text-[#C9A857]">
                <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </Link>
                {item.subMenu && <span className="text-[12px] text-[#C9A857]">추천 앱 포함</span>}
              </div>
              
              {item.subMenu && (
                <div className="bg-slate-900/50 rounded-xl mt-2 p-2 grid grid-cols-2 gap-2">
                  {item.subMenu.map((sub, sIdx) => (
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
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-12 text-center text-slate-500 text-sm">
            © 2026 울산 아시나요 포털
          </div>
        </div>
      </div>
    </header>
  );
}
