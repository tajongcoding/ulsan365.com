'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CoupangBanner from './CoupangBanner';

// 포스트 정보 타입 정의
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
}

// 실제 리스트를 보여주는 내부 컴포넌트
function BlogListContent({ allPosts }: { allPosts: PostMeta[] }) {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  
  // 브라우저에서 실시간으로 필터링
  const posts = categoryFilter 
    ? allPosts.filter(post => post.category === categoryFilter)
    : allPosts;

  // 메뉴명 매핑
  const titleMap: Record<string, string> = {
    '복지': '복지 정보',
    '경제': '경제 정보',
    '생활': '생활 정보',
    '행사': '행사·축제',
    '명소': '명소·관광',
  };

  const displayTitle = categoryFilter ? (titleMap[categoryFilter] || `${categoryFilter} 정보`) : '우리동네 정보 센터';
  const displaySubtitle = categoryFilter ? `${categoryFilter} 관련 최신 소식을 확인하세요.` : '울산광역시의 유용한 소식을 실시간으로 확인하세요.';

  return (
    <div className="flex flex-col">
      <div className="mb-12 border-b-2 border-[#0F1A2B] pb-6">
        <h1 className="text-[32px] md:text-[40px] font-black text-[#0F1A2B] mb-2 tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-slate-500 font-medium">{displaySubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-6xl mb-6 opacity-30">📂</p>
            <p className="text-[18px] font-bold text-slate-400">아직 등록된 정보가 없습니다.</p>
          </div>
        ) : (
          posts.map((post) => {
          // 카테고리에 맞는 고화질 무료 이미지 URL 매칭
          const thumbImg = post.category === '복지' ? 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800' : 
                          post.category === '경제' ? 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800' : 
                          post.category === '행사' ? 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800' : 
                          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800';

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-[#0F1A2B] rounded-2xl border-[3px] border-[#0F1A2B] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#C9A857] transition-all duration-300 flex flex-col aspect-square relative"
            >
              {/* 이미지 전체를 채우는 배경 디자인 */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={thumbImg} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                {/* 텍스트 가독성을 위한 하단 그라데이션 */}
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
              </div>

              {/* 덧씌워지는 내용 영역 */}
              <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
                {/* 상단 카테고리 뱃지 */}
                <div className="flex items-start">
                  <span className="text-[12px] md:text-[13px] tracking-widest font-black text-[#0F1A2B] bg-white/90 backdrop-blur-md border border-[#0F1A2B]/10 px-3 py-1.5 rounded-lg shadow-sm">
                    {titleMap[post.category] || post.category}
                  </span>
                </div>

                {/* 하단 텍스트 (제목 및 날짜로 폭과 내용 최소화) */}
                <div className="mt-auto">
                  <div className="mb-2">
                    <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                      📅 {post.date}
                    </span>
                  </div>
                  <h2 className="text-[16px] md:text-[18px] font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#C9A857] transition-colors break-keep">
                    {post.title}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })
      )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function BlogListPage({ allPosts }: { allPosts: PostMeta[] }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
      <Suspense fallback={<div className="text-center py-20 text-slate-400">데이터를 불러오는 중입니다...</div>}>
        <BlogListContent allPosts={allPosts} />
      </Suspense>
      {/* 사진 리스트 하단 전체 고정 쿠팡 배너 */}
      <CoupangBanner />
    </main>
  );
}
