"use client";

import { useState } from 'react';

export default function QnaInquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setNotice('이름, 이메일, 문의 내용을 모두 입력해 주세요.');
      return;
    }

    const subject = encodeURIComponent(`[아시나요 울산 문의] ${name}님의 질문`);
    const body = encodeURIComponent(
      `이름: ${name}\n이메일: ${email}\n\n문의 내용:\n${message}\n\n--\n아시나요 울산 문의 폼에서 전송됨`
    );

    window.location.href = `mailto:help@asinayo.org?subject=${subject}&body=${body}`;
    setNotice('이메일 앱이 열리지 않으면 help@asinayo.org 로 직접 보내주세요.');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[24px] border-[2px] border-[#0F1A2B] p-6 md:p-8 shadow-sm">
      <div className="mb-5">
        <p className="text-[14px] font-bold text-[#C9A857] tracking-widest uppercase mb-2">Contact Form</p>
        <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B] mb-2">문의 남기기</h2>
        <p className="text-slate-500 break-keep">
          궁금한 내용을 남겨주시면 이메일로 바로 문의를 보낼 수 있습니다.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-[13px] leading-relaxed text-slate-600 break-keep">
        자주 찾는 질문은 위 FAQ에서 먼저 확인하고, 세부 조건이나 최신 공고 확인이 필요하면 아래 메일 문의를 이용해 주세요.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-[14px] font-semibold text-[#0F1A2B]">
          이름
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#C9A857] focus:ring-2 focus:ring-[#C9A857]/20"
          />
        </label>
        <label className="flex flex-col gap-2 text-[14px] font-semibold text-[#0F1A2B]">
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#C9A857] focus:ring-2 focus:ring-[#C9A857]/20"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-[14px] font-semibold text-[#0F1A2B]">
        문의 내용
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="예: 울산 청년 지원금 신청 조건이 궁금합니다."
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#C9A857] focus:ring-2 focus:ring-[#C9A857]/20 resize-y"
        />
      </label>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-[13px] text-slate-500 break-keep">
          제출 시 메일 앱이 실행되며, 답변은 순차적으로 확인됩니다.
        </p>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-[#0F1A2B] px-5 py-3 font-bold text-white hover:bg-[#C9A857] hover:text-[#0F1A2B] transition-colors"
        >
          이메일로 문의 보내기
        </button>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-600">
          {notice}
        </p>
      )}
    </form>
  );
}
