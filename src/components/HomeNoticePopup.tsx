'use client';

import { useEffect, useMemo, useState } from 'react';

export default function HomeNoticePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const storageKey = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `ulsan365-home-notice-${today}`;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hiddenToday = window.localStorage.getItem(storageKey) === 'hidden';
    if (!hiddenToday) {
      setIsOpen(true);
    }
  }, [storageKey]);

  const closePopup = (hideToday = false) => {
    if (hideToday && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, 'hidden');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-[#C9A857]/40 bg-white shadow-2xl">
        <div className="bg-[#0F1A2B] px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-black tracking-[0.22em] text-[#C9A857] uppercase">Notice</p>
              <h2 className="text-[22px] font-black">홈페이지 안내</h2>
            </div>
            <button
              type="button"
              onClick={() => closePopup(false)}
              className="rounded-lg border-[2px] border-white/70 bg-transparent px-4 py-1.5 text-[12px] font-black text-white hover:border-[#C9A857] hover:text-[#C9A857]"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="px-5 py-5 text-slate-700">
          <p className="mb-3 text-[16px] font-bold text-[#0F1A2B] break-keep">
            홈 이미지 매칭 및 전체 페이지 표시에 대해 아래 내용을 참고해 주세요.
          </p>

          <div className="mb-4 rounded-xl border-[2px] border-amber-300 bg-amber-50 px-4 py-3 text-[14px] md:text-[15px] leading-relaxed text-amber-900 break-keep">
            이용에 불편을 드려 죄송합니다. 현재 홈 이미지 매칭, 일부 레이아웃, 상세페이지 표기 오류 가능성을 순차적으로 점검하고 있으며 빠르게 안정화하겠습니다.
          </div>

          <ul className="space-y-2 text-[14px] md:text-[15px] leading-relaxed break-keep">
            <li>• 자동 이미지 매칭 특성상 일부 글에서 이미지와 제목·내용이 완전히 일치하지 않을 수 있습니다.</li>
            <li>• 홈 화면 및 일부 상세페이지에서 간헐적인 배치·표시 오류가 발생할 수 있습니다.</li>
            <li>• 현재 순차 점검 및 수정 중이며, 새로고침 후 정상 반영되는 경우가 있습니다.</li>
          </ul>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => closePopup(true)}
              className="rounded-lg border-[2px] border-slate-400 bg-transparent px-4 py-2 text-[14px] font-black text-slate-700 hover:border-[#C9A857] hover:text-[#0F1A2B]"
            >
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={() => closePopup(false)}
              className="rounded-lg border-[2px] border-slate-400 bg-transparent px-4 py-2 text-[14px] font-black text-slate-700 hover:border-[#C9A857] hover:text-[#0F1A2B]"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
