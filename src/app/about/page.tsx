import type { Metadata } from 'next';
import Link from 'next/link';
import CoupangBanner from '@/components/CoupangBanner';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '아시나요 울산 소개 | 울산 생활정보 포털',
  description: '아시나요 울산이 어떤 목적과 기준으로 울산 생활정보를 정리하는지 소개합니다.',
  alternates: {
    canonical: absoluteUrl('/about'),
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans selection:bg-[#C9A857]/30 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F1A2B] text-white py-14 md:py-16 px-4 md:px-5 border-b-[4px] border-[#C9A857]">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C9A857]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto w-full text-center relative z-10 flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 bg-[#1F2937]/50 border border-[#C9A857]/30 rounded-full px-5 py-2 text-[14px] font-[600] text-[#C9A857] tracking-widest">
            <span className="w-1.5 h-1.5 bg-[#C9A857] rounded-full animate-pulse"></span>
ABOUT ASINAYO ULSAN
          </div>
          <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-tight leading-[1.2] break-keep">
            울산을 가장 <span className="text-[#C9A857]">가깝게</span>,<br />
            매일이 특별해지는 공간
          </h1>
          <p className="text-slate-300 text-[18px] md:text-[20px] font-medium max-w-2xl mt-2 leading-relaxed break-keep">
아시나요 울산에서 내 일상에 꼭 필요한 생활 정보를 놓치지 마세요.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-4 md:px-5 mt-10 flex flex-col gap-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border-[2px] border-[#0F1A2B]">
          <h2 className="text-[28px] font-bold text-[#0F1A2B] mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#C9A857] rounded-full"></span>
            아시나요 울산?
          </h2>
          <div className="space-y-6 text-[16px] md:text-[18px] text-slate-600 leading-loose break-keep">
            <p>
              안녕하세요! <strong>아시나요 울산</strong>은 울산광역시 시민들의 더 나은 일상을 위해 만들어진 
              <span className="text-[#0F1A2B] font-bold"> 생활 밀착형 공공 정보 안내 포털</span>입니다.
            </p>
            <p>
              시청이나 관공서 홈페이지의 방대한 정보와 복잡한 메뉴 속에서 헤매셨나요? 우리 포털은 
              많은 분들이 가장 자주 찾는 <strong className="text-[#C9A857]">따뜻한 복지 혜택</strong>, 
              가계에 보탬이 되는 <strong className="text-[#C9A857]">유익한 경제 소식</strong>, 
              일상을 편리하게 만드는 <strong className="text-[#C9A857]">초간단 생활 지식</strong>, 
              그리고 주말을 즐겁게 채워줄 <strong className="text-[#C9A857]">알찬 행사와 명소 정보</strong>를 
              필요한 것만 쏙쏙 뽑아 가장 직관적이고 알기 쉽게 정리해 드립니다.
            </p>
            <p>
              복잡하고 딱딱한 행정 용어는 빼고, 동네 이웃이 친절하게 설명하듯 쉽고 부드럽게 쓰겠습니다.<br />
              누구나 스마트폰 하나로 울산의 좋은 소식들을 가장 먼저, 편안하게 받아보실 수 있도록 최선을 다하겠습니다.
            </p>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 md:p-7 min-h-[230px] shadow-sm border-[2px] border-slate-200 text-center hover:border-[#0F1A2B] hover:-translate-y-1 transition-all flex flex-col justify-center">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100">
              🎯
            </div>
            <h3 className="text-[20px] font-bold text-[#0F1A2B] mb-2">정확한 정보</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed break-keep">
              울산시의 공식 발표와 소식을 꼼꼼하게 확인하여 신뢰할 수 있는 검증된 정보만 전달합니다.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-7 min-h-[230px] shadow-sm border-[2px] border-slate-200 text-center hover:border-[#0F1A2B] hover:-translate-y-1 transition-all flex flex-col justify-center">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100">
              💡
            </div>
            <h3 className="text-[20px] font-bold text-[#0F1A2B] mb-2">쉬운 이해</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed break-keep">
              아무리 복잡한 정책과 지원 사업이라도 처음 접하는 분들의 눈높이에 맞춰 친절하게 풀어서 설명합니다.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-7 min-h-[230px] shadow-sm border-[2px] border-slate-200 text-center hover:border-[#0F1A2B] hover:-translate-y-1 transition-all flex flex-col justify-center">
            <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-100">
              🤝
            </div>
            <h3 className="text-[20px] font-bold text-[#0F1A2B] mb-2">시민 소통</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed break-keep">
              항상 우리 이웃인 울산 시민들의 목소리에 귀를 기울이고, 일상의 확실한 가치를 높이는 데 함께합니다.
            </p>
          </div>
        </div>

        <div className="mt-2">
          <CoupangBanner variant="inline" />
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/" className="bg-[#0F1A2B] text-[18px] text-white font-bold px-10 py-5 rounded-2xl hover:bg-[#C9A857] transition-colors shadow-[0_10px_20px_rgba(15,26,43,0.3)]">
            메인 화면으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
