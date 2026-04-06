import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import BlogListPage from '@/components/BlogList';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '울산 복지·지원금·생활정보 모음 | 아시나요 울산',
  description: '울산광역시의 복지, 생활, 경제, 행사, 관광 정보를 카테고리별로 모아보는 블로그 목록입니다.',
  alternates: {
    canonical: absoluteUrl('/blog'),
  },
};

export default function BlogPage() {
  // 서버 사이드에서 모든 글 데이터를 미리 읽어옵니다.
  const allPosts = getAllPosts();

  // 읽어온 데이터를 클라이언트 컴포넌트인 BlogListPage로 전달합니다.
  return <BlogListPage allPosts={allPosts} />;
}
