import type { Metadata } from 'next';
import Link from 'next/link';
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
] as const;

const quickLinks = [
  { label: '복지 정보', href: '/blog?category=복지' },
  { label: '경제 정보', href: '/blog?category=경제' },
  { label: '생활 정보', href: '/blog?category=생활' },
  { label: '행사·축제', href: '/blog?category=행사' },
  { label: '명소·관광', href: '/blog?category=명소' },
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

      <div className="max-w-4xl mx-auto px-4 md:px-5 mt-8 flex flex-col gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[14px] font-bold text-[#C9A857] tracking-widest uppercase mb-2">Quick Access</p>
              <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B]">많이 찾는 주제 바로가기</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-[15px] font-semibold text-[#0F1A2B] hover:border-[#C9A857] hover:text-[#C9A857] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B]">자주 묻는 질문 {faqItems.length}선</h2>
            <p className="text-slate-500 mt-2 break-keep">
              아래 질문을 눌러 핵심 답변을 바로 확인하실 수 있습니다.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#C9A857] transition-colors"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#0F1A2B]/5 px-2.5 py-1 text-[12px] font-bold text-[#0F1A2B] mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-[17px] md:text-[19px] font-extrabold text-[#0F1A2B] break-keep">
                      {item.question}
                    </h3>
                  </div>
                  <span className="text-[#C9A857] text-xl font-bold group-open:rotate-45 transition-transform">＋</span>
                </summary>

                <div className="mt-4 pl-0 md:pl-1 text-slate-600 leading-relaxed break-keep">
                  <p>{item.answer}</p>
                  <div className="mt-4">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-[15px] font-bold text-[#0F1A2B] hover:text-[#C9A857] transition-colors"
                    >
                      관련 정보 더 보기 →
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
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
