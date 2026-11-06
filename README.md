# 아시나요 울산365닷컴 (ulsan365)

울산광역시의 생활, 복지, 경제 정보를 시민들에게 알기 쉽게 전달하는 비영리 공공안내 포털입니다.

## 기술 스택
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages / GitHub Actions

## 시작하기

먼저 개발 서버를 실행합니다:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 주요 기능
- 울산 공공데이터를 활용한 실시간 정보 업데이트
- 울산 생활 필수 앱 추천
- 쿠팡 파트너스 연동을 통한 운영비 지원
- 반응형 웹 디자인 (모바일/데스크톱 최적화)

## 운영자용 모바일 발행

배포 후 `/work/publish/`에서 Google Drive 또는 휴대폰 파일 선택기로 받은 원고(.md)와 이미지 7장을 업로드합니다. 먼저 검사하고 미리보기를 승인하면 원고와 이미지가 지정된 브랜치에 한 커밋으로 저장됩니다. 운영 `main`에 저장하면 기존 GitHub Actions 배포가 시작되며, 공개 주소는 Cloudflare 배포가 끝난 후에 열립니다.

Cloudflare Pages의 `my-local-info` 프로젝트에서 실행 환경별로 다음 값을 설정합니다.

- `PUBLISH_ACCESS_KEY` — 운영자에게만 전달하는 무작위 접근 키. 32자 이상이며 Secret으로 설정합니다.
- `PUBLISH_GITHUB_TOKEN` — 이 저장소의 Contents 읽기·쓰기 권한이 있는 GitHub 자격 증명. Secret으로 설정합니다.
- `PUBLISH_BRANCH` — 발행 대상 브랜치. Preview 환경은 테스트 전용 브랜치를 사용하고 Production 환경은 `main`을 사용합니다.

원고 이름은 `YYYY-MM-DD-slug.md`이며 제목, 날짜, 요약, 카테고리, 태그, 이미지 경로 7개를 YAML에 넣습니다. 이미지 파일명은 `YYYY-MM-DD-slug-00.webp`부터 `-06.webp`까지로 지정합니다(PNG/JPEG도 가능). 이미지 경로는 `/images/info/YYYY-MM-DD/`로 시작하고, 본문에는 01~06 이미지를 독립된 Markdown 줄로 순서대로 넣습니다. 원고는 256 KiB, 각 이미지는 2 MiB, 전체 요청은 16 MiB까지 지원합니다.
