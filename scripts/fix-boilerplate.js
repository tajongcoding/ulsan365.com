const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/content/posts');

// Exact boilerplate lines to remove
const boilerplateLines = [
  '관공서나 공식 안내문에서는 잘 알려주지 않는 실전 팁을 하나 더 알려드릴게요. 폼이나 홈페이지에서 막힌다면, 지정된 고객센터나 담당 부서로 오전에 전화하시면 훨씬 더 빠르고 친절하게 안내받을 수 있습니다. 또한, 관련 증빙 서류는 미리 사진으로 찍어두시면 나중에도 유용하게 쓰일 수 있습니다.',
  '여러분과 같은 울산 시민분들이 가장 헷갈려 하시는 부분을 정리해보았습니다.',
  '- **Q**: 모바일로도 모든 과정이 가능한가요?',
  '  - **A**: 네! 스마트폰 전용 웹이나 앱을 통해서 언제 어디서나 쉽게 접근하실 수 있습니다. PC가 없어도 전혀 걱정하지 마세요.',
  '- **Q**: 신청 기간을 놓치면 어떻게 되나요?',
  '  - **A**: 다행히 상시 모집이나 추가 모집이 자주 진행되니, 꾸준히 포털을 확인해주시면 됩니다.',
  '울산광역시 공식 홈페이지 및 관련 기관에서 상세 정보를 확인하세요.',
];

const boilerplateSet = new Set(boilerplateLines.map((l) => l.trim()));

let totalFixed = 0;
let totalLinesRemoved = 0;

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');

  const filtered = lines.filter((line) => !boilerplateSet.has(line.trim()));
  const removed = lines.length - filtered.length;

  if (removed > 0) {
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
}

console.log(`\n완료: ${totalFixed}개 파일, 총 ${totalLinesRemoved}줄 제거`);
