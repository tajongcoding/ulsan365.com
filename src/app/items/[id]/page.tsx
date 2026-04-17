import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  if (!fs.existsSync(dataPath)) return [];
  
  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContents);
  const items = [...(data.events || []), ...(data.benefits || [])];
  
  return items.map((item: any) => ({
    id: item.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  if (!fs.existsSync(dataPath)) return { title: '정보를 찾을 수 없습니다' };

  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContents);
  
  const item = [...(data.events || []), ...(data.benefits || [])].find(
    (i: any) => i.id.toString() === id
  );

  if (!item) return { title: '정보를 찾을 수 없습니다' };

  return {
    title: `${item.name} | 울산광역시 생활 정보`,
    description: item.summary,
  };
}

export default async function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const dataPath = path.join(process.cwd(), 'public', 'data', 'local-info.json');
  if (!fs.existsSync(dataPath)) return notFound();

  const fileContents = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(fileContents);
  
  const item = [...(data.events || []), ...(data.benefits || [])].find(
    (i: any) => i.id.toString() === id
  );

  if (!item) {
    return notFound();
  }

  // 색상 테마 동적 지정
  const isEvent = item.category === '행사' || item.category === '축제';
  const colorTheme = isEvent ? 'orange' : 'green';

  return (
    <main className="min-h-screen bg-[#fffdfa] py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className={`text-sm font-bold rounded-full px-4 py-1.5 w-max mb-6 ${isEvent ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'}`}>
          {item.category}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight break-keep">
          {item.name}
        </h1>
        
        <p className="text-lg text-gray-700 mb-10 leading-relaxed break-keep">
          {item.summary}
        </p>
        
        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl space-y-5 text-gray-800 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 pb-5 border-b border-gray-200/60">
            <span className="font-bold text-gray-500 w-24 shrink-0 flex items-center gap-2">
              <span>📅</span> 기간
            </span>
            <span className="font-medium">{item.startDate} ~ {item.endDate}</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 pb-5 border-b border-gray-200/60">
            <span className="font-bold text-gray-500 w-24 shrink-0 flex items-center gap-2">
              <span>📍</span> 장소/주관
            </span>
            <span className="font-medium">{item.location}</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-6">
            <span className="font-bold text-gray-500 w-24 shrink-0 flex items-center gap-2">
              <span>🙋</span> 지원 대상
            </span>
            <span className="font-medium">{item.target}</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-gray-800 hover:underline font-medium transition-colors w-full sm:w-auto text-center">
            ← 목록으로 돌아가기
          </Link>
          
          {item.link && item.link !== '#' && (
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto text-center"
            >
              상세내용 보러가기
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
