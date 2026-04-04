import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "울산광역시 생활 정보 | 행사·혜택·지원금 안내",
  description: "울산광역시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "울산시 생활 정보 | 행사·혜택·지원금 안내",
    description: "울산시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://my-local-info.pages.dev",
    siteName: "울산시 생활 정보통",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: '울산광역시 생활 정보',
        url: 'https://my-local-info.pages.dev',
        description: '울산광역시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://my-local-info.pages.dev' },
          { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://my-local-info.pages.dev/blog' },
        ],
      },
    ],
  };

  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdSenseValid = adSenseId && adSenseId !== '나중에_입력';

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isGaValid = gaId && gaId !== '나중에_입력';

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 에러 방지를 위해 메타 데이터 스크립트 일시 제거 */}
        {isAdSenseValid && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`} crossOrigin="anonymous" />
        )}
        {isGaValid && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {/* 서버 동기화 강제 유도: 2026-04-04 09:48 최종 수정됨 */}
        <Header />
        <div className="flex-1 bg-[#f8f9fa]">
          {children}
        </div>
      </body>
    </html>
  );
}
