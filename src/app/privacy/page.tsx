import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 아시나요 울산',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
        <h1 className="text-[28px] md:text-[32px] font-black text-[#0F1A2B] mb-2">개인정보처리방침</h1>
        <p className="text-slate-500 text-[14px] mb-8">최종 수정일: 2025년 1월 1일</p>

        <div className="prose prose-slate max-w-none text-[16px] leading-relaxed space-y-6 text-[#1F2937]">
          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">1. 수집하는 개인정보 항목</h2>
            <p>
              울산365(ulsan365.com)는 별도의 회원가입 없이 이용할 수 있는 서비스입니다. 다만, 서비스 품질 개선을 위해 아래와 같은 정보를 자동으로 수집할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>접속 IP 주소, 쿠키, 방문 일시, 서비스 이용 기록 (Google Analytics, 네이버 애널리틱스)</li>
              <li>광고 노출 및 클릭 데이터 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>서비스 이용 통계 분석 및 품질 향상</li>
              <li>맞춤형 광고 제공</li>
              <li>서비스 오류 감지 및 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">3. 개인정보의 보유 및 이용 기간</h2>
            <p>수집된 개인정보는 목적 달성 후 즉시 파기하며, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">4. 쿠키(Cookie) 운영</h2>
            <p>
              본 사이트는 Google Analytics 및 Google AdSense를 통해 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 서비스 이용이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">5. 개인정보보호 책임자</h2>
            <p>개인정보 처리 관련 문의는 아래 이메일로 연락하여 주시기 바랍니다.</p>
            <p className="mt-1 font-semibold text-[#0F1A2B]">이메일: help@asinayo.org</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link href="/" className="text-[#0F1A2B] font-bold hover:text-[#C9A857] transition-colors">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
