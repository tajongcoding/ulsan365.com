import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { absoluteUrl, siteConfig } from "@/lib/site";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: '아시나요 울산 | 복지·지원금·행사·생활정보 포털',
    template: '%s',
  },
  description: siteConfig.description,
  keywords: ['울산 생활정보', '울산 지원금', '울산 복지', '울산 행사', '울산 야간약국', '울산 관광'],
  alternates: {
    canonical: absoluteUrl('/'),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: '아시나요 울산 | 복지·지원금·행사·생활정보 포털',
    description:
      '울산광역시 시민을 위한 복지 혜택, 청년 지원금, 생활 정보, 행사·관광 소식을 매일 업데이트합니다.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'ko_KR',
    type: 'website',
    images: [absoluteUrl(siteConfig.ogImage)],
  },
  twitter: {
    card: 'summary_large_image',
    title: '아시나요 울산 | 복지·지원금·행사·생활정보 포털',
    description:
      '울산광역시 시민을 위한 복지, 지원금, 생활 정보, 행사·관광 소식을 빠르게 확인하세요.',
    images: [absoluteUrl(siteConfig.ogImage)],
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
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        description: '울산광역시 시민을 위한 생활 밀착형 공공 정보 안내 포털',
      },
      {
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: 'ko-KR',
        description: '울산광역시 주민을 위한 복지, 지원금, 생활, 행사, 관광 정보',
      },
    ],
  };

  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isAdSenseValid = adSenseId && adSenseId !== '나중에_입력';

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const isGaValid = gaId && gaId !== '나중에_입력';

  return (
    <html lang="ko" className={`${notoSansKr.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof window === 'undefined') {
                  return;
                }

                var canonicalHost = 'ulsan365.com';
                var redirectHosts = ['asinayo.org', 'www.asinayo.org', 'www.ulsan365.com'];
                var currentHost = window.location.hostname;
                var currentPath = window.location.pathname + window.location.search + window.location.hash;
                var isPreviewHost = /\.pages\.dev$|\.workers\.dev$/i.test(currentHost);
                var shouldRedirectHost = redirectHosts.indexOf(currentHost) !== -1 || isPreviewHost;
                var shouldUpgradeProtocol = currentHost === canonicalHost && window.location.protocol !== 'https:';

                if (shouldRedirectHost || shouldUpgradeProtocol) {
                  var nextUrl = 'https://' + canonicalHost + window.location.pathname + window.location.search + window.location.hash;
                  if (window.location.href !== nextUrl) {
                    window.location.replace(nextUrl);
                  }
                  return;
                }

                if (currentHost === canonicalHost) {
                  var originalPushState = window.history.pushState.bind(window.history);
                  var originalReplaceState = window.history.replaceState.bind(window.history);
                  var normalizeVisibleUrl = function (url) {
                    if (url == null || url === '') {
                      return '/';
                    }

                    try {
                      var parsedUrl = new URL(String(url), window.location.origin);
                      if (parsedUrl.origin === window.location.origin) {
                        return '/';
                      }
                    } catch (error) {
                      if (typeof url === 'string' && url.charAt(0) === '/') {
                        return '/';
                      }
                    }

                    return url;
                  };
                  var forceRootUrl = function () {
                    var visibleUrl = window.location.pathname + window.location.search + window.location.hash;
                    if (visibleUrl !== '/') {
                      originalReplaceState(window.history.state, '', '/');
                    }
                  };

                  if (!window.__ulsan365UrlPinned) {
                    window.__ulsan365UrlPinned = true;
                    window.history.pushState = function (state, title, url) {
                      return originalPushState(state, title, normalizeVisibleUrl(url));
                    };
                    window.history.replaceState = function (state, title, url) {
                      return originalReplaceState(state, title, normalizeVisibleUrl(url));
                    };

                    window.addEventListener('popstate', function () {
                      setTimeout(forceRootUrl, 0);
                    });

                    document.addEventListener('click', function () {
                      setTimeout(forceRootUrl, 0);
                      setTimeout(forceRootUrl, 120);
                    }, true);
                  }

                  forceRootUrl();
                }
              })();
            `,
          }}
        />
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
        className={`antialiased min-h-screen flex flex-col font-sans`}
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
