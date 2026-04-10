"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type GoogleAdSlotProps = {
  slot?: string;
  label?: string;
  className?: string;
};

export default function GoogleAdSlot({
  slot,
  label = 'Google 광고',
  className = '',
}: GoogleAdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isReady = !!client && client !== '나중에_입력' && !!slot && slot !== '나중에_입력';
  const shouldPreviewPlaceholder = process.env.NODE_ENV !== 'production';

  if (!isReady && !shouldPreviewPlaceholder) {
    return null;
  }

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore duplicate push/runtime ad script issues
    }
  }, [isReady, slot]);

  return (
    <section className={`w-full ${className}`} aria-label="광고 영역">
      <div className="overflow-hidden rounded-[20px] border-[2px] border-[#0F1A2B] bg-gradient-to-br from-white to-slate-50 shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 md:px-5">
          <span className="inline-flex items-center rounded-full bg-[#FFF7E1] px-2.5 py-1 text-[11px] font-black tracking-[0.16em] text-[#8A6A1F] uppercase">
            Ad
          </span>
          <span className="text-[12px] md:text-[13px] font-bold text-slate-500">{label}</span>
        </div>

        {isReady ? (
          <div className="px-3 py-3 md:px-4 md:py-4">
            <ins
              className="adsbygoogle block min-h-[110px] w-full"
              style={{ display: 'block' }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="px-5 py-5 md:px-6 md:py-6 text-center">
            <p className="text-[16px] md:text-[17px] font-black text-[#0F1A2B] break-keep">
              Google 광고 슬롯 준비중
            </p>
            <p className="mt-2 text-[13px] md:text-[14px] leading-relaxed text-slate-500 break-keep">
              AdSense 승인 후 `slot ID`를 넣으면 이 위치에 반응형 배너가 자동 노출됩니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
