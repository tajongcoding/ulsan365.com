import fs from 'fs';
import path from 'path';

const POSTS_DIR = 'src/content/posts';

// 고품질 고정 이미지 리스트 (Unsplash 직접 링크 - 깨지지 않는 것들)
const genericImages = {
  복지: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800', // 가족
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800', // 병원/돌봄
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800', // 아이들
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800', // 친구
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', // 교육
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800', // 인물
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800', // 도움
  ],
  경제: [
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800', // 돈
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', // 계산
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', // 분석
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800', // 오피스
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', // 그래프
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', // 지갑
  ],
  생활: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', // 도시
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', // 카페
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', // 도로
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', // 빌딩
    'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=800', // 대중교통
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800', // 공원
  ],
  행사: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', // 페스티벌
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800', // 콘서트
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', // 파티
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', // 불꽃놀이
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', // 행사
  ]
};

// 위키미디어 검색 (주로 명소, 지역에 사용)
async function searchWikimedia(keyword, limit = 6) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.query && data.query.pages) {
      const urls = Object.values(data.query.pages).map(p => p.imageinfo[0].url);
      return urls.filter(url => /\.(jpg|jpeg|png|webp)$/i.test(url)).slice(0, limit);
    }
  } catch (e) {
    console.error(`Error fetching wikimedia for ${keyword}:`, e);
  }
  return [];
}

// 랜덤 섞기
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function run() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 카테고리와 태그 추출
    const categoryMatch = content.match(/category:\s*(.*)/);
    const category = categoryMatch ? categoryMatch[1].trim() : '생활';
    
    const tagMatch = content.match(/tags:[\s\S]*?(?=\n\S|$)/);
    let firstTag = '';
    if (tagMatch) {
      const tags = tagMatch[0].split('\n').filter(t => t.includes('-'));
      if (tags.length > 0) {
        firstTag = tags[0].replace(/-\s*/, '').replace(/\\n.*/g, '').trim();
      }
    }

    let replacements = [];

    // 명소이거나 특정 지역 태그가 있으면 위키미디어 검색
    if (category === '명소' || category.includes('관광') || file.includes('place')) {
      const keyword = firstTag || '울산';
      console.log(`[${file}] Searching Wikimedia for: ${keyword}`);
      replacements = await searchWikimedia(keyword, 6);
    }

    // 위키미디어 결과가 부족하거나 일반 카테고리인 경우 고정 풀에서 랜덤 가져옴
    if (replacements.length < 6) {
      const mainCat = Object.keys(genericImages).find(k => category.includes(k)) || '생활';
      const pool = shuffle([...genericImages[mainCat]]);
      
      while (replacements.length < 6) {
        replacements.push(pool[replacements.length % pool.length]);
      }
    }

    // 본문 내 이미지 치환
    let imgIndex = 0;
    const newContent = content.replace(/<img[^>]*src="([^"]+)"[^>]*>/ig, (match, url) => {
      const newUrl = replacements[imgIndex % replacements.length];
      const newTag = match.replace(`src="${url}"`, `src="${newUrl}"`);
      imgIndex++;
      return newTag;
    });

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated ${file}`);
    }
  }
  
  console.log('All Done!');
}

run();