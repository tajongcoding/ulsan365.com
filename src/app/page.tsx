import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import AppSection from '../components/AppList';
import CoupangBanner from '../components/CoupangBanner';

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 6); // 최신 글 6개 가져오기

  // 6개의 바로가기 링크
  const shortcutCards = [
    { title: '복지 정보', icon: '💝', link: '/blog' },
    { title: '경제 정보', icon: '📈', link: '/blog' },
    { title: '행사·축제', icon: '🎉', link: '/blog' },
    { title: '생활 정보', icon: '🏘️', link: '/blog' },
    { title: '명소·관광', icon: '📸', link: '/blog' },
    { title: '궁금해요?', icon: '🤔', link: '/qna' },
  ];

  // 현재 날짜 구하기
  const getLocalDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans selection:bg-[#C9A857]/30">
      
      {/* 1. 메인 비주얼 (Hero Section) - 좌측 정렬, 네이비/골드 톤 */}
      <section className="relative overflow-hidden bg-[#0F1A2B] text-white py-20 md:py-32 flex flex-col justify-center px-6 border-b-[4px] border-[#C9A857]">
        {/* Subtle decorative background accents */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C9A857]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-start gap-5">
          <div className="inline-block bg-[#1F2937]/50 backdrop-blur-sm border border-[#C9A857]/40 rounded-full px-4 py-1.5 text-[14px] font-[600] text-[#C9A857] tracking-wide">
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
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-24 relative z-20">
        
        {/* 2. 바로가기 카드 (Shortcut Cards) - 더 직관적이고 세련된 디자인 */}
        <section>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5">
            {shortcutCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.link}
                className="group bg-white border border-slate-200 rounded-[16px] p-5 md:p-7 flex flex-col items-center text-center shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-[#C9A857] transition-all duration-500"
              >
                <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-2xl bg-[#F5F7FA] text-[#0F1A2B] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] text-3xl md:text-4xl flex items-center justify-center transition-all duration-500 mb-4 shadow-inner group-hover:rotate-[10deg]">
                  {card.icon}
                </div>
                <h3 className="text-[14px] md:text-[16px] font-[700] text-[#1F2937] group-hover:text-[#0F1A2B] transition-colors whitespace-nowrap">
                  {card.title}
                </h3>
                <div className="mt-2 w-0 h-[2px] bg-[#C9A857] group-hover:w-full transition-all duration-500"></div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. 최신 글 (Latest Posts) - 데스크톱 4열, 태플릿 3열 */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b-[2px] border-[#0F1A2B] pb-4">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#0F1A2B] tracking-tight">최신 정보 업데이트</h2>
            <Link href="/blog" className="text-[15px] font-[600] text-[#6B7280] hover:text-[#0F1A2B] transition-colors hidden md:flex items-center gap-1 group">
              전체보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-[12px] border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C9A857]/60 transition-all duration-300 flex flex-col overflow-hidden group h-full"
                >
                  {/* 통합된 고정 사이즈 이미지 영역 (16:9 비율) */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img 
                      src={`/images/${post.category === '복지' ? 'ulsan_welfare_main.png' : post.category === '경제' ? 'ulsan_economy_main.png' : post.category === '행사' ? 'ulsan_festival_main.png' : 'ulsan_sightseeing_main.png'}`} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[11px] font-bold text-white bg-[#0F1A2B]/80 backdrop-blur-sm px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                    {/* Date */}
                    <div className="mb-3 flex justify-between items-center">
                       <span className="text-[12px] text-[#6B7280] font-medium">
                         {post.date}
                       </span>
                    </div>

                    <h3 className="text-[18px] font-[700] text-[#1F2937] mb-2 group-hover:text-[#0F1A2B] transition-colors line-clamp-2 leading-snug break-keep">
                      {post.title}
                    </h3>
                    
                    <p className="text-[#6B7280] text-[14px] leading-relaxed mb-4 line-clamp-2 break-keep flex-grow">
                      {post.summary}
                    </p>

                    {/* Bottom read more */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-[#1F2937] font-[600] text-[13px] group-hover:text-[#C9A857] transition-colors">
                      자세히 보기 <span className="ml-1 text-[#C9A857] tracking-tighter">--&gt;</span>
                    </div>
                  </div>
                </Link>
              ))}
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
      <footer className="bg-[#0F1A2B] border-t-4 border-[#C9A857] py-14 text-center px-6 text-[#6B7280] flex flex-col items-center">
        <div className="max-w-6xl w-full flex flex-col items-center gap-6">
          <p className="text-2xl font-black text-white/50 tracking-[0.2em] uppercase">
            asinayo.org
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[14px] font-[600] text-slate-400">
            <span className="cursor-pointer hover:text-white transition-colors">개인정보처리방침</span>
            <span className="cursor-pointer hover:text-white transition-colors">홈페이지이용약관</span>
            <span className="cursor-pointer hover:text-white transition-colors">이메일무단수집거부</span>
          </div>
          <div className="h-px w-24 bg-slate-800 my-2"></div>
          <p className="text-[13px] opacity-60 leading-relaxed max-w-lg break-keep mx-auto">
            © {getLocalDate().split('년')[0]} 울산광역시 아시나요? All rights reserved. <br/>
            본 웹사이트는 울산시의 생활, 복지, 경제 정보를 시민들에게 알기 쉽게 전달하는 비영리 공공안내 포털입니다.
          </p>
        </div>
      </footer>
    </main>
  );
}
