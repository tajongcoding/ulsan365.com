import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이메일 무단수집 거부 | 아시나요 울산',
  robots: { index: false },
};

export default function NoEmailPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
        <h1 className="text-[28px] md:text-[32px] font-black text-[#0F1A2B] mb-2">이메일 무단수집 거부</h1>
        <p className="text-slate-500 text-[14px] mb-8">정보통신망법 제50조의2 제1항에 따른 공지</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-amber-900 text-[16px] leading-relaxed font-semibold">
          본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사처벌됨을 유념하시기 바랍니다.
        </div>

        <div className="prose prose-slate max-w-none text-[16px] leading-relaxed space-y-4 text-[#1F2937]">
          <p>
            울산365(ulsan365.com)에 게시된 이메일 주소(help@asinayo.org)는 오직 이용자 문의 및 서비스 안내를 목적으로 공개됩니다.
          </p>
          <p>
            스팸성 광고·홍보 메일, 무단 수집을 통한 이메일 발송은 &lsquo;정보통신망 이용촉진 및 정보보호 등에 관한 법률&rsquo; 제50조 이하의 규정에 의해 처벌받을 수 있습니다.
          </p>
          <p>
            이를 위반 시 1천만 원 이하의 벌금에 처해질 수 있습니다.
          </p>
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
