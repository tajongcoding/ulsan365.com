# 자동화 전략 컨설팅 기록 (2026-04-01)

## 📋 현재 영상 제작 프로세스

### 기본 순서
1. AI에게 요구
2. 프롬프트 생성 → AI에서 이미지 생성
3. 이미지 → 그록(Grok)에서 영상 생성
4. 브루(Brew)에서 합쳐서 음성 생성
5. 카드문구 삽입
6. 영상 업로드 완료

### 정형화된 템플릿 운영
- **채널명**: 🎎 아시나요 (Did You Know?) - 한국 문화 교육 채널
- **포맷**: 아시나요? 시리즈 (질문형 강조)
- **분량**: 약 60초 스토리텔링 다큐멘터리 형식
- **스타일**: 사실적, 역동적, 다이나믹한 강력한 훅
- **라이센스**: A-EDFW3F (2026.04.30까지)

### 템플릿 구성 요소
1. **나레이션 대본** - 파트별 이모지 사용
2. **AI 이미지** - 10개 프롬프트 + 10개 이미지
3. **인스타그램 강조 자막** - 10개 카드
4. **타임라인 구성** - 일관성 있게 정형화
5. **BGM/효과음** - 전체 추천
6. **썸네일** - 정형화된 디자인 3개 시안
7. **채널용 제목** - 3개
8. **설명 문구** - 600자 내외
9. **메타데이터** - 해시태그, 타임스탬프

### 시각적 일관성 기준
- 스타일: High-budget 사극 영화 촬영 (Arri Alexa, 깊은 음영, 8K 해상도)
- 비율: 9:16 숏폼 포맷
- 로고: [🎎 아시나요] Top-right corner, Gold text, 10px
- 해시태그: 약 10개
- 타임스탬프: 챕터 포함

## 📊 현황 분석

### 운영 현황
- **제작 주기**: 주 3-4개 콘텐츠 (월 12-16개)
- **운영 방식**: 1인 운영
- **현황**: 과부하 상태 → **자동화 절실**

### 강점
✅ 체계적인 단계별 프로세스 구축
✅ AI 도구들의 활용으로 자동화 시작
✅ 정형화된 템플릿으로 일관성 있는 콘텐츠 생산
✅ 배치 처리 최적화 (10개 이미지/자막/프롬프트 연동)
✅ 시각적 일관성 유지 시스템
✅ 다층적 메타데이터 관리
✅ 강한 채널 브랜딩

### 약점
⚠️ 월 12-16개 콘텐츠를 1인이 수동으로 처리
⚠️ 반복적인 작업 (프롬프트 생성, 메타데이터, 자막)
⚠️ 자동화 도구 미흡

## 🚀 전문가 자동화 추천 전략

### Phase 1: 가장 빠른 효과 (1-2주) - Make.com 활용
**목표**: 반복적인 수동 작업 70% 줄이기

#### Make.com Workflow 구성
```
1. 콘텐츠 기획 (Notion/Sheet 입력)
   ↓
2. AI 프롬프트 자동 생성 (Claude)
   - 10개 이미지 프롬프트
   - 10개 자막 문구
   ↓
3. Webhook → 브루(Brew)로 전송
   - 배치 이미지 생성 요청
   ↓
4. 메타데이터 자동 생성
   - 썸네일 3개 (Canva API)
   - 제목 3개, 설명 600자
   - 해시태그, 타임스탬프
   ↓
5. GitHub Issue/PR 자동 생성
   - 진행상황 추적 (자동 갱신)
```

#### 예상 효과
- 프롬프트 생성 시간: 2시간 → 10분
- 메타데이터 작성: 1시간 → 5분
- **총 시간 절감: 주 6-8시간**

#### 필요한 것
- Make.com 계정 (무료)
- Claude API 키 ($20/월)
- Google Sheet 1개 (데이터 입력용)

---

### Phase 2: 중기 최적화 (2-4주) - Python 자동화 + GitHub Actions
**목표**: 콘텐츠 버전 관리 및 검증 자동화

#### 구조
```
github_tajong_automation/
├── scripts/
│   ├── batch_prompt_generator.py
│   ├── metadata_builder.py
│   ├── visual_consistency_checker.py
│   ├── timeline_generator.py
│   └── github_issue_reporter.py
├── .github/workflows/
│   ├── auto-content-create.yml
│   ├── quality-check.yml
│   ├── metadata-sync.yml
│   └── license-reminder.yml
└── templates/
    ├── didYouKnow_template.json
    ├── bingoPlay_template.json
    └── metadata_template.json
```

#### GitHub Actions 워크플로우
```yaml
name: Weekly Content Automation
on:
  schedule:
    - cron: '0 10 Monday'

jobs:
  generate-content:
    runs-on: ubuntu-latest
    steps:
      1. Notion/Google Sheet 읽기
      2. Claude API → 프롬프트 생성
      3. 브루 API → 이미지 생성 요청
      4. 메타데이터 생성
      5. 자동 GitHub Issue 생성
      6. Slack 알림
```

#### 예상 효과
- 자동 스케줄링: 매주 지정된 시간에 자동 실행
- 품질 검증: 자동 일관성 체크
- 진행상황 추적: GitHub Issue로 자동 관리

#### 필요한 것
- GitHub 저장소 (이미 있음 ✅)
- 기본 Python 지식
- API 키 관리 (GitHub Secrets)

---

### Phase 3: 고급 최적화 (1-2개월) - AI 에이전트 생성
**목표**: 거의 손대지 않고 자동 운영 (90% 자동화)

#### 타종 콘텐츠 에이전트 아키텍처
```
Step 1: 입력 분석 에이전트
(Notion DB에서 주제 읽음)
        ↓
Step 2: 크리에이티브 에이전트
(Claude + 스타일 가이드)
- 프롬프트 생성
- 자막 문구 생성
- BGM/효과음 추천
        ↓
Step 3: 실행 에이전트
(Make.com + API 연동)
- 브루에 작업 전송
- 상태 모니터링
- 오류 발생시 재시도
        ↓
Step 4: 품질 검증 에이전트
(비전 AI + 텍스트 분석)
- 시각적 일관성 확인
- 자막 문법 검증
- 메타데이터 완성도 확인
        ↓
Step 5: 배포 에이전트
(YouTube API)
- 자동 업로드
- 썸네일 설정
- 메타데이터 적용
- 스케줄링
        ↓
📊 대시보드 (성과 추적)
```

#### 구현 도구
- LangGraph or CrewAI (AI 에이전트 프레임워크)
- FastAPI (webhook 서버)
- Supabase (데이터베이스)
- GitHub Actions (스케줄링)

---

## 📅 즉시 실행 계획

### Week 1-2: Phase 1 (Make.com) - 20% 시간 절감
- Make.com 계정 생성 (무료)
- Google Sheet ↔ Make 연동
- Claude API 키 등록
- 프롬프트 생성 자동화
- 테스트 1-2개 콘텐츠로 검증

### Week 3-4: Phase 2 (GitHub Actions) - 추가 30% 시간 절감
- Python 스크립트 작성
- GitHub Actions 워크플로우 설정
- Slack/Discord 알림 연동
- 자동 Issue 생성

### Month 2+: Phase 3 (AI 에이전트) - 80% 이상 자동화
- CrewAI or LangGraph 학습
- 에이전트 아키텍처 설계
- 각 에이전트별 프롬프트 최적화
- 통합 테스트 및 배포

---

## 💰 비용 추정

| 항목 | 월 비용 |
|------|--------|
| Make.com | $10+ |
| Claude API | $20 |
| GitHub Actions | 무료 |
| Notion API | 무료 |
| **총합** | **$30-50/월** |

→ 기존 브루 라이센스 대비 매우 저렴!

---

## 🎁 즉시 제공 가능

1. ✅ Make.com 템플릿 - 콘텐츠 자동화 시작 설정서
2. ✅ Python 자동화 스크립트 - batch_prompt_generator.py 작성
3. ✅ GitHub Actions 워크플로우 - .github/workflows/ 설정
4. ✅ 메타데이터 생성기 - 제목/설명/해시태그 자동 생성
5. ✅ 저장소에 PR 생성 - 즉시 적용 가능한 코드

---

## 📝 작성 정보
- **작성일**: 2026-04-01
- **상담자**: GitHub Copilot Chat Assistant
- **주제**: AI 기반 영상 콘텐츠 자동화 전략 컨설팅
- **문서 목적**: 자동화 로드맵 및 즉시 실행 계획 기록