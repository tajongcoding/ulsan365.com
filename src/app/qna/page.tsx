import type { Metadata } from 'next';
import Link from 'next/link';
import FaqSearchBoard from '@/components/FaqSearchBoard';
import QnaInquiryForm from '@/components/QnaInquiryForm';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: '울산 생활정보 FAQ | 자주 묻는 질문',
  description:
    '울산 시민이 자주 찾는 생활·복지·교통·지원금 정보를 한곳에 모은 FAQ 및 문의 페이지입니다.',
  alternates: {
    canonical: absoluteUrl('/qna'),
  },
  openGraph: {
    title: '울산 생활정보 FAQ | 자주 묻는 질문',
    description:
      '울산 시민이 자주 찾는 생활·복지·교통·지원금 정보를 빠르게 확인해 보세요.',
    url: absoluteUrl('/qna'),
    images: [absoluteUrl(siteConfig.ogImage)],
  },
};

const faqItems = [
  {
    question: '울산 청년월세 지원은 어디서 신청하나요?',
    answer:
      '청년 월세 지원은 모집 시기마다 울산광역시 또는 정부24 공고를 통해 신청하는 경우가 많습니다. 신청 대상, 소득 기준, 제출 서류가 달라질 수 있으니 공고문과 접수 기간을 꼭 함께 확인해 주세요.',
    category: '경제',
    href: '/blog?category=경제',
  },
  {
    question: '울산 대형폐기물 신고는 어떻게 하나요?',
    answer:
      '거주 중인 구·군청 대형폐기물 신고 페이지 또는 지정 수거 접수 창구를 통해 신청합니다. 품목별 수수료가 다르므로 배출 전 신고번호와 수거일을 꼭 확인하는 것이 좋습니다.',
    category: '생활',
    href: '/blog?category=생활',
  },
  {
    question: '울산 야간약국은 어디서 찾을 수 있나요?',
    answer:
      '늦은 밤이나 휴일에는 응급의료포털 E-Gen, 119, 129를 통해 운영 중인 약국과 의료기관을 확인하는 것이 가장 빠릅니다. 방문 전 전화로 운영 여부를 다시 확인하면 더욱 안전합니다.',
    category: '생활',
    href: '/blog?category=생활',
  },
  {
    question: '울산 임산부 택시 지원은 어떤 조건이 있나요?',
    answer:
      '임산부 교통 지원은 거주지, 임신 확인 서류, 신청 시기 등의 조건이 함께 안내되는 경우가 많습니다. 세부 요건은 연도별 정책에 따라 달라질 수 있어 최신 공고를 기준으로 확인하셔야 합니다.',
    category: '복지',
    href: '/blog?category=복지',
  },
  {
    question: '울산페이 할인 혜택은 어떻게 받나요?',
    answer:
      '울산페이는 충전 할인율과 사용처가 시기별로 달라질 수 있습니다. 앱 설치 후 가맹점 여부를 확인하고, 충전 이벤트 기간에 맞춰 사용하면 체감 혜택이 커집니다.',
    category: '경제',
    href: '/blog?category=경제',
  },
  {
    question: '행사·축제 일정은 어디서 가장 빨리 볼 수 있나요?',
    answer:
      '울산시 공식 공지와 지역 행사 안내를 함께 보는 것이 좋습니다. 이 사이트의 행사·축제 카테고리에서도 자주 찾는 일정을 보기 쉽게 정리해두고 있습니다.',
    category: '행사',
    href: '/blog?category=행사',
  },
  {
    question: '울산 다자녀 가정 혜택은 어디서 확인하나요?',
    answer:
      '다자녀 혜택은 교통, 공공시설, 문화이용, 보육 분야로 나뉘는 경우가 많습니다. 울산시와 각 구·군 공고를 함께 확인하면 적용 대상과 혜택 범위를 더 정확하게 볼 수 있습니다.',
    category: '복지',
    href: '/blog?category=복지',
  },
  {
    question: '울산 소상공인 지원사업은 어떤 것이 있나요?',
    answer:
      '소상공인 대상 지원은 경영안정자금, 컨설팅, 디지털 전환, 마케팅 지원처럼 여러 유형으로 나뉩니다. 사업 공고마다 업종과 매출 기준이 다르므로 조건을 먼저 확인하는 것이 좋습니다.',
    category: '경제',
    href: '/blog?category=경제',
  },
  {
    question: '울산 시내버스 도착 정보는 어디서 확인하나요?',
    answer:
      '울산버스정보 앱이나 버스정보 시스템을 이용하면 정류장별 실시간 도착 시간을 확인할 수 있습니다. 출퇴근 시간에는 실제 도로 상황에 따라 오차가 생길 수 있어 여유 있게 확인하는 것이 좋습니다.',
    category: '생활',
    href: '/blog?category=생활',
  },
  {
    question: '울산 아이와 가볼 만한 실내 명소는 어디가 좋나요?',
    answer:
      '장마철이나 더운 날에는 실내 전시관, 체험관, 박물관, 키즈 친화형 공간을 함께 보는 것이 좋습니다. 이 사이트의 명소·관광 카테고리에서 가족 나들이 장소를 정리해두고 있습니다.',
    category: '명소',
    href: '/blog?category=명소',
  },
] as const;

const quickLinks = [
  { label: '복지 정보', href: '/blog?category=복지', icon: '💝', desc: '임산부·가정·어르신 지원' },
  { label: '경제 정보', href: '/blog?category=경제', icon: '📈', desc: '지원금·소상공인·청년정책' },
  { label: '생활 정보', href: '/blog?category=생활', icon: '🏡', desc: '교통·약국·생활 민원 안내' },
  { label: '행사·축제', href: '/blog?category=행사', icon: '🎉', desc: '주말 일정과 지역 행사 모음' },
  { label: '명소·관광', href: '/blog?category=명소', icon: '📸', desc: '울산 나들이 코스와 명소' },
];

const faqGuideCards = [
  {
    title: '공고문 먼저 확인',
    desc: '지원금·행사 일정은 연도와 모집 시기마다 달라질 수 있어 최신 공고가 가장 중요합니다.',
    icon: '📌',
  },
  {
    title: '대상·서류 체크',
    desc: '거주지, 연령, 소득, 신청기한, 증빙서류를 함께 확인하면 실제 신청 과정이 훨씬 수월합니다.',
    icon: '🗂️',
  },
  {
    title: '문의 경로 활용',
    desc: '헷갈리는 부분은 문의 폼과 공식 민원 채널을 함께 사용하면 보다 정확하게 확인할 수 있습니다.',
    icon: '💬',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function QnaBoard() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#1F2937] font-sans pb-24 selection:bg-[#C9A857]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="bg-[#0F1A2B] text-white py-12 md:py-14 px-4 md:px-5 border-b-[4px] border-[#C9A857] relative overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-[#C9A857]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-[#C9A857]/30 rounded-full px-3 py-1 text-[13px] font-[600] text-[#C9A857] mb-4">
            ULSAN FAQ GUIDE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 break-keep">
            울산 생활정보 <span className="text-[#C9A857]">자주 묻는 질문</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-[400] max-w-2xl mx-auto break-keep leading-relaxed">
            울산 시민들이 자주 궁금해하는 복지, 생활, 교통, 지원금 정보를
            한곳에서 빠르게 확인해 보세요.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-5 mt-8 flex flex-col gap-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[22px] border-[2px] border-[#0F1A2B] bg-white p-5 shadow-sm">
            <p className="text-[12px] font-black tracking-[0.18em] text-[#C9A857] uppercase">FAQ Point</p>
            <p className="mt-2 text-[30px] font-black text-[#0F1A2B]">{faqItems.length}선</p>
            <p className="mt-2 text-[14px] text-slate-500 break-keep">실제 자주 묻는 질문만 먼저 골라 빠르게 정리했습니다.</p>
          </div>
          <div className="rounded-[22px] border-[2px] border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[12px] font-black tracking-[0.18em] text-[#C9A857] uppercase">Quick Menu</p>
            <p className="mt-2 text-[30px] font-black text-[#0F1A2B]">{quickLinks.length}개</p>
            <p className="mt-2 text-[14px] text-slate-500 break-keep">복지, 경제, 생활, 행사, 관광 카테고리로 바로 이동할 수 있습니다.</p>
          </div>
          <div className="rounded-[22px] border-[2px] border-slate-200 bg-gradient-to-br from-[#0F1A2B] to-[#1E293B] p-5 shadow-sm text-white">
            <p className="text-[12px] font-black tracking-[0.18em] text-[#C9A857] uppercase">Need Help</p>
            <p className="mt-2 text-[24px] font-black">문의 폼 제공</p>
            <p className="mt-2 text-[14px] text-slate-300 break-keep">원하는 답변이 없으면 이메일 문의로 바로 연결할 수 있습니다.</p>
          </div>
        </section>

        <section className="bg-white rounded-[24px] shadow-sm border-[2px] border-[#0F1A2B] p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[14px] font-bold text-[#C9A857] tracking-widest uppercase mb-2">Quick Access</p>
              <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B]">많이 찾는 주제 바로가기</h2>
              <p className="mt-2 text-slate-500 break-keep">필요한 메뉴부터 바로 들어가 최신 안내 글을 확인해 보세요.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-[#C9A857] hover:bg-white hover:-translate-y-0.5 transition-all"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[22px] shadow-sm border border-slate-200 group-hover:border-[#C9A857]/50">
                    {link.icon}
                  </div>
                  <h3 className="text-[16px] font-black text-[#0F1A2B] break-keep">{link.label}</h3>
                  <p className="mt-1 text-[13px] text-slate-500 leading-relaxed break-keep">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSearchBoard items={faqItems} />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqGuideCards.map((card) => (
            <div key={card.title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F7FA] text-[22px] border border-slate-200">
                {card.icon}
              </div>
              <h3 className="text-[18px] font-black text-[#0F1A2B] mb-2 break-keep">{card.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed break-keep">{card.desc}</p>
            </div>
          ))}
        </section>

        <QnaInquiryForm />

        <section className="bg-[#0F1A2B] text-white rounded-2xl p-5 md:p-6 border border-[#C9A857]/20 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-[#C9A857] font-bold text-[14px] uppercase tracking-widest mb-2">Need Help?</p>
              <h2 className="text-[24px] md:text-[28px] font-black mb-2 break-keep">
                원하는 답변이 없으신가요?
              </h2>
              <p className="text-slate-300 break-keep leading-relaxed">
                문의 폼 또는 이메일로 남겨주시면 확인 후 순차적으로 안내해 드립니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center justify-center rounded-xl bg-[#C9A857] px-5 py-3 font-bold text-[#0F1A2B] hover:brightness-105 transition"
              >
                직접 이메일 보내기
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10 transition"
              >
                최신 글 보러가기
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-2 text-center flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#0F1A2B] hover:bg-slate-100 bg-white border border-slate-300 px-6 py-3 rounded-lg font-[600] transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
