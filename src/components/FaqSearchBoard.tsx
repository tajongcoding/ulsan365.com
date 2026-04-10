"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
  category: string;
  district: string;
  href: string;
};

export default function FaqSearchBoard({ items }: { items: readonly FaqItem[] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');

  const categories = useMemo(() => ['전체', ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const districts = useMemo(() => ['전체', ...Array.from(new Set(items.map((item) => item.district)))], [items]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = selectedCategory === '전체' ? true : item.category === selectedCategory;
      const matchesDistrict = selectedDistrict === '전체' ? true : item.district === selectedDistrict;
      const matchesQuery = normalized
        ? [item.question, item.answer, item.category, item.district].join(' ').toLowerCase().includes(normalized)
        : true;

      return matchesCategory && matchesDistrict && matchesQuery;
    });
  }, [items, query, selectedCategory, selectedDistrict]);

  const popularKeywords = ['청년월세', '대형폐기물', '야간약국', '울산페이', '행사 일정'];

  return (
    <section className="bg-white rounded-[24px] shadow-sm border-[2px] border-slate-200 overflow-hidden">
      <div className="px-6 md:px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-black text-[#0F1A2B]">검색형 FAQ {items.length}선</h2>
            <p className="text-slate-500 mt-2 break-keep">
              키워드 검색과 카테고리 필터로 원하는 답변을 더 빠르게 찾을 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-start">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔎</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="예: 청년월세, 대형폐기물, 야간약국"
                  className="w-full bg-transparent outline-none text-[15px] md:text-[16px] text-[#0F1A2B] placeholder:text-slate-400"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-full border border-slate-300 px-2.5 py-1 text-[12px] font-bold text-slate-500 hover:border-[#C9A857] hover:text-[#C9A857]"
                  >
                    초기화
                  </button>
                ) : null}
              </div>
            </div>

            <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-black text-[#0F1A2B] shadow-sm">
              검색 결과 {filteredItems.length}건
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold text-slate-500">카테고리:</span>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-[14px] font-bold transition-all border ${
                      isActive
                        ? 'bg-[#0F1A2B] text-white border-[#0F1A2B]'
                        : 'bg-white text-[#0F1A2B] border-slate-300 hover:border-[#C9A857] hover:text-[#C9A857]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold text-slate-500">지역:</span>
              {districts.map((district) => {
                const isActive = selectedDistrict === district;
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => setSelectedDistrict(district)}
                    className={`rounded-full px-4 py-2 text-[14px] font-bold transition-all border ${
                      isActive
                        ? 'bg-[#C9A857] text-[#0F1A2B] border-[#C9A857]'
                        : 'bg-white text-[#0F1A2B] border-slate-300 hover:border-[#C9A857] hover:text-[#C9A857]'
                    }`}
                  >
                    {district}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-bold text-slate-500">많이 찾는 키워드:</span>
            {popularKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => setQuery(keyword)}
                className="rounded-full bg-[#FFF7E1] px-3 py-1.5 font-bold text-[#8A6A1F] hover:brightness-95"
              >
                #{keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <details
              key={`${item.question}-${selectedCategory}-${query}`}
              open={index === 0 && !query}
              className="group rounded-[22px] border-[2px] border-slate-200 bg-white p-5 shadow-sm open:border-[#C9A857]/60 open:shadow-md transition-all"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F1A2B] text-[12px] font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#0F1A2B]/5 px-2.5 py-1 text-[12px] font-bold text-[#0F1A2B]">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#FFF7E1] px-2.5 py-1 text-[12px] font-bold text-[#8A6A1F]">
                        {item.district}
                      </span>
                    </div>
                    <h3 className="text-[17px] md:text-[19px] font-extrabold text-[#0F1A2B] break-keep">
                      {item.question}
                    </h3>
                  </div>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF7E1] text-[#8A6A1F] text-xl font-bold group-open:rotate-45 transition-transform">
                  ＋
                </span>
              </summary>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-slate-600 leading-relaxed break-keep">
                <p>{item.answer}</p>
                <div className="mt-4">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-[14px] font-bold text-[#0F1A2B] hover:border-[#C9A857] hover:text-[#C9A857] transition-colors"
                  >
                    관련 정보 더 보기 →
                  </Link>
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <p className="text-[18px] font-black text-[#0F1A2B]">검색 결과가 없습니다</p>
            <p className="mt-2 text-[14px] text-slate-500 break-keep">
              다른 키워드나 카테고리로 다시 찾아보세요.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('전체');
                setSelectedDistrict('전체');
              }}
              className="mt-4 rounded-full border border-slate-300 bg-white px-4 py-2 text-[14px] font-bold text-[#0F1A2B] hover:border-[#C9A857] hover:text-[#C9A857]"
            >
              전체 FAQ 다시 보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
