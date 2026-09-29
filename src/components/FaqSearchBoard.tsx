"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
  category: string;
  district: string;
  href: string;
};

const districtMeta: Record<string, { logo: string; desc: string }> = {
  전체: { logo: '/ulsan_logo.png', desc: '울산 전체 FAQ 한 번에 보기' },
  남구: { logo: 'https://www.ulsannamgu.go.kr/images/namgu_img/namgu_logo.png', desc: '청년정책·행사·생활 밀집 정보' },
  중구: { logo: 'https://www.junggu.ulsan.kr/images/domain/junggu/file/symbol.jpg', desc: '행정민원·복지·생활 편의 정보' },
  동구: { logo: 'https://www.donggu.ulsan.kr/images/main/donggu_logo.png', desc: '교통·산업생활·실용 정보' },
  북구: { logo: 'https://www.bukgu.ulsan.kr/images/header/logo.svg', desc: '가정·복지·주거 관련 정보' },
  울주군: { logo: 'https://www.ulju.ulsan.kr/ulju/img/common/logo.svg', desc: '관광·나들이·생활 행정 정보' },
};

export default function FaqSearchBoard({ items }: { items: readonly FaqItem[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedDistrict, setSelectedDistrict] = useState('전체');

  const categories = useMemo(() => ['전체', ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const districts = useMemo(() => ['전체', ...Array.from(new Set(items.map((item) => item.district)))], [items]);

  useEffect(() => {
    const nextCategory = searchParams.get('category') || '전체';
    const nextDistrict = searchParams.get('district') || '전체';

    setSelectedCategory(categories.includes(nextCategory) ? nextCategory : '전체');
    setSelectedDistrict(districts.includes(nextDistrict) ? nextDistrict : '전체');
  }, [searchParams, categories, districts]);

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

  const popularKeywords = ['청년월세', '대형폐기물', '야간약국', '남구', '울주군'];

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

          <div className="space-y-4">
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

            <div>
              <p className="mb-2 text-[13px] font-bold text-slate-500">울산 전체·구·군별 보기:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                {districts.map((district) => {
                  const isActive = selectedDistrict === district;
                  const count = district === '전체' ? items.length : items.filter((item) => item.district === district).length;
                  const meta = districtMeta[district] || districtMeta['전체'];

                  return (
                    <button
                      key={district}
                      type="button"
                      onClick={() => setSelectedDistrict(district)}
                      className={`rounded-[18px] border p-3 text-left transition-all ${
                        isActive
                          ? 'border-[#C9A857] bg-[#FFF9EC] shadow-sm'
                          : 'border-slate-200 bg-white hover:border-[#C9A857] hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <img src={meta.logo} alt={`${district} 로고`} className="h-8 w-14 object-contain object-left" />
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${isActive ? 'bg-[#0F1A2B] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {count}건
                        </span>
                      </div>
                      <div className="text-[15px] font-black text-[#0F1A2B]">{district}</div>
                      <p className="mt-1 text-[12px] text-slate-500 break-keep leading-relaxed">{meta.desc}</p>
                    </button>
                  );
                })}
              </div>
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

          {selectedDistrict !== '전체' ? (
            <div className="rounded-[18px] border border-[#C9A857]/40 bg-[#FFF9EC] px-4 py-3">
              <p className="text-[13px] font-black tracking-[0.16em] text-[#8A6A1F] uppercase">현재 선택 구·군</p>
              <p className="mt-1 text-[16px] font-black text-[#0F1A2B]">{selectedDistrict} FAQ 보기</p>
              <p className="mt-1 text-[13px] text-slate-600 break-keep">{districtMeta[selectedDistrict]?.desc} 중심으로 질문을 빠르게 볼 수 있습니다.</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
            <details
              key={`${item.question}-${selectedCategory}-${selectedDistrict}-${query}`}
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
            ))}
          </div>
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
