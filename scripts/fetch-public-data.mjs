import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'local-info.json');

async function main() {
  console.log('공공데이터포털 API에서 데이터 가져오기 시작...');
  
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!publicDataApiKey) {
    console.error('PUBLIC_DATA_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(publicDataApiKey)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`공공데이터 API 호출 실패: ${response.status}`);
    process.exit(1);
  }

  const data = await response.json();
  const items = data.data || [];

  // 필터링 규칙 적용
  const checkKeyword = (item, keyword) => {
    const fields = [item['서비스명'], item['서비스목적요약'], item['지원대상'], item['소관기관명']];
    return fields.some(field => typeof field === 'string' && field.includes(keyword));
  };

  let filteredItems = items.filter(item => checkKeyword(item, '울산광역시'));
  
  if (filteredItems.length === 0) {
    filteredItems = items.filter(item => checkKeyword(item, '경기'));
  }
  
  if (filteredItems.length === 0) {
    filteredItems = items;
  }

  // [2단계] 기존 데이터와 비교
  let localData = { events: [], benefits: [] };
  if (fs.existsSync(DATA_FILE_PATH)) {
    try {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      localData = JSON.parse(fileContent);
    } catch (ignore) {
      console.error('기존 JSON 파일 읽기 실패:');
      process.exit(1);
    }
  }

  const existingNames = new Set([
    ...(localData.events || []).map(e => e.name),
    ...(localData.benefits || []).map(b => b.name)
  ]);

  const newItems = filteredItems.filter(item => !existingNames.has(item['서비스명']));

  if (newItems.length === 0) {
    console.log('새로운 데이터가 없습니다');
    process.exit(0);
  }

  const targetItem = newItems[0];
  console.log(`새로운 항목 발견: ${targetItem['서비스명']}`);

  // [3단계] Gemini AI로 새 항목 가공
  console.log('Gemini AI로 데이터 가공 중...');
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

원본 데이터:
${JSON.stringify(targetItem, null, 2)}`;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const geminiRes = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!geminiRes.ok) {
    console.error(`Gemini API 호출 실패: ${geminiRes.status}`);
    process.exit(1);
  }

  const geminiData = await geminiRes.json();
  let text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // 마크다운 코드블록 및 불필요한 공백 제거
  text = text.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();

  let processedItem;
  try {
    processedItem = JSON.parse(text);
  } catch (ignore) {
    console.error('Gemini 응답 JSON 파싱 실패:', text);
    // 에러 발생 시 기존 local-info.json을 변경하지 않고 종료
    process.exit(1);
  }

  // [4단계] 기존 데이터에 추가
  if (processedItem.category === '행사') {
    if (!localData.events) localData.events = [];
    localData.events.unshift(processedItem);
  } else {
    if (!localData.benefits) localData.benefits = [];
    localData.benefits.unshift(processedItem);
  }

  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(localData, null, 2), 'utf-8');
    console.log('완료: 기존 JSON 데이터에 새로운 항목이 추가되었습니다.');
  } catch (ignore) {
    console.error('JSON 파일 쓰기 실패:');
    process.exit(1);
  }
}

main().catch(console.error);
