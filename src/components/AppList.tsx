import Link from 'next/link';

const apps = [
  { 
    name: '울산페이', 
    desc: '지역 한정 7~10% 할인 혜택까지!', 
    icon: '💳', 
    link: 'https://play.google.com/store/apps/details?id=com.konai.parkland.ulsan' 
  },
  { 
    name: '울산 버스정보', 
    desc: '실시간 도착 정보 가장 정확함', 
    icon: '🚌', 
    link: 'https://play.google.com/store/apps/details?id=com.unibus.ulsan' 
  },
  { 
    name: '울산 관광 가이드', 
    desc: '명소부터 맛집까지 한눈에!', 
    icon: '🏰', 
    link: 'https://play.google.com/store/apps/details?id=com.ulsankr.tour' 
  },
  { 
    name: '모바일 울산', 
    desc: '시정 소식부터 예약까지 포털', 
    icon: '🏙️', 
    link: 'https://play.google.com/store/apps/details?id=kr.go.ulsan.mobile' 
  },
  { 
    name: '똑똑 울산', 
    desc: '나에게 딱 맞는 시정 소식 알림', 
    icon: '🔔', 
    link: 'https://play.google.com/store/apps/details?id=kr.go.ulsan.ddp' 
  },
  { 
    name: '착한배달 울산', 
    desc: '소상공인을 돕는 착한 주문 서비스', 
    icon: '🍱', 
    link: 'https://play.google.com/store/apps/details?id=com.good.delivery.ulsan' 
  }
];

export default function AppSection() {
  return (
    <section className="py-6 bg-gradient-to-br from-white to-slate-50 border-t border-slate-100 overflow-hidden relative">
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#C9A857]/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
          <div className="flex-1">
            <div className="text-[#C9A857] font-extrabold text-[14px] uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-8 h-px bg-[#C9A857]"></span>
               Digital Ulsan Life
            </div>
            <h2 className="text-[28px] md:text-[34px] font-black text-[#0F1A2B] leading-tight break-keep">
              내 손안의 울산, <br/>
              <span className="text-[#C9A857]">시민 필수 앱</span> 리스트 📱
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-[16px] leading-relaxed break-keep pb-2">
            울산 생활을 두 배 더 편안하게 만들어 줄 공식 앱들을 엄선하여 추천해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {apps.map((app, idx) => (
            <a
              key={idx}
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-slate-200 rounded-[20px] p-6 flex items-center gap-5 hover:border-[#C9A857] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-[64px] h-[64px] bg-[#F5F7FA] rounded-2xl flex items-center justify-center text-3xl group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] shadow-inner transition-colors duration-300">
                {app.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[18px] text-[#0F1A2B] mb-1 flex items-center group-hover:text-[#C9A857] transition-colors gap-2">
                  {app.name}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>
                <p className="text-slate-400 text-[14px] line-clamp-1 group-hover:text-slate-600 transition-colors">
                  {app.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
