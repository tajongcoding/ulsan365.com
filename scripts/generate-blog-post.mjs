import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'local-info.json');
const POSTS_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

async function main() {
  console.log('최신 공공서비스 데이터 확인 중...');
  
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error('local-info.json 파일이 없습니다.');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  const localData = JSON.parse(fileContent);

  // events와 benefits 배열에서 가장 최근 항목 추출 (앞에 추가되었으므로 첫 번째 항목)
  // 사용자가 '배열의 마지막'이라고 했으나, fetch-public-data.js에서 unshift로 앞에 추가했음
  // 확실하게 하기 위해 최신 항목(index 0)을 타겟으로 함. (혹은 구조상 push되었다면 마지막 요소)
  const allItems = [
    ...(localData.events || []),
    ...(localData.benefits || [])
  ];

  if (allItems.length === 0) {
    console.log('데이터가 없습니다.');
    process.exit(0);
  }

  // 우리는 fetch-public-data.js에서 unshift를 사용했으므로 0번 인덱스가 최신입니다.
  // 하지만 프롬프트의 '마지막 항목'이라는 말을 존중하여 배열의 마지막 요소를 선택할 수도 구문할 수 있습니다.
  // 가장 확실한 방법은 "아직 마크다운 파일 내용에 name이 포함되지 않은 첫 번째 항목"을 찾는 것입니다.
  let targetItem = null;

  const existingFiles = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')) : [];
  const existingContents = existingFiles.map(f => fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8'));

  // 최신 항목(unshift 기준 가장 앞)부터 글 작성 여부 확인
  for (const item of allItems) {
    const isAlreadyPosted = existingContents.some(content => content.includes(item.name));
    if (!isAlreadyPosted) {
      targetItem = item;
      break; // 작성되지 않은 가장 최신 항목 1개 선택
    }
  }

  if (!targetItem) {
    console.log('이미 작성된 글입니다 (모든 데이터의 블로그 글이 존재현합니다).');
    process.exit(0);
  }

  console.log(`블로그 글 생성 대상: ${targetItem.name}`);

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  console.log('Gemini AI로 블로그 글 작성 중...');
  const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(targetItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: (오늘 날짜 YYYY-MM-DD)
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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

  if (!text) {
    console.error('Gemini 응답이 비어있습니다.');
    process.exit(1);
  }

  // 마크다운 블록 제거 (```markdown, ``` 등)
  text = text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();

  // 응답에서 마크다운 및 FILENAME 라인 분리
  const lines = text.split('\n');
  let filename = '';
  let contentLines = [];

  for (const line of lines) {
    if (line.trim().startsWith('FILENAME:')) {
      // "FILENAME: 2026-03-25-keyword" 형태에서 파일명 추출
      filename = line.replace('FILENAME:', '').trim();
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }
    } else {
      contentLines.push(line);
    }
  }

  const finalContent = contentLines.join('\n').trim();

  // 만약 파일명을 제대로 추출하지 못했다면 기본 이름 사용
  if (!filename) {
    const today = new Date().toISOString().slice(0, 10);
    filename = `${today}-public-service.md`;
  }

  // 파일 생성
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const filePath = path.join(POSTS_DIR, filename);

  try {
    // 프론트매터 아래 본문 끝에 혹시 추가적인 구문이 있다면 그걸 포함해서 저장
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log(`성공적으로 블로그 글이 작성되었습니다: ${filename}`);
  } catch (ignore) {
    console.error('마크다운 파일 저장 실패:');
    process.exit(1);
  }
}

main().catch(console.error);
