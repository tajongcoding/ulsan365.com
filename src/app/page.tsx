import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// JSON 데이터 타입 정의
interface InfoItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

interface LocalData {
  events: InfoItem[];
  benefits: InfoItem[];
}

export default function Home() {
  // 로컬 파일에서 JSON 데이터 불러오기 (서버에서만 실행됨)
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data: LocalData = JSON.parse(fileContents);

  const { events, benefits } = data;

  // 현재 날짜 구하기 (업데이트 날짜 표시용)
  const getLocalDate = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  return (
    <main className="min-h-screen bg-[#fffdfa] text-gray-800 font-sans">
      {/* 1. 상단 헤더 타이틀 영역 (히어로 섹션) */}
      <section className="bg-orange-50 py-16 px-6 text-center border-b border-orange-100 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4 tracking-tight drop-shadow-sm">
          📍 성남시 생활 정보
        </h1>
        <p className="text-lg md:text-xl text-gray-600 break-keep">
          우리 동네의 알찬 행사와 놓치기 쉬운 혜택을 한눈에 확인하세요!
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-16">

        {/* 2. 이번 달 행사/축제 카드 목록 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">이번 달 행사 · 축제</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((item) => (
              <a href="/blog" key={item.id} className="bg-white border border-orange-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="text-xs font-bold text-orange-600 bg-orange-100 rounded-full px-3 py-1 w-max mb-4">
                  {item.category}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{item.summary}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 text-sm flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">📅</span>
                    <span className="text-gray-600">{item.startDate} ~ {item.endDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600 line-clamp-1">{item.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">🙋</span>
                    <span className="text-gray-600 line-clamp-1">{item.target}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 카드 목록 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">💰</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">놓치기 쉬운 지원금 · 혜택</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <a href="/blog" key={item.id} className="bg-white border border-green-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group flex-1">
                <div className="text-xs font-bold text-green-700 bg-green-100 rounded-full px-3 py-1 w-max mb-4">
                  {item.category}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{item.summary}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 text-sm flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">📅</span>
                    <span className="text-gray-600 font-medium">기간: {item.startDate} ~ {item.endDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">🎯</span>
                    <span className="text-gray-600">{item.target}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600">{item.location}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>

      {/* 4. 하단 푸터 (데이터 출처 및 업데이트 날짜) */}
      <footer className="mt-12 bg-gray-100 border-t border-gray-200 py-10 text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            본 웹사이트의 데이터 출처: <a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors">공공데이터포털 API (예정)</a>
          </p>
          <p>마지막 업데이트: {getLocalDate()}</p>
        </div>
      </footer>
    </main>
  );
}
