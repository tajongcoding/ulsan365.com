"use client";

import React from 'react';

type CoupangBannerProps = {
  variant?: 'default' | 'inline' | 'compact';
};

export default function CoupangBanner({ variant = 'default' }: CoupangBannerProps) {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

  // 파트너스 아이디가 없거나 아직 입력되지 않은 상태이면 렌더링하지 않음
  if (!partnerId || partnerId === '나중에_입력') {
    return null;
  }

  const styleMap = {
    default: {
      wrapper: 'my-6 w-full',
      inner: 'flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:py-10 md:px-8',
      text: '생활의 모든 것, ',
      emphasis: '쿠팡 특가 바로가기 →',
    },
    inline: {
      wrapper: 'my-4 w-full',
      inner: 'flex flex-col md:flex-row items-center justify-between gap-5 p-6 md:px-7',
      text: '지금 많이 찾는 생활용품, ',
      emphasis: '실속 특가 확인하기 →',
    },
    compact: {
      wrapper: 'my-3 w-full',
      inner: 'flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:px-6',
      text: '울산 생활 준비물, ',
      emphasis: '빠르게 보러가기 →',
    },
  } as const;

  const currentStyle = styleMap[variant];

  return (
    <div className={currentStyle.wrapper}>
      <a
        href="https://link.coupang.com/a/bMcTst"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white border-[2px] border-[#0F1A2B] rounded-[16px] shadow-sm hover:shadow-md hover:border-[#C9A857] hover:-translate-y-1 transition-all overflow-hidden group"
      >
        <div className={currentStyle.inner}>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* 쿠팡 로고 이미지 삽입 */}
            <div className="bg-white px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center shrink-0">
              <img
                src="https://image9.coupangcdn.com/image/coupang/common/logo_coupang_w350.png"
                alt="Coupang Logo"
                className="h-6 md:h-8 object-contain"
              />
            </div>
            <p className="text-[20px] md:text-[24px] font-black text-[#0F1A2B] group-hover:text-[#C9A857] transition-colors m-0 break-keep mt-2 md:mt-0 text-center md:text-left">
              {currentStyle.text}<span className="text-[#C9A857]">{currentStyle.emphasis}</span>
            </p>
          </div>
          <div className="text-[14px] md:text-[15px] text-slate-500 font-[600] text-center md:text-right leading-relaxed mt-2 md:mt-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            쿠팡 파트너스 활동의 일환으로
            수수료를 제공받으며, <br className="hidden lg:block" />
            수익금은 <strong className="text-[#0F1A2B] text-[16px] md:text-[17px] font-extrabold">아시나요 울산</strong> 서비스 운영비로 사용됩니다.
          </div>
        </div>
      </a>
    </div>
  );
}
