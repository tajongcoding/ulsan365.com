const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../src/content/posts');
let totalFixed = 0;

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  // Split into frontmatter + body
  const fmMatch = original.match(/^(---[\s\S]*?---\n)([\s\S]*)$/);
  if (!fmMatch) continue;

  const [, frontmatter, body] = fmMatch;

  // Split body into sections by h2 headings
  const sectionRegex = /(^## .+$)/m;
  const parts = body.split(/(?=^## .+$)/m);

  const cleaned = parts.filter((part) => {
    if (!part.trim().startsWith('## ')) return true; // Not a section, keep it

    const lines = part.split('\n');
    const contentLines = lines.slice(1); // Skip the heading line

    // Check if there is any non-empty content (text or img tags)
    const hasContent = contentLines.some((l) => {
      const t = l.trim();
      return t.length > 0 && t !== '';
    });

    if (!hasContent) {
      return false; // Drop completely empty sections
    }

    // Check if the only content is img tags (those will be replaced by gallery anyway, so keep them)
    const nonImgContent = contentLines.filter((l) => {
      const t = l.trim();
      return t.length > 0 && !t.startsWith('<img');
    });

    // Keep if has text content (not just images)
    return nonImgContent.length > 0;
  });

  const result = frontmatter + cleaned.join('');

  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    totalFixed++;
    console.log(file);
  }
}

console.log(`\n완료: ${totalFixed}개 파일 정리`);
