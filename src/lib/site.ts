export const siteConfig = {
  name: '아시나요 울산',
  description:
    '울산광역시 시민을 위한 복지 혜택, 청년 지원금, 생활 정보, 야간약국, 행사·관광 소식을 알기 쉽게 정리하는 지역 정보 포털입니다.',
  url: 'https://ulsan365.com',
  ogImage: '/og-default.svg',
  email: 'help@asinayo.org',
  searchDomain: 'ulsan365.com',
} as const;

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function buildPostSeoTitle(title: string, category?: string) {
  const normalizedTitle = title.includes('울산') ? title : `울산 ${title}`;
  return category ? `${normalizedTitle} | ${category} 정보 | ${siteConfig.name}` : `${normalizedTitle} | ${siteConfig.name}`;
}
