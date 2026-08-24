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
  taehwagang: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg',
  taehwaru: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg',
  bangudae: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Bangudae_Petroglyphs_from_Ulsan_%285329613206%29.jpg',
  port: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG',
  industry: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg',
  city: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg',
  ganjeolgot: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/%EA%B0%84%EC%A0%88%EA%B3%B6%ED%92%8D%EA%B2%BD_-_panoramio.jpg',
};

const categoryThemes: Record<string, CategoryTheme> = {
  복지: {
    label: '복지 정보',
    toneName: 'Warm Care',
    toneDescription: '따뜻한 케어 톤',
    badgeClass: 'bg-rose-50/95 text-rose-700 border border-rose-200',
    overlayClass: 'from-rose-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-rose-50 via-white to-amber-50',
    accentClass: 'text-rose-600',
    images: [
      'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  경제: {
    label: '경제 정보',
    toneName: 'Industrial Premium',
    toneDescription: '산업 성장 톤',
    badgeClass: 'bg-indigo-50/95 text-indigo-700 border border-indigo-200',
    overlayClass: 'from-indigo-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-indigo-50 via-white to-slate-50',
    accentClass: 'text-indigo-600',
    images: [
      ulsanLocalPhotos.industry,
      ulsanLocalPhotos.port,
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  생활: {
    label: '생활 정보',
    toneName: 'Daily Fresh',
    toneDescription: '일상의 신선함 톤',
    badgeClass: 'bg-emerald-50/95 text-emerald-700 border border-emerald-200',
    overlayClass: 'from-emerald-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-emerald-50 via-white to-teal-50',
    accentClass: 'text-emerald-600',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1400',
      ulsanLocalPhotos.city,
    ],
  },
  행사: {
    label: '행사·축제 정보',
    toneName: 'Festival Amber',
    toneDescription: '밝은 행사 안내 톤',
    badgeClass: 'bg-amber-50/95 text-amber-700 border border-amber-200',
    overlayClass: 'from-amber-950/72 via-slate-900/30 to-transparent',
    surfaceClass: 'from-amber-50 via-white to-orange-50',
    accentClass: 'text-amber-600',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400',
      ulsanLocalPhotos.taehwagang,
    ],
  },
  명소: {
    label: '명소·관광 정보',
    toneName: 'Ulsan Scenic',
    toneDescription: '울산 여행지 안내 톤',
    badgeClass: 'bg-emerald-50/95 text-emerald-700 border border-emerald-200',
    overlayClass: 'from-emerald-950/72 via-slate-900/30 to-transparent',
    surfaceClass: 'from-emerald-50 via-white to-cyan-50',
    accentClass: 'text-emerald-600',
    images: [
      ulsanLocalPhotos.ganjeolgot,
      ulsanLocalPhotos.taehwagang,
      ulsanLocalPhotos.taehwaru,
      ulsanLocalPhotos.bangudae,
    ],
  },
  교육: {
    label: '교육 정보',
    toneName: 'Bright Wisdom',
    toneDescription: '밝은 지혜 톤',
    badgeClass: 'bg-amber-50/95 text-amber-700 border border-amber-200',
    overlayClass: 'from-amber-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-amber-50 via-white to-orange-50',
    accentClass: 'text-amber-600',
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1400',
      'https://images.unsplash.com/photo-1523050335392-9bf5675f42e8?auto=format&fit=crop&q=80&w=1400',
    ],
  },
  기타: {
    label: '일반 소식',
    toneName: 'Clean Minimal',
    toneDescription: '깔끔한 미니멀 톤',
    badgeClass: 'bg-slate-50/95 text-slate-700 border border-slate-200',
    overlayClass: 'from-slate-950/72 via-slate-900/28 to-transparent',
    surfaceClass: 'from-slate-50 via-white to-slate-100',
    accentClass: 'text-slate-600',
    images: [
      ulsanLocalPhotos.taehwagang,
      ulsanLocalPhotos.city,
      ulsanLocalPhotos.port,
      ulsanLocalPhotos.ganjeolgot,
    ],
  },
};

const LOCAL_IMAGES: Record<string, string> = {
  '2026-08-21-event-09-ulsan-family-event': ulsanLocalPhotos.taehwagang,
  '2026-08-20-ulsan-10-ulsan-special-city-reasons': ulsanLocalPhotos.industry,
  '2026-08-20-ulsan-10-ulsan-hidden-spots-story': ulsanLocalPhotos.ganjeolgot,
  '2026-08-20-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.taehwagang,
  '2026-08-20-event-09-ulsan-weekly-event': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400',
  '2026-08-19-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.port,
  '2026-08-19-life-10-ulsan-night-pharmacy-fast-guide': 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=1400',
  '2026-08-19-life-09-ulsan-public-parking-must-check': 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1400',
  '2026-08-19-economy-10-ulsan-youth-support-summary': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1400',
  '2026-08-18-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.ganjeolgot,
  '2026-08-18-event-10-ulsan-family-event': ulsanLocalPhotos.taehwagang,
  '2026-08-18-economy-10-ulsan-youth-support-summary': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1400',
  '2026-08-18-economy-09-ulsan-smallbiz-support-key-points': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1400',
  '2026-08-17-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.city,
  '2026-08-17-life-10-ulsan-public-parking-must-check': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1400',
  '2026-08-24-ulsan-10-ulsan-hidden-spots-story': ulsanLocalPhotos.bangudae,
  '2026-08-24-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.city,
  '2026-08-24-life-09-ulsan-public-parking-must-check': 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1400',
  '2026-08-24-economy-10-ulsan-smallbiz-support-key-points': 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1400',
  '2026-08-23-welfare-10-ulsan-welfare-support': 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400',
  '2026-08-23-welfare-10-ulsan-senior-welfare': 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400',
  '2026-08-23-welfare-09-ulsan-senior-welfare': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400',
  '2026-08-23-ulsan-09-ulsan-special-city-reasons': ulsanLocalPhotos.port,
  '2026-08-22-welfare-10-ulsan-welfare-support': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1400',
  '2026-08-22-life-09-ulsan-night-pharmacy-fast-guide': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400',
  '2026-08-22-event-10-ulsan-family-event': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400',
  '2026-08-22-event-09-ulsan-weekly-event': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400',
  '2026-08-21-welfare-10-ulsan-welfare-support': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1400',
  '2026-08-21-welfare-09-ulsan-senior-welfare': 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400',
  '2026-08-21-ulsan-10-ulsan-hidden-spots-story': ulsanLocalPhotos.taehwaru,
};

function getStableSeed(value: string) {
  return value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function uniqueImages(images: Array<string | null | undefined>) {
  return images.filter((image, index, source): image is string => Boolean(image) && source.indexOf(image) === index);
}

export function getCategoryLabel(category: string) {
  return categoryThemes[category]?.label || categoryThemes['기타'].label;
}

export function getPostVisuals(post: PostMeta) {
  const category = post.category || '기타';
  const theme = categoryThemes[category] || categoryThemes['기타'];
  const seedKey = post.slug || post.title || category;
  const imageIndex = getStableSeed(seedKey) % theme.images.length;
  const fallbackImage = theme.images[imageIndex] || categoryThemes['기타'].images[0];
  const heroImage = LOCAL_IMAGES[post.slug] || post.thumbnailUrl || fallbackImage;
  const galleryImages = uniqueImages([heroImage, ...theme.images, fallbackImage]).slice(0, 4);

  return {
    ...theme,
    categoryLabel: theme.label,
    heroImage,
    fallbackImage,
    galleryImages,
    coverImage: heroImage,
  };
}
