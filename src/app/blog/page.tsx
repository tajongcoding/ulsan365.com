import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: '우리동네 블로그 | 성남시 생활 정보통',
  description: '성남시 생활 정보와 유용한 이야기를 담은 블로그입니다.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">우리동네 블로그</h1>
      <p className="text-gray-500 mb-8">성남시 생활 정보와 유용한 이야기를 전해드립니다.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg">아직 작성된 글이 없습니다.</p>
          <p className="text-sm mt-2">src/content/posts/ 폴더에 마크다운 파일을 추가해보세요.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all bg-white">
                  {/* 카테고리 배지 */}
                  <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">
                    {post.category}
                  </span>

                  {/* 글 제목 */}
                  <h2 className="text-xl font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* 요약 미리보기 */}
                  {post.summary && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{post.summary}</p>
                  )}

                  {/* 하단 정보: 날짜 + 태그 */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>📅 {post.date}</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
