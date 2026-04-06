import type { PostMeta } from './posts';

type CategoryTheme = {
  label: string;
  toneName: string;
  toneDescription: string;
  badgeClass: string;
  overlayClass: string;
  surfaceClass: string;
  accentClass: string;
  images: string[];
};

const ulsanLocalPhotos = {
  taehwagang: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shade%20Of%20Taehwagang%20(71978891).jpeg',
  taehwaru: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ulsan%20taehwaru.jpg',
  bangudae: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bangudae_Petroglyphs_from_Ulsan_(5329613206).jpg',
  port: 'https://commons.wikimedia.org/wiki/Special:FilePath/Port_Terminal_Of_Ulsan.JPG',
  industry: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg',
  city: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ulsan_129.30972E_35.52012N.jpg',
  banner: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ulsan-banner.jpg',
  uljugun: 'https://commons.wikimedia.org/wiki/Special:FilePath/%EC%9A%B8%EC%A3%BC%EA%B5%B0,_Ulsan,_South_Korea_(Unsplash).jpg',
  ganjeolgot: 'https://commons.wikimedia.org/wiki/Special:FilePath/%EA%B0%84%EC%A0%88%EA%B3%B6%ED%92%8D%EA%B2%BD%20-%20panoramio.jpg',
};

const categoryThemes: Record<string, CategoryTheme> = {
  복지: {
    label: '복지 정보',
    toneName: 'Warm Care',
    toneDescription: '따뜻하고 안정적인 케어 톤',
    badgeClass: 'bg-rose-50/95 text-rose-700 border border-rose-200',
    overlayClass: 'from-rose-950/90 via-slate-900/55 to-transparent',
    surfaceClass: 'from-rose-50 via-white to-amber-50',
    accentClass: 'text-rose-600',
    images: [ulsanLocalPhotos.taehwagang, ulsanLocalPhotos.uljugun, ulsanLocalPhotos.taehwaru],
  },
  경제: {
    label: '경제 정보',
    toneName: 'Industrial Premium',
    toneDescription: '도시 성장감이 느껴지는 산업 톤',
    badgeClass: 'bg-indigo-50/95 text-indigo-700 border border-indigo-200',
    overlayClass: 'from-indigo-950/90 via-slate-900/55 to-transparent',
    surfaceClass: 'from-indigo-50 via-white to-slate-50',
    accentClass: 'text-indigo-600',
    images: [ulsanLocalPhotos.industry, ulsanLocalPhotos.port, ulsanLocalPhotos.city],
  },
  생활: {
    label: '생활 정보',
    toneName: 'Clean Urban',
    toneDescription: '깔끔하고 실용적인 도시 라이프 톤',
    badgeClass: 'bg-sky-50/95 text-sky-700 border border-sky-200',
    overlayClass: 'from-sky-950/90 via-slate-900/50 to-transparent',
    surfaceClass: 'from-sky-50 via-white to-cyan-50',
    accentClass: 'text-sky-600',
    images: [ulsanLocalPhotos.city, ulsanLocalPhotos.taehwaru, ulsanLocalPhotos.taehwagang],
  },
  행사: {
    label: '행사·축제',
    toneName: 'Festival Energy',
    toneDescription: '화려하고 생동감 있는 페스티벌 톤',
    badgeClass: 'bg-amber-50/95 text-amber-700 border border-amber-200',
    overlayClass: 'from-amber-950/90 via-fuchsia-950/50 to-transparent',
    surfaceClass: 'from-amber-50 via-white to-orange-50',
    accentClass: 'text-amber-600',
    images: [ulsanLocalPhotos.banner, ulsanLocalPhotos.ganjeolgot, ulsanLocalPhotos.taehwagang],
  },
  명소: {
    label: '명소·관광',
    toneName: 'Nature Scenic',
    toneDescription: '울산 자연과 전망이 살아있는 여행 톤',
    badgeClass: 'bg-emerald-50/95 text-emerald-700 border border-emerald-200',
    overlayClass: 'from-emerald-950/90 via-teal-900/50 to-transparent',
    surfaceClass: 'from-emerald-50 via-white to-teal-50',
    accentClass: 'text-emerald-600',
    images: [ulsanLocalPhotos.ganjeolgot, ulsanLocalPhotos.taehwagang, ulsanLocalPhotos.bangudae, ulsanLocalPhotos.uljugun],
  },
};

const themedPools = [
  {
    keywords: ['elderly', '어르신', '노인', '돌봄', 'silver'],
    images: [
      ulsanLocalPhotos.taehwagang,
      'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['child', '아동', '출산', '육아', '아이', 'pregnant', 'postpartum', '임산부'],
    images: [
      ulsanLocalPhotos.uljugun,
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['youth', '청년', 'startup', 'rent', 'savings', 'job', '창업'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['waste', '폐기물', 'bulky', '재활용'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['pharmacy', '약국', 'emergency', '응급'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['wifi', 'digital', '앱', '버스', '교통'],
    images: [
      ulsanLocalPhotos.taehwaru,
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['festival', 'event', '행사', '축제', 'concert', 'market', 'night view', '야경'],
    images: [
      ulsanLocalPhotos.banner,
      ulsanLocalPhotos.ganjeolgot,
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['ganjeolgot', '간절곶', 'sunrise'],
    images: [
      ulsanLocalPhotos.ganjeolgot,
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['daewangam', '대왕암', 'beach', '해변', 'whale', '고래', 'jangsaengpo', '장생포'],
    images: [
      ulsanLocalPhotos.banner,
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['taehwagang', '태화강', 'park', '공원', 'picnic'],
    images: [ulsanLocalPhotos.taehwagang, ulsanLocalPhotos.taehwaru, ulsanLocalPhotos.uljugun],
  },
  {
    keywords: ['museum', 'art', '문화', '전시', 'bangudae', '반구대', 'alps', '영남알프스'],
    images: [ulsanLocalPhotos.bangudae, ulsanLocalPhotos.uljugun, ulsanLocalPhotos.ganjeolgot],
  },
];

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.filter(Boolean) as string[]));
}

export function getCategoryTheme(category: string) {
  return categoryThemes[category] || categoryThemes['생활'];
}

export function getCategoryLabel(category: string) {
  return getCategoryTheme(category).label;
}

export function getPostVisuals(
  post: Pick<PostMeta, 'title' | 'slug' | 'summary' | 'category' | 'tags' | 'thumbnailUrl'>,
) {
  const theme = getCategoryTheme(post.category);
  const searchText = [post.slug, post.title, post.summary, ...(post.tags || [])].join(' ').toLowerCase();
  const matchedImages = themedPools
    .filter((item) => item.keywords.some((keyword) => searchText.includes(keyword.toLowerCase())))
    .flatMap((item) => item.images);

  const galleryImages = uniqueStrings([...matchedImages, ...theme.images, post.thumbnailUrl]).slice(0, 4);

  return {
    heroImage: galleryImages[0] || theme.images[0],
    galleryImages,
    categoryLabel: theme.label,
    toneName: theme.toneName,
    toneDescription: theme.toneDescription,
    badgeClass: theme.badgeClass,
    overlayClass: theme.overlayClass,
    surfaceClass: theme.surfaceClass,
    accentClass: theme.accentClass,
  };
}
