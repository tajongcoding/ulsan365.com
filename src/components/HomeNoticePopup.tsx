'use client';

import { useEffect, useMemo, useState } from 'react';

type HomeNoticePopupProps = {
  enabled?: boolean;
  triggerDelayMs?: number;
};

export default function HomeNoticePopup({
  enabled = true,
  triggerDelayMs = 2400,
}: HomeNoticePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const storageKey = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return `ulsan365-home-notice-${today}`;
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const hiddenToday = window.localStorage.getItem(storageKey) === 'hidden';
    if (hiddenToday) return;

    let opened = false;

    const openNotice = () => {
      if (opened) return;
      opened = true;
      setIsOpen(true);
    };

    const timer = window.setTimeout(openNotice, triggerDelayMs);
    const handleScroll = () => {
      if (window.scrollY > 140) {
        openNotice();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, storageKey, triggerDelayMs]);

  const closePopup = (hideToday = false) => {
    if (hideToday && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, 'hidden');
    }
    setIsOpen(false);
  };

  if (!enabled || !isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-3 z-[90] flex justify-center px-3 md:px-4">
      <div className="w-full max-w-5xl rounded-2xl border border-[#C9A857]/40 bg-[#0F1A2B]/95 text-white shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
          <div className="min-w-0">
            <p className="text-[11px] font-black tracking-[0.22em] text-[#C9A857] uppercase">Notice</p>
            <p className="mt-1 text-[13px] md:text-[14px] leading-relaxed text-slate-100 break-keep">
              <span className="font-extrabold text-white">홈 이미지와 일부 상세 표기를 최종 점검 중입니다.</span>{' '}
              새로고침 후 정상 반영되는 경우가 있으며, 순차적으로 안정화하고 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => closePopup(true)}
              className="rounded-full border border-white/30 px-3 py-1.5 text-[12px] font-black text-slate-100 hover:border-[#C9A857] hover:text-[#C9A857]"
            >
              오늘 숨기기
            </button>
            <button
              type="button"
              onClick={() => closePopup(false)}
              className="rounded-full border border-[#C9A857]/50 bg-[#C9A857]/10 px-3 py-1.5 text-[12px] font-black text-[#F6D98A] hover:bg-[#C9A857]/20"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
