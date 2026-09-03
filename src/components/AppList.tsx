import { buttonLabels } from '@/lib/buttonLabels';

const serviceLinks = [
  {
    name: '정부24',
    desc: '민원·증명·보조금 신청 공식 포털',
    badge: '민원',
    link: 'https://www.gov.kr/portal/main.nologin',
  },
  {
    name: '울산버스정보',
    desc: '실시간 도착·노선·정류장 공식 확인',
    badge: '버스',
    link: 'https://its.ulsan.kr/route/route.do',
  },
  {
    name: '울산모아',
    desc: '공공시설·강좌 통합예약 바로가기',
    badge: '예약',
    link: 'https://ulsan.go.kr/y/yes/main.do',
  },
  {
    name: '울산페이',
    desc: '지역사랑상품권 안내·가맹점 확인',
    badge: '페이',
    link: 'https://www.ulsan.go.kr/u/economy/contents.ulsan?mId=001007004002001000',
  },
  {
    name: '병원·약국',
    desc: '응급의료포털 E-Gen에서 운영기관 확인',
    badge: '의료',
    link: 'https://www.e-gen.or.kr/egen/main.do',
  },
  {
    name: '재난·대피',
    desc: '재난문자·안전지도·대피시설 확인',
    badge: '안전',
    link: 'https://www.safekorea.go.kr/',
  },
];

export default function AppSection() {
  return (
    <section className="py-6 bg-gradient-to-br from-white to-slate-50 border-t border-slate-100 overflow-hidden relative">
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#C9A857]/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="w-full grid grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)] gap-4 mb-5">
          <div className="group h-full rounded-xl border-[2px] border-[#0F1A2B] bg-white p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="text-[#C9A857] font-extrabold text-[14px] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-[#C9A857]"></span>
              Life Shortcut
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-xl border-[2px] border-slate-200 bg-[#F5F7FA] text-[24px] font-black text-[#0F1A2B] shadow-inner md:h-[104px] md:w-[104px] md:text-[28px] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] transition-colors duration-300">
                공식
              </div>
              <h2 className="text-[28px] md:text-[34px] font-black text-[#0F1A2B] leading-tight break-keep group-hover:text-[#C9A857] transition-colors duration-300">
                시민필수 앱 <br/>
                <span className="text-[#C9A857]">공식서비스</span> 6개
              </h2>
            </div>
          </div>

          <div className="group h-full rounded-xl border-[2px] border-[#0F1A2B] bg-white p-5 md:p-6 shadow-sm flex flex-col justify-center hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <p className="text-slate-600 text-[16px] md:text-[17px] font-semibold leading-relaxed break-keep group-hover:text-slate-700 transition-colors">
              정부24, 울산버스정보, 울산모아, 울산페이, 병원·약국, 재난·대피 공식서비스를 바로 확인하세요.
            </p>
            <p className="mt-3 inline-flex w-fit rounded-xl border-[2px] border-[#C9A857]/40 bg-[#FFF9EC] px-3 py-2 text-[13px] md:text-[14px] font-black text-[#8A6A1F] break-keep">
              카드 전체가 <span className="mx-1 text-[#0F1A2B]">공식서비스</span> 새 창으로 연결됩니다.
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {serviceLinks.map((service) => (
            <a
              key={service.name}
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              title={`${service.name} 공식서비스 새창 열기`}
              aria-label={`${service.name} 공식서비스 새창 열기`}
              className="group min-h-[120px] bg-white border-[2px] border-[#0F1A2B] rounded-xl p-4 flex items-center gap-4 hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all duration-300 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A857]"
            >
              <div className="w-[58px] h-[58px] md:w-[62px] md:h-[62px] bg-[#F5F7FA] rounded-xl border-[2px] border-slate-200 flex items-center justify-center text-[17px] font-black text-[#0F1A2B] group-hover:bg-[#0F1A2B] group-hover:text-[#C9A857] shadow-inner transition-colors duration-300">
                {service.badge}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-[16px] md:text-[17px] text-[#0F1A2B] mb-1 group-hover:text-[#C9A857] transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-500 text-[13px] line-clamp-2 group-hover:text-slate-600 transition-colors break-keep">
                  {service.desc}
                </p>
                <p className="mt-2 text-[11px] font-black text-emerald-700">
                  공식 링크 연결됨
                </p>
                <span className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F1A2B] px-4 py-2 text-[13px] font-black text-white transition-colors group-hover:bg-[#C9A857] group-hover:text-[#0F1A2B]">
                  {buttonLabels.officialService}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
