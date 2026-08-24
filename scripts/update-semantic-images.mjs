import fs from 'fs';
import path from 'path';

const POSTS_DIR = 'src/content/posts';

const IMAGE_POOLS = {
  "parking": [
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1400",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg"
  ],
  "pharmacy": [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400"
  ],
  "welfare": [
    "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=1400"
  ],
  "economy": [
    "https://upload.wikimedia.org/wikipedia/commons/e/eb/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1400"
  ],
  "event": [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg"
  ],
  "scenic": [
    "https://upload.wikimedia.org/wikipedia/commons/1/1f/%EA%B0%84%EC%A0%88%EA%B3%B6%ED%92%8D%EA%B2%BD_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/29/Bangudae_Petroglyphs_from_Ulsan_%285329613206%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG"
  ]
};

function selectImagePool(fileName, title, category) {
  if (title.includes('공영주차장') || title.includes('주차')) return IMAGE_POOLS.parking;
  if (title.includes('야간약국') || title.includes('약국')) return IMAGE_POOLS.pharmacy;
  if (category.includes('복지')) return IMAGE_POOLS.welfare;
  if (category.includes('경제')) return IMAGE_POOLS.economy;
  if (category.includes('행사')) return IMAGE_POOLS.event;
  if (category.includes('명소') || category.includes('울산 아시나요') || fileName.includes('-ulsan-') || fileName.includes('-place-')) return IMAGE_POOLS.scenic;
  return IMAGE_POOLS.parking;
}

function readMeta(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim().replace(/^"|"$/g, '') : '';
}

function buildImageBlock(title, images) {
  return images.slice(0, 6).map((url, index) => `![${title || '울산365'} ${index + 1}](${url})`).join('\n');
}

function replaceMarkdownImages(content, title, images) {
  const block = buildImageBlock(title, images);
  let count = 0;
  const next = content.replace(/!\[[^\]]*\]\([^)]+\]/g, () => {
    count += 1;
    return count === 1 ? block : '';
  }).replace(/\n{3,}/g, '\n\n');
  return count > 0 ? next : content.replace(/(---\n\n)/, `$1${block}\n\n`);
}

function run() {
  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const title = readMeta(content, /^title:\s*"?(.+?)"?$/m);
    const category = readMeta(content, /^category:\s*(.+)$/m);
    const images = selectImagePool(file, title, category);

    let next = content.replace(/^category:\s*울산 아시나요\s*$/m, 'category: 명소');
    next = replaceMarkdownImages(next, title, images);

    if (next !== content) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated += 1;
      console.log(`updated: ${file}`);
    }
  }

  console.log(`total updated: ${updated}`);
}

run();
