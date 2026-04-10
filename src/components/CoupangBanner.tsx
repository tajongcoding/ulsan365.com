"use client";

import React from 'react';

type CoupangBannerProps = {
  variant?: 'default' | 'inline' | 'compact';
  topic?: string;
};

const normalizeTopic = (topic?: string) => {
  const value = (topic || '').trim();

  if (value.includes('복지')) return 'welfare';
  if (value.includes('경제')) return 'economy';
  if (value.includes('생활')) return 'life';
  if (value.includes('행사')) return 'event';
  if (value.includes('명소')) return 'attraction';

  return 'default';
};

export default function CoupangBanner({ variant = 'default', topic = 'default' }: CoupangBannerProps) {
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

  const topicKey = normalizeTopic(topic);
  const topicMap = {
    default: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_DEFAULT || 'https://www.coupang.com/np/search?q=%EC%83%9D%ED%99%9C%EC%9A%A9%ED%92%88',
      emphasis: currentStyleMap(variant).emphasis,
    },
    welfare: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_WELFARE || 'https://www.coupang.com/np/search?q=%EC%9C%A1%EC%95%84%EC%9A%A9%ED%92%88',
      emphasis: '물티슈·기저귀 인기템 →',
    },
    economy: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_ECONOMY || 'https://www.coupang.com/np/search?q=%EC%83%9D%ED%99%9C%EC%9A%A9%ED%92%88+%ED%95%A0%EC%9D%B8',
      emphasis: '생수·휴지 특가 보기 →',
    },
    life: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_LIFE || 'https://www.coupang.com/np/search?q=%EC%83%9D%ED%99%9C%EC%9A%A9%ED%92%88',
      emphasis: '정리·청소 추천템 →',
    },
    event: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_EVENT || 'https://www.coupang.com/np/search?q=%ED%94%BC%ED%81%AC%EB%8B%89%20%EC%9A%A9%ED%92%88',
      emphasis: '돗자리·텀블러 준비물 →',
    },
    attraction: {
      href: process.env.NEXT_PUBLIC_COUPANG_LINK_ATTRACTION || 'https://www.coupang.com/np/search?q=%EC%97%AC%ED%96%89%20%EC%9A%A9%ED%92%88',
      emphasis: '보조배터리·우산 추천 →',
    },
  } as const;

  function currentStyleMap(currentVariant: 'default' | 'inline' | 'compact') {
    return styleMap[currentVariant];
  }

  const currentStyle = styleMap[variant];
  const currentTopic = topicMap[topicKey as keyof typeof topicMap] || topicMap.default;

  return (
    <div className={currentStyle.wrapper}>
      <a
        href={currentTopic.href}
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
            <p className="text-[20px] md:text-[24px] font-black text-[#0F1A2B] group-hover:text-[#C9A857] transition-colors m-0 break-keep mt-2 md:mt-0 text-center md:text-left leading-tight">
              {currentStyle.text}<br />
              <span className="text-[#C9A857]">{currentTopic.emphasis}</span>
            </p>
          </div>
          <div className="text-[14px] md:text-[15px] text-slate-500 font-[600] text-center md:text-right leading-relaxed mt-2 md:mt-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br />
            이에 따른 일정액의 수수료를 제공받습니다.<br />
            수익금은 <strong className="text-[#C9A857] text-[16px] md:text-[17px] font-extrabold">울산 365 포탈정보</strong> 서비스 운영비로 사용됩니다.
          </div>
        </div>
      </a>
    </div>
  );
}
