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

배포 후 `/work/publish/`에서 접근 키를 입력하고 **공용보관함 열기 → 폴더 → ZIP 선택 → 검사 및 미리보기 → 공개 승인 및 발행** 순서로 사용합니다. ZIP은 서버가 공용보관함에서 가져오고, 브라우저가 원고와 이미지 7장을 연결합니다. 휴대폰·PC에 저장한 ZIP도 선택할 수 있으며 개별 파일 선택은 접힌 메뉴에 있습니다.

원고와 이미지가 지정된 브랜치에 한 커밋으로 저장됩니다. 운영 `main`에서는 기존 GitHub Actions 배포가 시작되며, 공개 주소는 Cloudflare 배포가 끝난 후 열립니다.

Cloudflare Pages의 `my-local-info` 프로젝트에서 실행 환경별로 다음 값을 설정합니다.

- `PUBLISH_ACCESS_KEY` — 운영자용 무작위 접근 키. 32자 이상이며 Secret으로 설정합니다.
- `PUBLISH_GITHUB_TOKEN` — 이 저장소의 Contents 읽기·쓰기 권한이 있는 GitHub 자격 증명. Secret으로 설정합니다.
- `PUBLISH_BRANCH` — 발행 대상 브랜치. Preview는 테스트 전용 브랜치, Production은 `main`을 사용합니다.
- `PUBLISH_DRIVE_SERVICE_ACCOUNT` — Google Drive API를 활성화한 서비스 계정 JSON을 Secret으로 설정합니다. 해당 계정 이메일에 `ULSAN365_공용보관함` 폴더의 보기 권한이 필요합니다. 앱은 `drive.readonly` 범위로 접근하며 공용보관함과 그 하위 폴더의 ZIP만 조회·다운로드합니다. 외부 폴더와 바로가기는 차단합니다.

ChatGPT의 Google Drive 연결과 배포된 앱의 서버 연결은 별도입니다. 앱의 보관함 Secret이 없으면 연결 설정 안내를 표시하며 휴대폰·PC의 ZIP 선택은 사용할 수 있습니다.

ZIP에는 날짜로 시작하는 원고 `YYYY-MM-DD-slug.md`가 정확히 1개 있어야 합니다. 제목, 날짜, 요약, 카테고리, 태그, 이미지 경로 7개를 YAML에 넣고 본문에는 01~06에 해당하는 이미지를 독립된 Markdown 줄로 순서대로 넣습니다. 이미지 확장자는 PNG/JPEG/WebP를 지원합니다. 원본 이미지 이름과 하위 폴더 구조는 원고의 images 목록으로 연결하며, 발행 사본의 경로와 파일명을 자동으로 통일합니다.

원고는 256 KiB, 각 이미지는 4 MiB, ZIP은 16 MiB, 압축 해제한 원고·이미지 합계는 16 MiB까지 지원합니다. HTML 전용 ZIP과 여러 글을 한 번에 담은 ZIP은 선택 단계에서 안내하고 중단합니다.
