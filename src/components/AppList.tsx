const apps = [
  {
    name: '울산페이',
    desc: '지역 혜택과 캐시백 정보를 확인해 보세요',
    icon: '💳',
    link: 'https://play.google.com/store/apps/details?id=gov.ulsan.uspay'
  },
  {
    name: '울산버스정보',
    desc: '실시간 도착·노선·정류장 정보 확인',
    icon: '🚌',
    link: 'https://play.google.com/store/apps/details?id=com.ulsanbus.city2023'
  },
  {
    name: '왔어 울산?',
    desc: '울산 관광·명소·여행 코스 정보 보기',
    icon: '🏰',
    link: 'https://play.google.com/store/apps/details?id=com.ulsantourist.whale'
  },
  {
    name: '모바일 울산',
    desc: '시정 소식과 민원·예약 포털 바로가기',
    icon: '🏙️',
    link: 'https://www.ulsan.go.kr/u/rep/'
  },
  {
    name: '울산 스마트맵',
    desc: '지도 기반 행정·교통·생활정보 확인',
    icon: '🗺️',
    link: 'https://map.ulsan.go.kr/'
  },
  {
    name: '울산페달·울산몰',
    desc: '공공배달·지역상생 서비스 안내 보기',
    icon: '🍱',
    link: 'https://www.ulsan.go.kr/u/rep/bbs/view.ulsan?bbsId=BBS_0000000000000003&mId=001004001001000000&dataId=180385'
  }
];

export default function AppSection() {
  return (
    <section className="py-6 bg-gradient-to-br from-white to-slate-50 border-t border-slate-100 overflow-hidden relative">
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#C9A857]/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="w-full grid grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] gap-4 mb-5">
          <div className="group h-full rounded-[24px] border-[2px] border-[#0F1A2B] bg-white p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="text-[#C9A857] font-extrabold text-[14px] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-[#C9A857]"></span>
              Digital Ulsan Life
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[22px] border-[2px] border-slate-200 bg-[#F5F7FA] text-[46px] shadow-inner md:h-[104px] md:w-[104px] md:text-[56px] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] transition-colors duration-300">
                📱
              </div>
              <h2 className="text-[28px] md:text-[34px] font-black text-[#0F1A2B] leading-tight break-keep group-hover:text-[#C9A857] transition-colors duration-300">
                내 손안의 울산, <br/>
                <span className="text-[#C9A857]">시민 필수 앱</span> 리스트
              </h2>
            </div>
          </div>

          <div className="group h-full rounded-[24px] border-[2px] border-[#0F1A2B] bg-white p-5 md:p-6 shadow-sm flex flex-col justify-center hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <p className="text-slate-600 text-[16px] md:text-[17px] font-semibold leading-relaxed break-keep group-hover:text-slate-700 transition-colors">
              울산 생활을 두 배 더 편안하게 만들어 줄 공식 앱들을 엄선하여 추천해 드립니다.
            </p>
            <p className="mt-3 inline-flex w-fit rounded-xl border-[2px] border-[#C9A857]/40 bg-[#FFF9EC] px-3 py-2 text-[13px] md:text-[14px] font-black text-[#8A6A1F] break-keep">
              ↗ 모든 앱 링크는 <span className="ml-1 text-[#0F1A2B]">새 창</span>에서 열립니다.
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {apps.map((app, idx) => (
            <a
              key={idx}
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              title={`${app.name} 새창 열기`}
              aria-label={`${app.name} 새창 열기`}
              className="group min-h-[106px] bg-white border-[2px] border-[#0F1A2B] rounded-[24px] p-4 md:p-4.5 flex items-center gap-4 hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="w-[58px] h-[58px] md:w-[62px] md:h-[62px] bg-[#F5F7FA] rounded-[18px] border-[2px] border-slate-200 flex items-center justify-center text-[28px] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] shadow-inner transition-colors duration-300">
                {app.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] md:text-[17px] text-[#0F1A2B] mb-1 flex items-center group-hover:text-[#C9A857] transition-colors gap-2">
                  {app.name}
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>
                <p className="text-slate-400 text-[13px] line-clamp-1 group-hover:text-slate-600 transition-colors">
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
