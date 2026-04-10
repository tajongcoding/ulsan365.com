# 광고/제휴 배치 가이드

## 권장 원칙
- Google AdSense와 쿠팡 파트너스 배너는 **같은 화면에서 바로 붙여 놓지 않기**
- 광고 앞뒤에 **실제 콘텐츠 블록 1개 이상** 두기
- Google은 `광고(Ad)` 성격, 쿠팡은 `제휴(Partner Link)` 성격으로 구분 표시 유지
- 한 페이지에 광고가 너무 많아 보이지 않도록 **1~2개 수준** 유지

## 현재 배치 구조

### 홈 (`src/app/page.tsx`)
- 상단 정보 카드 아래: `GoogleAdSlot` 1개
- FAQ 이후 하단: `CoupangBanner` 1개

### 블로그 목록 (`src/components/BlogList.tsx`)
- 대표 글 그리드 아래: `GoogleAdSlot` 1개
- 페이지 하단: `CoupangBanner` 1개

### 글 상세 (`src/app/blog/[slug]/page.tsx`)
- 본문 종료 직후: `GoogleAdSlot` 1개
- 관련 글 아래: `CoupangBanner` 1개

## 수정 포인트

### AdSense 슬롯 ID 넣기 (`.env.local`)
```env
NEXT_PUBLIC_ADSENSE_SLOT_HOME=여기에값
NEXT_PUBLIC_ADSENSE_SLOT_BLOG=여기에값
NEXT_PUBLIC_ADSENSE_SLOT_POST=여기에값
```

### 쿠팡 링크 바꾸기 (`.env.local`)
```env
NEXT_PUBLIC_COUPANG_LINK_DEFAULT=...
NEXT_PUBLIC_COUPANG_LINK_WELFARE=...
NEXT_PUBLIC_COUPANG_LINK_ECONOMY=...
NEXT_PUBLIC_COUPANG_LINK_LIFE=...
NEXT_PUBLIC_COUPANG_LINK_EVENT=...
NEXT_PUBLIC_COUPANG_LINK_ATTRACTION=...
```

## 운영 팁
- Google 배너는 **고정성/자동형**으로 운영
- 쿠팡 링크는 **계절형/카테고리형**으로 2~4주마다 교체
- 클릭 유도 문구는 과장하지 말고, 생활정보 흐름에 자연스럽게 연결
