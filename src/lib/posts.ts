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
      const slug = fileName.replace(/\.md$/, ''); // 파일 이름에서 확장자 제거
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents); // frontmatter 파싱

      return {
        slug,
        title: data.title || '제목 없음',
        date: formatDate(data.date),
        summary: data.summary || '',
        category: data.category || '기타',
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    });

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

  return {
    slug,
    title: data.title || '제목 없음',
    date: formatDate(data.date),
    summary: data.summary || '',
    category: data.category || '기타',
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}
