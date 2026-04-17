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

const localFallbackGallery = [
  ulsanLocalPhotos.taehwagang,
  ulsanLocalPhotos.taehwaru,
  ulsanLocalPhotos.ganjeolgot,
  ulsanLocalPhotos.bangudae,
  ulsanLocalPhotos.uljugun,
  ulsanLocalPhotos.banner,
  ulsanLocalPhotos.port,
  ulsanLocalPhotos.industry,
  ulsanLocalPhotos.city,
];

const defaultUlsanGalleryByCategory: Record<string, string[]> = {
  복지: [
    ulsanLocalPhotos.taehwagang,
    ulsanLocalPhotos.taehwaru,
    ulsanLocalPhotos.uljugun,
    ulsanLocalPhotos.banner,
    ulsanLocalPhotos.port,
    ulsanLocalPhotos.city,
  ],
  경제: [
    ulsanLocalPhotos.industry,
    ulsanLocalPhotos.port,
    ulsanLocalPhotos.banner,
    ulsanLocalPhotos.taehwaru,
    ulsanLocalPhotos.taehwagang,
    ulsanLocalPhotos.city,
  ],
  생활: [
    ulsanLocalPhotos.taehwaru,
    ulsanLocalPhotos.taehwagang,
    ulsanLocalPhotos.uljugun,
    ulsanLocalPhotos.banner,
    ulsanLocalPhotos.port,
    ulsanLocalPhotos.city,
  ],
  행사: [
    ulsanLocalPhotos.banner,
    ulsanLocalPhotos.ganjeolgot,
    ulsanLocalPhotos.taehwagang,
    ulsanLocalPhotos.taehwaru,
    ulsanLocalPhotos.uljugun,
    ulsanLocalPhotos.city,
  ],
  명소: [
    ulsanLocalPhotos.ganjeolgot,
    ulsanLocalPhotos.bangudae,
    ulsanLocalPhotos.taehwagang,
    ulsanLocalPhotos.uljugun,
    ulsanLocalPhotos.taehwaru,
    ulsanLocalPhotos.banner,
  ],
};

const categoryThemes: Record<string, CategoryTheme> = {
  복지: {
    label: '복지 정보',
    toneName: 'Warm Care',
    toneDescription: '따뜻하고 안정적인 케어 톤',
    badgeClass: 'bg-rose-50/95 text-rose-700 border border-rose-200',
    overlayClass: 'from-rose-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-rose-50 via-white to-amber-50',
    accentClass: 'text-rose-600',
    images: [
      ulsanLocalPhotos.taehwagang,
      ulsanLocalPhotos.uljugun,
      ulsanLocalPhotos.taehwaru,
      'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  경제: {
    label: '경제 정보',
    toneName: 'Industrial Premium',
    toneDescription: '도시 성장감이 느껴지는 산업 톤',
    badgeClass: 'bg-indigo-50/95 text-indigo-700 border border-indigo-200',
    overlayClass: 'from-indigo-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-indigo-50 via-white to-slate-50',
    accentClass: 'text-indigo-600',
    images: [
      ulsanLocalPhotos.industry,
      ulsanLocalPhotos.port,
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  생활: {
    label: '생활 정보',
    toneName: 'Clean Urban',
    toneDescription: '깔끔하고 실용적인 도시 라이프 톤',
    badgeClass: 'bg-sky-50/95 text-sky-700 border border-sky-200',
    overlayClass: 'from-sky-950/72 via-slate-900/24 to-transparent',
    surfaceClass: 'from-sky-50 via-white to-cyan-50',
    accentClass: 'text-sky-600',
    images: [
      ulsanLocalPhotos.city,
      ulsanLocalPhotos.taehwaru,
      ulsanLocalPhotos.taehwagang,
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  행사: {
    label: '행사·축제',
    toneName: 'Festival Energy',
    toneDescription: '화려하고 생동감 있는 페스티벌 톤',
    badgeClass: 'bg-amber-50/95 text-amber-700 border border-amber-200',
    overlayClass: 'from-amber-950/72 via-fuchsia-950/24 to-transparent',
    surfaceClass: 'from-amber-50 via-white to-orange-50',
    accentClass: 'text-amber-600',
    images: [
      ulsanLocalPhotos.banner,
      ulsanLocalPhotos.ganjeolgot,
      ulsanLocalPhotos.taehwagang,
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  명소: {
    label: '명소·관광',
    toneName: 'Nature Scenic',
    toneDescription: '울산 자연과 전망이 살아있는 여행 톤',
    badgeClass: 'bg-emerald-50/95 text-emerald-700 border border-emerald-200',
    overlayClass: 'from-emerald-950/72 via-teal-900/24 to-transparent',
    surfaceClass: 'from-emerald-50 via-white to-teal-50',
    accentClass: 'text-emerald-600',
    images: [
      ulsanLocalPhotos.ganjeolgot,
      ulsanLocalPhotos.taehwagang,
      ulsanLocalPhotos.bangudae,
      ulsanLocalPhotos.uljugun,
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1400',
    ],
  },
};

const themedPools = [
  // ── 사람 대상별 ──────────────────────────────────────────────
  {
    keywords: ['elderly', '어르신', '노인', '돌봄', 'silver', '장기요양', '요양원'],
    images: [
      ulsanLocalPhotos.taehwagang,
      'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['child', '아동', '출산', '육아', '아이', 'pregnant', 'postpartum', '임산부', '어린이', '영유아'],
    images: [
      ulsanLocalPhotos.uljugun,
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['youth', '청년', 'startup', 'rent', 'savings', 'job', '창업', '취업', '청소년'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['disabled', '장애', '다문화', 'multicultural', '한부모', 'single-parent'],
    images: [
      ulsanLocalPhotos.taehwagang,
      ulsanLocalPhotos.uljugun,
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400',
    ],
  },

  // ── 생활·실용 ──────────────────────────────────────────────
  {
    keywords: ['waste', '폐기물', 'bulky', '재활용', '대형폐기물', '쓰레기'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['pharmacy', '약국', '의료', '병원', '건강검진', 'health check'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['emergency', '응급', '소방', '화재', '대피', '심폐소생술', 'cpr', 'aed', 'fire', 'safety', '안전교육'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['버스', '교통', '대중교통', '지하철', '환승', 'bus', 'transit', '교통비'],
    images: [
      ulsanLocalPhotos.city,
      ulsanLocalPhotos.taehwaru,
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['wifi', 'digital', '디지털', '앱', '온라인', '키오스크', '전자', '스마트', 'kiosk', '정보화'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['민원', '행정', '서류', '정부24', '신고', '등록', 'civil service', '공무'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['법률', '법', '상담', '소송', 'legal', 'law', '변호사', '법무'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['자동차', '차량', '차', '검사', '주차', '운전', 'car', 'vehicle', 'auto', '자동차검사'],
    images: [
      ulsanLocalPhotos.industry,
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['반려동물', '펫', '동물등록', '강아지', '고양이', 'pet', 'dog', 'cat', '탄소중립', '환경', 'eco'],
    images: [
      ulsanLocalPhotos.uljugun,
      ulsanLocalPhotos.taehwagang,
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1400',
    ],
  },

  // ── 경제·사업 ──────────────────────────────────────────────
  {
    keywords: ['점포', '소상공인', '자영업', '상권', '가게', '매장', '상점', '환경개선', 'store', 'remodeling'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['수출', 'export', '제조', 'smart factory', '스마트팩토리', 'esg', '공장', '산업단지'],
    images: [
      ulsanLocalPhotos.industry,
      ulsanLocalPhotos.port,
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['voucher', '바우처', '지원금', '보조금', '세금', '세무', '신고', 'tax', 'fund'],
    images: [
      ulsanLocalPhotos.city,
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1400',
    ],
  },

  // ── 행사·문화 ──────────────────────────────────────────────
  {
    keywords: ['festival', '축제', 'concert', '음악', '공연', '야경', 'night view', 'soeburi', '쇠부리', '고래축제', '바다의날'],
    images: [
      ulsanLocalPhotos.banner,
      ulsanLocalPhotos.ganjeolgot,
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['도서관', '독서', '책', '북토크', 'library', 'book', 'reading', '독서문화', '작가'],
    images: [
      ulsanLocalPhotos.taehwaru,
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['flea market', '벼룩시장', '플리마켓', '직거래', 'market', '시장', '전통시장', '상설시장'],
    images: [
      ulsanLocalPhotos.banner,
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400',
    ],
  },

  // ── 명소·자연 ──────────────────────────────────────────────
  {
    keywords: ['ganjeolgot', '간절곶', 'sunrise', '해돋이'],
    images: [
      ulsanLocalPhotos.ganjeolgot,
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['daewangam', '대왕암', 'beach', '해변', 'whale', '고래', 'jangsaengpo', '장생포', '바다', 'ocean'],
    images: [
      ulsanLocalPhotos.banner,
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['taehwagang', '태화강', 'park', '공원', 'picnic', '국가정원', '태화루'],
    images: [ulsanLocalPhotos.taehwagang, ulsanLocalPhotos.taehwaru, ulsanLocalPhotos.uljugun],
  },
  {
    keywords: ['등산', '트래킹', '둘레길', 'hiking', 'trail', 'trekking', 'mountain', 'alps', '영남알프스', '무룡산', '숲길'],
    images: [
      ulsanLocalPhotos.uljugun,
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['museum', 'art', '박물관', '미술관', '전시', 'bangudae', '반구대', '각석', '암각화', '선사', '유적'],
    images: [ulsanLocalPhotos.bangudae, ulsanLocalPhotos.uljugun, ulsanLocalPhotos.ganjeolgot],
  },
  {
    keywords: ['drive', '드라이브', 'coastal', '해안', '일몰', 'sunset', '전망대', '야경'],
    images: [
      ulsanLocalPhotos.ganjeolgot,
      ulsanLocalPhotos.banner,
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  {
    keywords: ['onggi', '옹기', 'warehouse', '창고', '근대', '역사', '문화재', '건축'],
    images: [
      ulsanLocalPhotos.taehwaru,
      ulsanLocalPhotos.bangudae,
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1400',
    ],
  },
];

function uniqueStrings(items: Array<string | null | undefined>) {
  return Array.from(new Set(items.filter(Boolean) as string[]));
}

function getDeterministicIndex(seed: string, length: number) {
  if (length <= 1) {
    return 0;
  }

  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash % length;
}

function rotateBySeed(items: string[], seed: string) {
  if (items.length <= 1) {
    return items;
  }

  const start = getDeterministicIndex(seed, items.length);
  return [...items.slice(start), ...items.slice(0, start)];
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

  const categoryLocalImages = defaultUlsanGalleryByCategory[post.category] || localFallbackGallery;

  const isUnsplash = (img: unknown): img is string =>
    typeof img === 'string' && img.includes('unsplash.com');

  const unsplashFirst = [
    ...matchedImages.filter(isUnsplash),
    ...theme.images.filter(isUnsplash),
    ...matchedImages.filter((img) => !isUnsplash(img)),
    ...theme.images.filter((img) => !isUnsplash(img)),
    ...categoryLocalImages,
    ...localFallbackGallery,
    post.thumbnailUrl,
  ];

  const stableImages = uniqueStrings(
    unsplashFirst.filter((img): img is string => typeof img === 'string' && img.startsWith('http'))
  );

  const rotatedImages = rotateBySeed(stableImages, `${post.slug}-${post.title}-${post.category}`);
  const galleryImages = rotatedImages.slice(0, 6);
  const heroPool = galleryImages.slice(0, 4);
  const heroIndex = getDeterministicIndex(`${post.slug}-${post.title}-${post.category}-hero`, heroPool.length || galleryImages.length);
  const heroImage = heroPool[heroIndex] || galleryImages[0] || localFallbackGallery[0];
  const fallbackImage = galleryImages.find((image) => image !== heroImage) || heroImage || localFallbackGallery[0] || '';

  return {
    heroImage,
    fallbackImage,
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
