from pathlib import Path
from datetime import date, timedelta, datetime
import shutil

posts_dir = Path("src/content/posts")
backup_dir = Path("backups") / f"posts-archive-{datetime.now().strftime('%Y%m%d-%H%M')}"
backup_dir.mkdir(parents=True, exist_ok=True)
posts_dir.mkdir(parents=True, exist_ok=True)

# 기존 글 백업 후 비우기
for f in posts_dir.glob("*.md"):
    shutil.move(str(f), str(backup_dir / f.name))

posts = [
    ("울산 시내버스 환승 할인 제대로 받는 법", "생활", "life", "bus-transfer-guide"),
    ("울산 야간 진료 병원 찾는 순서", "생활", "life", "night-clinic-guide"),
    ("울산 대형폐기물 신고부터 배출까지 한 번에 정리", "생활", "life", "waste-disposal-guide"),
    ("울산 전입신고 준비물과 온라인 신청 방법", "생활", "life", "move-in-report-guide"),
    ("울산 무인민원발급기 위치와 이용 시간 총정리", "생활", "life", "civil-machine-guide"),
    ("울산 전기요금 감면 대상과 신청 방법", "복지", "welfare", "electricity-discount-guide"),
    ("울산 어르신 교통비 지원 확인 방법", "복지", "welfare", "senior-transport-guide"),
    ("울산 한부모가정 지원 제도 쉽게 이해하기", "복지", "welfare", "single-parent-support-guide"),
    ("울산 청년 월세 지원 신청 전 꼭 볼 체크리스트", "복지", "welfare", "youth-rent-support-guide"),
    ("울산 출산가정 지원 혜택 한눈에 보기", "복지", "welfare", "birth-support-guide"),
    ("울산 소상공인 정책자금 준비 체크리스트", "경제", "economy", "smallbiz-funding-guide"),
    ("울산 청년 면접정장 무료 대여 이용 가이드", "경제", "economy", "interview-suit-guide"),
    ("울산 중소기업 스마트공장 지원사업 핵심 정리", "경제", "economy", "smart-factory-guide"),
    ("울산 전통시장 할인 행사 활용법", "경제", "economy", "market-discount-guide"),
    ("울산 창업 상담 받을 때 준비할 것들", "경제", "economy", "startup-consulting-guide"),
    ("울산 주말에 가기 좋은 실내 나들이 장소", "관광", "place", "indoor-trip-guide"),
    ("울산 일몰 보기 좋은 바다 명소 5곳", "관광", "place", "sunset-spot-guide"),
    ("울산 봄꽃 산책하기 좋은 길 추천", "관광", "place", "flower-walk-guide"),
    ("울산 비 오는 날 가기 좋은 전시·실내 명소", "관광", "place", "rainy-day-place-guide"),
    ("울산 가족과 함께 걷기 좋은 강변 코스", "관광", "place", "river-walk-guide"),
    ("울산 이번 달 가족 체험 행사 모아보기", "행사", "event", "family-event-guide"),
    ("울산 반려동물 동반 주말 행사 정리", "행사", "event", "pet-event-guide"),
    ("울산 야외 공연 일정 확인하는 방법", "행사", "event", "outdoor-concert-guide"),
    ("울산 플리마켓 일정과 방문 팁", "행사", "event", "flea-market-guide"),
    ("울산 아이와 함께 가기 좋은 축제 추천", "행사", "event", "kids-festival-guide"),
    ("울산이 산업도시로 성장한 이유 쉽게 이해하기", "울산 아시나요", "ulsan", "industry-story-guide"),
    ("울산 태화강이 특별한 이유 5가지", "울산 아시나요", "ulsan", "taehwa-story-guide"),
    ("울산 대왕암이 대표 명소가 된 배경", "울산 아시나요", "ulsan", "daewangam-story-guide"),
    ("울산 고래문화가 유명한 이유 정리", "울산 아시나요", "ulsan", "whale-story-guide"),
    ("울산이 살기 좋은 도시로 불리는 이유", "울산 아시나요", "ulsan", "city-story-guide"),
]

start = date(2026, 3, 1)

def summary_for(title, category):
    return f"{title}에 필요한 핵심 정보와 준비 사항을 울산 시민 기준으로 알기 쉽게 정리했습니다."

for i, (title, category, prefix, slug) in enumerate(posts):
    d = start + timedelta(days=i * 2)
    filename = posts_dir / f"{d.isoformat()}-{prefix}-{i+1:02d}-{slug}.md"
    content = f"""---
title: {title}
date: {d.isoformat()}
summary: "{summary_for(title, category)}"
category: {category}
tags:
  - 울산
  - {category}
  - 생활정보
---

## 핵심 요약
{title}이 필요한 분들을 위해 꼭 알아야 할 내용만 먼저 정리했습니다. 실제 신청이나 이용 전에 대상 조건, 운영 시간, 준비물, 접수 경로를 함께 확인하면 훨씬 수월합니다.

## 이런 분께 도움됩니다
- 울산에서 관련 정보를 처음 찾는 분
- 신청 조건과 준비 서류가 헷갈리는 분
- 방문 전 온라인 확인이 필요한 분
- 실제 이용 순서를 빠르게 알고 싶은 분

## 준비할 것
- 신분 확인 자료
- 주소 및 연락처 확인
- 관련 증빙서류 여부 점검
- 운영 기관 및 접수 채널 확인

## 이용 방법
1. 공식 안내 또는 담당 기관 정보를 먼저 확인합니다.
2. 대상 조건과 신청 기간을 체크합니다.
3. 필요한 서류를 준비합니다.
4. 온라인 또는 방문 접수를 진행합니다.

## 놓치기 쉬운 포인트
- 접수 마감일 직전에는 대기 시간이 길 수 있습니다.
- 예산 소진형 사업은 조기 종료 가능성이 있습니다.
- 지원 제도는 중복 신청 여부를 꼭 확인해야 합니다.

## 마무리
이 글은 울산 시민이 실제로 많이 찾는 내용을 기준으로 정리했습니다. 최신 공고와 세부 기준은 담당 기관 공지를 함께 확인하는 것이 가장 안전합니다.
"""
    filename.write_text(content, encoding="utf-8")

print(f"백업 위치: {backup_dir}")
print(f"신규 글 생성: {len(posts)}건")
