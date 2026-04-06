'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { getCategoryLabel, getPostVisuals } from '@/lib/postVisuals';
import CoupangBanner from './CoupangBanner';

// 포스트 정보 타입 정의
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string | null;
}

// 실제 리스트를 보여주는 내부 컴포넌트
function BlogListContent({ allPosts }: { allPosts: PostMeta[] }) {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const posts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return allPosts.filter((post) => {
      const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
      const matchesSearch = normalized
        ? [post.title, post.summary, ...(post.tags || [])]
            .join(' ')
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [allPosts, categoryFilter, searchTerm]);

  const featuredPosts = posts.slice(0, 8);
  const listPosts = posts.slice(8);
  const itemsPerPage = 5;
  const totalListPages = Math.ceil(listPosts.length / itemsPerPage);
  const paginatedListPosts = listPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const displayTitle = categoryFilter ? getCategoryLabel(categoryFilter) : '울산 생활정보 모음';
  const displaySubtitle = categoryFilter
    ? `${getCategoryLabel(categoryFilter)} 대표 글 8개와 하단 목록을 페이지별로 확인하세요.`
    : '울산광역시의 유용한 생활·복지·행사 정보를 대표 글 8개와 페이지형 목록으로 정리했습니다.';

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchTerm]);

  return (
    <div className="flex flex-col">
      <div className="mb-7 border-b-2 border-[#0F1A2B] pb-5 max-w-4xl">
        <h1 className="text-[32px] md:text-[40px] font-black text-[#0F1A2B] mb-2 tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-slate-500 font-medium">{displaySubtitle}</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
        <label htmlFor="blog-search" className="block text-[14px] font-bold text-[#0F1A2B] mb-2">
          글 검색
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            id="blog-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="예: 청년 지원금, 야간약국, 대형폐기물"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-[#1F2937] outline-none focus:border-[#C9A857] focus:ring-2 focus:ring-[#C9A857]/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="rounded-xl border border-slate-300 px-4 py-3 text-[14px] font-bold text-[#0F1A2B] hover:bg-slate-50"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-6xl mb-6 opacity-30">📂</p>
          <p className="text-[18px] font-bold text-slate-400">아직 등록된 정보가 없습니다.</p>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <div className="flex items-end justify-between gap-4 mb-5 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">대표 글 8개</h2>
                <p className="text-[14px] text-slate-500 mt-1">상단은 4개씩 두 줄로, 총 8개를 크게 바로 보이도록 정리했습니다.</p>
              </div>
              <span className="text-[13px] md:text-[14px] font-bold text-[#C9A857] shrink-0">TOP {featuredPosts.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPosts.map((post) => {
                const { heroImage, categoryLabel, badgeClass, overlayClass, toneName } = getPostVisuals(post);

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border-[2px] border-[#0F1A2B] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#C9A857] transition-all duration-300 flex flex-col aspect-square relative"
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={heroImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${overlayClass} pointer-events-none`}></div>
                    </div>

                    <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
                      <div className="flex items-start">
                        <span className={`text-[12px] md:text-[13px] tracking-widest font-black backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm ${badgeClass}`}>
                          {categoryLabel}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                            📅 {post.date}
                          </span>
                          <span className="text-[10px] font-black tracking-[0.16em] text-[#FFE08A] uppercase">
                            {toneName}
                          </span>
                        </div>
                        <h3 className="text-[16px] md:text-[18px] font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#C9A857] transition-colors break-keep">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {listPosts.length > 0 && (
            <section>
              <div className="mb-5 border-b border-slate-200 pb-3">
                <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">목록 리스트</h2>
                <p className="text-[14px] text-slate-500 mt-1">한 페이지에 5개씩, 지금보다 더 작고 간결하게 보이도록 조정했습니다.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {paginatedListPosts.map((post) => {
                  const { heroImage, categoryLabel, badgeClass } = getPostVisuals(post);

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#C9A857] hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-[88px] sm:h-[92px] sm:w-[128px] sm:min-w-[128px] overflow-hidden bg-slate-100">
                          <img
                            src={heroImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className={`absolute left-2 top-2 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-black shadow-sm ${badgeClass}`}>
                            {categoryLabel}
                          </span>
                        </div>

                        <div className="flex-1 p-2.5 sm:p-3">
                          <div className="flex flex-wrap items-center gap-1 mb-1.5 text-[10px] text-slate-500">
                            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-semibold">
                              📅 {post.date}
                            </span>
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="inline-flex rounded-full bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="text-[14px] md:text-[15px] font-black text-[#0F1A2B] leading-snug break-keep line-clamp-2 group-hover:text-[#C9A857] transition-colors">
                            {post.title}
                          </h3>
                          <p className="mt-1 text-[12px] md:text-[13px] text-slate-600 leading-relaxed break-keep line-clamp-2">
                            {post.summary || '핵심 내용을 보기 쉽게 정리한 생활 정보 안내입니다.'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalListPages > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-bold text-[#0F1A2B] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                  >
                    이전
                  </button>

                  {Array.from({ length: totalListPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-[#0F1A2B] text-white'
                          : 'border border-slate-300 text-[#0F1A2B] hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalListPages))}
                    disabled={currentPage === totalListPages}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-bold text-[#0F1A2B] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function BlogListPage({ allPosts }: { allPosts: PostMeta[] }) {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-5 py-10 md:py-12 flex flex-col gap-10 md:gap-12">
      <Suspense fallback={<div className="text-center py-20 text-slate-400">데이터를 불러오는 중입니다...</div>}>
        <BlogListContent allPosts={allPosts} />
      </Suspense>
      {/* 리스트 하단 문맥형 배너 */}
      <CoupangBanner variant="inline" />
    </main>
  );
}
