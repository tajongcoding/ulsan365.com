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
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1400",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg"
  ],
  "pharmacy": [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1583912267550-75846eb5bbf6?auto=format&fit=crop&q=80&w=1400"
  ],
  "welfare": [
    "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1400"
  ],
  "economy": [
    "https://upload.wikimedia.org/wikipedia/commons/e/eb/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1400"
  ],
  "event": [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1400",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg"
  ],
  "scenic": [
    "https://upload.wikimedia.org/wikipedia/commons/1/1f/%EA%B0%84%EC%A0%88%EA%B3%B6%ED%92%8D%EA%B2%BD_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/29/Bangudae_Petroglyphs_from_Ulsan_%285329613206%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1400",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1400"
  ]
};

function fileGroup(fileName) {
  const match = fileName.match(/^\d{4}-\d{2}-\d{2}-([a-z]+)-/);
  return match ? match[1] : '';
}

function selectImagePool(fileName, title, category) {
  const group = fileGroup(fileName);
  if (/야간약국|약국|병원|의료|응급|진료|클리닉/.test(title)) return IMAGE_POOLS.pharmacy;
  if (/공영주차장|주차|버스|교통|분실|쓰레기|폐기물|수도|이사|생활/.test(title)) return IMAGE_POOLS.parking;
  if (group === 'economy' || category.includes('경제')) return IMAGE_POOLS.economy;
  if (group === 'event' || category.includes('행사')) return IMAGE_POOLS.event;
  if (group === 'welfare' || category.includes('복지')) return IMAGE_POOLS.welfare;
  if (group === 'place' || group === 'ulsan' || category.includes('명소') || category.includes('울산 아시나요')) return IMAGE_POOLS.scenic;
  return IMAGE_POOLS.parking;
}

function readMeta(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim().replace(/^"|"$/g, '') : '';
}

function stableSeed(value) {
  return Array.from(value).reduce((total, char, index) => total + ((index + 1) * char.charCodeAt(0)), 0);
}

function rotateImages(images, seedKey) {
  if (!images.length) return [];
  const start = stableSeed(seedKey) % images.length;
  return Array.from({ length: Math.min(6, images.length) }, (_, index) => images[(start + index) % images.length]);
}

function buildImageBlock(title, images, seedKey) {
  return rotateImages(images, seedKey).map((url, index) => `![${title || '울산365'} ${index + 1}](${url})`).join('\n');
}

function replaceMarkdownImages(content, title, images, seedKey) {
  const block = buildImageBlock(title, images, seedKey);
  let count = 0;
  const next = content.replace(/!\[[^\]]*\]\([^)]+\)/g, () => {
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
    next = replaceMarkdownImages(next, title, images, file);

    if (next !== content) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated += 1;
      console.log(`updated: ${file}`);
    }
  }

  console.log(`total updated: ${updated}`);
}

run();
