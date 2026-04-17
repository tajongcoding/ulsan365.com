import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '홈페이지 이용약관 | 아시나요 울산',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
        <h1 className="text-[28px] md:text-[32px] font-black text-[#0F1A2B] mb-2">홈페이지 이용약관</h1>
        <p className="text-slate-500 text-[14px] mb-8">최종 수정일: 2025년 1월 1일</p>

        <div className="prose prose-slate max-w-none text-[16px] leading-relaxed space-y-6 text-[#1F2937]">
          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 울산365(ulsan365.com, 이하 &ldquo;사이트&rdquo;)가 제공하는 울산광역시 생활정보 안내 서비스 이용에 관한 조건 및 절차, 이용자와 사이트의 권리·의무 등 기본적인 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">제2조 (서비스 내용)</h2>
            <p>사이트는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600">
              <li>울산광역시 복지·지원금 정보 안내</li>
              <li>생활 꿀팁, 야간약국, 교통 등 생활정보 제공</li>
              <li>지역 행사·축제·명소 관광 정보</li>
              <li>자주 묻는 질문(FAQ) 안내</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">제3조 (면책 조항)</h2>
            <p>
              본 사이트가 제공하는 정보는 공공 정보 안내를 목적으로 하며, 정확성·완전성을 보증하지 않습니다. 실제 신청 및 이용 시에는 해당 기관에 직접 확인하시기 바랍니다. 정보 이용으로 인한 손해에 대해 사이트는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">제4조 (저작권)</h2>
            <p>
              본 사이트의 모든 콘텐츠(텍스트, 이미지 등)에 대한 저작권은 운영자에게 있으며, 무단 복제·배포·변경을 금지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">제5조 (약관의 변경)</h2>
            <p>
              사이트는 필요에 따라 약관을 변경할 수 있으며, 변경된 약관은 사이트 내 공지를 통해 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-[20px] font-bold text-[#0F1A2B] mb-2">문의</h2>
            <p className="font-semibold text-[#0F1A2B]">이메일: help@asinayo.org</p>
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
