'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { getCategoryLabel, getPostVisualsForList } from '@/lib/postVisuals';
import CoupangBanner from './CoupangBanner';
import GoogleAdSlot from './GoogleAdSlot';
import SafeImage from './SafeImage';

// 포스트 정보 타입 정의
interface PostMeta { slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string | null; }

// 실제 리스트를 보여주는 내부 컴포넌트
function BlogListContent({ allPosts }: { allPosts: PostMeta[] }) { const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllList, setShowAllList] = useState(false);

  const posts = useMemo(() => { const normalized = searchTerm.trim().toLowerCase();

    return allPosts.filter((post) => { const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
      const matchesSearch = normalized
        ? [post.title, post.summary, ...(post.tags || [])]
            .join(' ')
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesCategory && matchesSearch; }); }, [allPosts, categoryFilter, searchTerm]);

  const visualPosts = useMemo(() => getPostVisualsForList(posts), [posts]);
  const featuredPosts = visualPosts.slice(0, 8);
  const listPosts = visualPosts;
  const itemsPerPage = 5;
  const pageWindowSize = 10;
  const totalListPages = Math.ceil(listPosts.length / itemsPerPage);
  const pageWindowStart = Math.floor((currentPage - 1) / pageWindowSize) * pageWindowSize + 1;
  const visiblePageNumbers = Array.from(
    { length: Math.min(pageWindowSize, Math.max(totalListPages - pageWindowStart + 1, 0)) },
    (_, index) => pageWindowStart + index,
  );
  const displayedListPosts = showAllList
    ? listPosts
    : listPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const listTitle = showAllList ? '카테고리 전체보기' : '목록 리스트';
  const displayTitle = categoryFilter ? getCategoryLabel(categoryFilter) : '울산 생활정보 모음';
  const displaySubtitle = categoryFilter
    ? `${getCategoryLabel(categoryFilter)} 대표 글 8개와 전체 목록을 페이지별로 확인하세요.`
    : '울산광역시의 유용한 생활·복지·행사 정보를 대표 글 8개와 전체 목록으로 정리했습니다.';

  useEffect(() => {
    setCurrentPage(1);
    setShowAllList(false);
  }, [categoryFilter, searchTerm]);

  return (
    <div className="flex flex-col">
      <div className="mb-7 border-b-2 border-[#0F1A2B] pb-5 max-w-4xl">
        <h1 className="text-[32px] md:text-[40px] font-black text-[#0F1A2B] mb-2 tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-slate-500 font-medium">{displaySubtitle}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-6xl mb-6 opacity-30">📂</p>
          <p className="text-[18px] font-bold text-slate-400">아직 등록된 정보가 없습니다.</p>
        </div>
      ) : (
        <>
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPosts.map((post) => { 
                const { heroImage, fallbackImage, badgeClass, overlayClass } = post;
                const promoText =
                  post.category === '복지' ? '놓치면 손해' :
                  post.category === '생활' ? '오늘 꼭 확인' :
                  post.category === '행사' ? '이번 주 추천' :
                  post.category === '경제' ? '지원금 체크' :
                  '읽을수록 재밌음';

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border-[2px] border-[#0F1A2B] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#C9A857] transition-all duration-300 flex flex-col aspect-square relative"
                  >
                    <div className="absolute inset-0 z-0">
                      <SafeImage
                        src={heroImage}
                        fallbackSrc={fallbackImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${overlayClass} pointer-events-none`}></div>
                    </div>

                    <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
                      <div className="flex items-start">
                        <span className={`text-[12px] md:text-[13px] tracking-widest font-black backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm ${badgeClass}`}>
                          {post.category}
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black text-[#0F1A2B] bg-[#FFE08A] px-2.5 py-1 rounded-full shadow-sm">
                                  {promoText}
                                </span>
                          <span className="text-[11px] font-semibold text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                            📅 {post.date}
                          </span>
                          <span className="text-[10px] font-black tracking-[0.16em] text-[#FFE08A] uppercase"></span>
                        </div>
                        <h3 className="text-[16px] md:text-[18px] font-extrabold text-white leading-snug line-clamp-2 group-hover:text-[#C9A857] transition-colors break-keep">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ); })}
            </div>
          </section>

          <GoogleAdSlot
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG}
            label="블로그 목록 스폰서 배너"
            className="mb-8"
          />

          {listPosts.length > 0 && (
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-[22px] md:text-[26px] font-black text-[#0F1A2B]">{listTitle}</h2>
                  <p className="mt-1 text-[13px] font-semibold text-slate-500">
                    {showAllList
                      ? '현재 카테고리의 모든 글을 한 화면에서 확인하세요.'
                      : '5개씩 페이지로 확인하고, 전체보기 버튼으로 한 번에 펼쳐보세요.'}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-black text-slate-600">
                    총 {listPosts.length}개
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllList((current) => !current);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border-2 border-[#0F1A2B] bg-white px-4 py-2 text-[13px] font-black text-[#0F1A2B] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C9A857] hover:text-[#C9A857]"
                  >
                    {showAllList ? '목록으로' : '전체보기'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {displayedListPosts.map((post) => { const { heroImage, fallbackImage, badgeClass } = post;

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#C9A857] hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-[88px] sm:h-[92px] sm:w-[128px] sm:min-w-[128px] overflow-hidden bg-slate-100">
                          <SafeImage
                            src={heroImage}
                            fallbackSrc={fallbackImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className={`absolute left-2 top-2 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-black shadow-sm ${badgeClass}`}>
                            {post.category}
                          </span>
                        </div>

                        <div className="flex-1 p-2.5 sm:p-3">
                          <div className="flex flex-wrap items-center gap-1 mb-1.5 text-[10px] text-slate-500">
                            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-semibold">
                              📅 {post.date}
                            </span>
                            {(post.tags || []).slice(0, 2).map((tag) => (
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
                  ); })}
              </div>

              {!showAllList && totalListPages > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.max(pageWindowStart - pageWindowSize, 1))}
                    disabled={pageWindowStart === 1}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] font-bold text-[#0F1A2B] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                  >
                    이전
                  </button>

                  {visiblePageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${ currentPage === pageNumber
                          ? 'bg-[#0F1A2B] text-white'
                          : 'border border-slate-300 text-[#0F1A2B] hover:bg-slate-50' }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(Math.min(pageWindowStart + pageWindowSize, totalListPages))}
                    disabled={pageWindowStart + pageWindowSize > totalListPages}
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

      {/* 리스트 하단 문맥형 배너 */}
      <CoupangBanner variant="inline" topic={categoryFilter || '생활'} />
    </div>
  ); }

// 메인 페이지 컴포넌트
export default function BlogListPage({ allPosts }: { allPosts: PostMeta[] }) { return (
    <main className="max-w-6xl mx-auto px-4 md:px-5 py-10 md:py-12 flex flex-col gap-10 md:gap-12">
      <Suspense fallback={<div className="text-center py-20 text-slate-400">데이터를 불러오는 중입니다...</div>}>
        <BlogListContent allPosts={allPosts} />
      </Suspense>
    </main>
  ); }
