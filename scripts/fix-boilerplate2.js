const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/content/posts');

// Lines to remove by exact trim match
const exactRemove = new Set([
  // Generic closing sentences
  '지금까지 우리 동네에서 꼭 알아야 할 가장 핵심적인 정보들을 알기 쉽게 풀어 설명해 드렸습니다.',
  // Generic attraction Q&A (parking, admission, visiting times)
  '**Q1. 주차하기 편한가요?**',
  '▶ 대부분의 울산 주요 명소에는 공영 주차장이 마련되어 있습니다. 하지만 주말과 공휴일에는 주차 공간이 부족할 수 있으니, 대중교통이나 도보 방문을 추천해 드립니다.',
  '**Q2. 입장료가 있나요?**',
  '▶ 울산의 자연 명소(태화강 국가정원, 간절곶 등)는 대부분 무료입니다. 전시관이나 박물관 등 일부 시설은 소정의 입장료가 있을 수 있으니 방문 전에 확인해 주세요.',
  '**Q3. 아이들과 함께 방문하기 좋은 시간대가 있나요?**',
  '▶ 오전 시간대(10시~12시)가 비교적 조용하고 쾌적합니다. 주말 오후에는 방문객이 많이 몰리므로, 가족 나들이는 오전 일찍 출발하시는 것을 추천합니다.',
]);

// Prefix-based removal (catches varied "지금까지 울산 XX을 알아보았습니다" forms)
const prefixRemove = [
  '지금까지 울산',
  '지금까지 4월',
  '지금까지 온누리',
];

// Substring-based removal (catches all "울산 365 포털은 ..." promotional lines)
const substringRemove = [
  '**울산 365 포털**은',
];

let totalFixed = 0;
let totalLinesRemoved = 0;

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');

  const filtered = lines.filter((line) => {
    const t = line.trim();
    if (exactRemove.has(t)) return false;
    if (prefixRemove.some((p) => t.startsWith(p))) return false;
    if (substringRemove.some((s) => t.includes(s))) return false;
    return true;
  });

  const removed = lines.length - filtered.length;
  if (removed === 0) continue;

  // Collapse 3+ consecutive blank lines into 2
  const collapsed = [];
  let blankCount = 0;
  for (const line of filtered) {
    if (line.trim() === '') {
      blankCount++;
      if (blankCount <= 2) collapsed.push(line);
    } else {
      blankCount = 0;
      collapsed.push(line);
    }
  }

  fs.writeFileSync(filePath, collapsed.join('\n'), 'utf8');
  totalFixed++;
  totalLinesRemoved += removed;
  console.log(`${file}: ${removed}줄 제거`);
}

console.log(`\n완료: ${totalFixed}개 파일, 총 ${totalLinesRemoved}줄 제거`);
