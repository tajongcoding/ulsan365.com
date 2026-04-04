import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import AppSection from '../components/AppList';
import CoupangBanner from '../components/CoupangBanner';

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3); // 3개 박스로 고정

  // 6개의 바로가기 링크
  const shortcutCards = [
    { title: '복지 정보', icon: '💝', link: '/blog?category=복지' },
    { title: '경제 정보', icon: '📈', link: '/blog?category=경제' },
    { title: '생활 정보', icon: '🏘️', link: '/blog?category=생활' },
    { title: '행사·축제', icon: '🎉', link: '/blog?category=행사' },
    { title: '명소·관광', icon: '📸', link: '/blog?category=명소' },
    { title: '궁금해요?', icon: '🤔', link: '/qna' },
  ];

  // 현재 날짜 구하기
  const getLocalDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans selection:bg-[#C9A857]/30">
      
      {/* 1. 메인 비주얼 (Hero Section) - 좌측 정렬, 감청색 배경, 세로폭 축소 */}
      <section className="relative overflow-hidden bg-[#0F1A2B] text-white py-12 md:py-16 flex flex-col justify-center px-6 border-b-[4px] border-[#C9A857]">
        {/* Subtle decorative background accents */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C9A857]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-start gap-5">
          <div className="inline-block bg-[#1F2937]/50 backdrop-blur-sm border border-[#C9A857]/40 rounded-full px-5 py-2 text-[18px] md:text-[22px] font-[600] text-[#C9A857] tracking-wide">
            공식 생활 안내 포털
          </div>
          <h1 className="text-[40px] md:text-[56px] lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.15] break-keep">
            울산광역시 아시나요?<span className="text-[#C9A857] text-5xl">.</span>
          </h1>
          <p className="text-[18px] md:text-[22px] text-slate-300 font-[400] max-w-xl break-keep mt-2 leading-relaxed">
            복지·경제·행사·생활·관광 등<br className="md:hidden" /> 꼭 필요한 핵심 정보를 한눈에 제공합니다.
          </p>
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
                  <h3 className="text-[14px] md:text-[18px] font-black text-[#1F2937] group-hover:text-[#0F1A2B] transition-colors whitespace-nowrap leading-tight">
                    {card.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 최신 글 (Latest Posts) - 이미지 높이 260px로 축소하여 전체 박스 너비 조절 */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b-[2px] border-[#0F1A2B] pb-4">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F1A2B] tracking-tight">최신 정보 업데이트</h2>
            <Link href="/blog" className="text-[17px] md:text-[19px] font-bold text-[#6B7280] hover:text-[#0F1A2B] transition-colors hidden md:flex items-center gap-1 group">
              전체보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => {
                // 카테고리에 맞는 고화질 무료 이미지 URL 매칭
                const thumbImg = post.category === '복지' ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800' : 
                                post.category === '경제' ? 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800' : 
                                post.category === '행사' ? 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800' : 
                                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800';

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-[12px] border-[3px] border-[#0F1A2B] shadow-sm hover:shadow-lg hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group h-full"
                  >
                    {/* 이미지 창 280px 유지 */}
                    <div className="relative w-full h-[280px] bg-slate-100 overflow-hidden border-b-[3px] border-[#0F1A2B]">
                      <img 
                        src={thumbImg} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-[12px] md:text-[13px] tracking-widest font-black text-[#0F1A2B] bg-white/90 backdrop-blur-md border border-[#0F1A2B]/10 px-3 py-1.5 rounded-lg shadow-sm">
                          {post.category === '복지' ? '복지 정보' : 
                           post.category === '경제' ? '경제 정보' : 
                           post.category === '생활' ? '생활 정보' : 
                           post.category === '행사' ? '행사·축제' : 
                           post.category === '명소' ? '명소·관광' : post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col h-full bg-white">
                      {/* 상단 정보 영역 */}
                      <div className="flex flex-col flex-1">
                        {/* Date */}
                        <div className="mb-1.5 flex justify-between items-center text-[12px] text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full w-fit">
                          📅 {post.date}
                        </div>

                        <h3 className="text-[20px] md:text-[22px] font-black text-[#1F2937] mb-1.5 group-hover:text-[#C9A857] transition-colors line-clamp-2 leading-snug break-keep">
                          {post.title}
                        </h3>
                        
                        {/* 핵심 요약 상자 */}
                        <div className="bg-[#F5F7FA] border border-slate-200 rounded-xl p-3.5 text-slate-700 font-[600] text-[15px] md:text-[16px] leading-[1.6] break-keep whitespace-pre-line shadow-inner">
                          {post.summaryBox?.includes('📝') ? (
                            <>
                               <div className="text-[#0F1A2B] font-black mb-1.5 border-b border-slate-200 pb-1 text-[17px] md:text-[19px]">{post.summaryBox.split('\n')[0]}</div>
                               <div className="opacity-95 leading-[1.6]">{post.summaryBox.split('\n').slice(1).join('\n')}</div>
                            </>
                          ) : (
                            post.summaryBox || post.contentExcerpt || post.summary
                          )}
                        </div>
                      </div>

                      {/* Bottom read more - 항상 맨 아래 고정 */}
                      <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center text-[#0F1A2B] font-extrabold text-[16px] md:text-[18px] group-hover:text-[#C9A857] transition-colors shrink-0">
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

        {/* 쿠팡 파트너스 배너 추가 */}
        <CoupangBanner />
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
            <span className="cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-white transition-colors">홈페이지이용약관</span>
            <span className="cursor-pointer hover:text-white transition-colors">이메일무단수집거부</span>
          </div>
          <div className="h-px w-24 bg-slate-800 my-2"></div>
          <p className="text-[15px] md:text-[17px] font-medium text-white leading-relaxed max-w-lg break-keep mx-auto mt-2">
            © {getLocalDate().split('년')[0]} 울산광역시 아시나요? All rights reserved. <br/>
            본 웹사이트는 울산시의 생활, 복지, 경제 정보를 시민들에게 알기 쉽게 전달하는 비영리 공공안내 포털입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
