import type { Metadata } from 'next';
import Link from 'next/link';
import QnaInquiryForm from '@/components/QnaInquiryForm';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '울산365 간단 문의·제보',
  description: '울산365에 문의하거나 잘못된 정보, 변경 정보, 새 울산 정보를 간단히 남길 수 있는 게시판입니다.',
  alternates: { canonical: absoluteUrl('/inquiry') },
};

export default function InquiryPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] pb-24 text-[#1F2937]">
      <section className="border-b-4 border-[#C9A857] bg-[#0F1A2B] px-4 py-12 text-white md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-black tracking-[0.18em] text-[#C9A857]">ULSAN365 INQUIRY</p>
          <h1 className="text-3xl font-black md:text-5xl">간단 문의·제보</h1>
          <p className="mt-4 break-keep text-lg leading-relaxed text-slate-300">궁금한 점, 잘못된 정보, 변경된 정보, 새 울산 정보를 이름 없이 남겨 주세요.</p>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-4 pt-8 md:px-5">
        <QnaInquiryForm />
        <div className="mt-6 text-center">
          <Link href="/qna" className="text-sm font-bold text-slate-500 hover:text-[#0F1A2B]">FAQ 먼저 보기 →</Link>
        </div>
      </div>
    </main>
  );
}
