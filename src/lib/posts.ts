import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 마크다운 파일들이 저장된 폴더 경로
const postsDirectory = path.join(process.cwd(), 'src/content/posts');

// 블로그 글 하나의 정보를 담는 타입 정의
export type PostMeta = {
  slug: string;       // 파일 이름 (URL에 사용)
  title: string;      // 글 제목
  date: string;       // 작성일 (YYYY-MM-DD 형식)
  summary: string;    // 미리보기 텍스트
  category: string;   // 카테고리
  tags: string[];     // 태그 목록
  contentExcerpt?: string; // 본문 미리보기 (5줄 정도 용도)
  summaryBox?: string; // 핵심 요약 박스 내용 추출
  thumbnailUrl?: string | null; // 본문 첫 이미지 URL
};

export type Post = PostMeta & {
  content: string;    // 글 본문 내용
};

// date 값이 Date 객체로 파싱된 경우 문자열로 변환하는 함수
function formatDate(date: unknown): string {
  if (date instanceof Date) {
    // Date 객체면 YYYY-MM-DD 형식의 문자열로 변환
    return date.toISOString().slice(0, 10);
  }
  if (typeof date === 'string') {
    return date;
  }
  return '';
}

// 모든 블로그 글의 메타 정보를 가져오는 함수 (목록 페이지에서 사용)
export function getAllPosts(): PostMeta[] {
  // 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // .md 파일만 처리
    .map((fileName) => {
      try {
        const slug = fileName.replace(/\.md$/, ''); // 파일 이름에서 확장자 제거
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents); // frontmatter 파싱

        // 1. 핵심 요약 박스 추출 (제목 포함 전체 내용)
        const summaryMatch = content.match(/(> ### 📝 한눈에 보는 핵심 요약\n[\s\S]*?)\n\n---/);
        let summaryBox = "";
        if (summaryMatch && summaryMatch[1]) {
            summaryBox = summaryMatch[1]
                .replace(/> ### /g, '') // 제목의 인용구/헤더 기호 제거
                .replace(/> - /g, '')  // 리스트의 인용구 기호 제거
                .replace(/> /g, '')
                .replace(/\*\*/g, '')  // **볼드** 마크다운 별표 제거
                .trim();
        }

        // 2. 일반 본문 추출 (미리보기용)
        const rawText = content
            .replace(/[#*>\-`]/g, '') // 마크다운 기호 제거
            .replace(/\s+/g, ' ')     // 일단 모든 공백을 스페이스 한 칸으로 압축
            .replace(/(📌|💡|✅|🎁|💬|🏆|📝)/g, '\n$1') // 특수 이모지가 나오면 무조건 줄바꿈 추가!!
            .trim();
        const contentExcerpt = rawText.slice(0, 200) + '...';

        // 3. 본문 내의 첫 번째 이미지 추출
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i) || content.match(/!\[.*?\]\((.*?)\)/);
        const thumbnailUrl = imgMatch ? imgMatch[1] : null;

        return {
          slug,
          title: String(data.title || '제목 없음'),
          date: formatDate(data.date),
          summary: String(data.summary || ''),
          category: String(data.category || '기타'),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          contentExcerpt,
          summaryBox,
          thumbnailUrl,
        };
      } catch (e) {
        console.error(`에러난 파일: ${fileName}`, e);
        return null; // 오류 발생 시 이 글만 제외
       }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map(post => post as PostMeta); // 정상적으로 읽은 글만 필터링 후 캐스팅

  // 날짜 내림차순 정렬 (최신 글이 먼저)
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

// 특정 글의 전체 내용을 가져오는 함수 (상세 페이지에서 사용)
export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i) || content.match(/!\[.*?\]\((.*?)\)/);
  const thumbnailUrl = imgMatch ? imgMatch[1] : null;
  const rawText = content.replace(/[#*>\-`]/g, '').replace(/\s+/g, ' ').trim();
  const contentExcerpt = rawText ? `${rawText.slice(0, 160)}...` : '';

  return {
    slug,
    title: data.title || '제목 없음',
    date: formatDate(data.date),
    summary: data.summary || '',
    category: data.category || '기타',
    tags: Array.isArray(data.tags) ? data.tags : [],
    contentExcerpt,
    thumbnailUrl,
    content,
  };
}
