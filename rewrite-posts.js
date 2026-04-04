const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); // Because we already have it installed!

const postsDirectory = path.join(process.cwd(), 'src/content/posts');
const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

const headingsEmojies = ['📌', '💡', '✅', '✨', '🔥', '🏆', '🎯'];

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(postsDirectory, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const parsed = matter(fileContents);
  let body = parsed.content;

  // Track if we made changes
  let hasChanges = false;

  // 1. Blockquote the summary box
  if (body.includes('### 📝 요약 박스')) {
    body = body.replace(/### 📝 요약 박스[\r\n]+([\s\S]*?)[\r\n]+---/g, (match, inner) => {
      const quoted = inner.split(/\r?\n/).filter(l => l.trim()).map(line => `> ${line}`).join('\n');
      return `> ### 📝 한눈에 보는 핵심 요약\n${quoted}\n\n---`;
    });
    hasChanges = true;
  }

  // 2. Change numbered headings to emojis
  let headingIndex = 0;
  if (/^## \d+\.\s+/m.test(body)) {
    body = body.replace(/^## \d+\.\s+(.*)$/gm, (match, title) => {
      const emoji = headingsEmojies[headingIndex % headingsEmojies.length];
      headingIndex++;
      return `## ${emoji} ${title}`;
    });
    hasChanges = true;
  }

  // 3. Expand content lengths
  if (headingIndex > 0) {
    let internalIndex = 0;
    body = body.replace(/^(## [^\n]+)[\r\n]+([\s\S]*?)(?=(^## |[\r\n]+---|$))/gm, (match, heading, sectionContent) => {
      const p1 = `\n\n이 과정에서 여러분이 꼭 체크하셔야 할 작은 디테일들이 숨어 있습니다. 특히 최근 변경된 정책이나 새롭게 도입된 시스템 덕분에 예전보다 훨씬 빠르고 간편하게 이용할 수 있게 되었습니다. 이런 알짜 정보들을 이웃들에게도 꼭 공유해보세요.`;
      const p2 = `\n\n조금 번거롭더라도 한 번만 잘 알아두면 앞으로 두고두고 일상에서 큰 도움이 될 수 있는 꿀팁들입니다. 주변 지인분들 중에서도 이런 내용을 잘 몰라서 혜택을 놓치는 분들이 많으니, 꼭 주변에 알려주시면 좋겠습니다.`;
      const extension = internalIndex % 2 === 0 ? p1 : p2;
      internalIndex++;
      return `${heading}\n${sectionContent.trim()}${extension}\n\n`;
    });

    const extraSections = `
## 🎁 놓치기 쉬운 숨은 꿀팁
관공서나 공식 안내문에서는 잘 알려주지 않는 실전 팁을 하나 더 알려드릴게요. 폼이나 홈페이지에서 막힌다면, 지정된 고객센터나 담당 부서로 오전에 전화하시면 훨씬 더 빠르고 친절하게 안내받을 수 있습니다. 또한, 관련 증빙 서류는 미리 사진으로 찍어두시면 나중에도 유용하게 쓰일 수 있습니다.

## 💬 자주 묻는 질문 베스트
여러분과 같은 울산 시민분들이 가장 헷갈려 하시는 부분을 정리해보았습니다.
- **Q**: 모바일로도 모든 과정이 가능한가요?
  - **A**: 네! 스마트폰 전용 웹이나 앱을 통해서 언제 어디서나 쉽게 접근하실 수 있습니다. PC가 없어도 전혀 걱정하지 마세요.
- **Q**: 신청 기간을 놓치면 어떻게 되나요?
  - **A**: 다행히 상시 모집이나 추가 모집이 자주 진행되니, 꾸준히 포털을 확인해주시면 됩니다.

## 🏆 마무리하며
지금까지 우리 동네에서 꼭 알아야 할 가장 핵심적인 정보들을 알기 쉽게 풀어 설명해 드렸습니다. 
**울산 365 포털**은 언제나 여러분의 일상을 더 풍요롭고 편리하게 만들기 위해 매일 발 빠르게 뛰겠습니다. 앞으로도 올라오는 유익한 소식 놓치지 마세요!
`;
    body += extraSections;
  }

  // Ensure summary item bullets don't end up raw
  body = body.replace(/> - (\*\*.*?\*\*)/g, `> - ✅ $1`);
  body = body.replace(/> - (?!✅)(.*)/g, `> - ✅ $1`);

  // Write file back
  const newRawContent = matter.stringify(body, parsed.data);
  fs.writeFileSync(filePath, newRawContent);
  updatedCount++;
});

console.log('Successfully rewrote ' + updatedCount + ' markdown files.');
