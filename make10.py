from pathlib import Path
from datetime import date, timedelta

out_dir = Path("src/content/posts")
out_dir.mkdir(parents=True, exist_ok=True)

posts = [
    ("울산 전기요금 감면 대상과 신청 방법", "복지"),
    ("울산 시내버스 환승 할인 제대로 받는 법", "생활"),
    ("울산 청년 면접정장 무료 대여 이용 가이드", "경제"),
    ("울산 주말에 가기 좋은 실내 나들이 장소", "관광"),
    ("울산 반려동물 동반 산책 코스 추천", "행사"),
    ("울산 어르신 교통비 지원 확인 방법", "복지"),
    ("울산 야간 진료 병원 찾는 순서", "생활"),
    ("울산 소상공인 정책자금 준비 체크리스트", "경제"),
    ("울산 일몰 보기 좋은 바다 명소 5곳", "관광"),
    ("울산 이번 달 가족 체험 행사 모아보기", "행사"),
]

def slugify(title: str) -> str:
    mapping = {
        "복지": "welfare",
        "생활": "life",
        "경제": "economy",
        "관광": "place",
        "행사": "event",
    }
    for k, v in mapping.items():
        if k in title:
            return v
    return "post"

start = date(2026, 3, 14)

for i, (title, category) in enumerate(posts):
    d = start + timedelta(days=i * 4)
    slug = {
        "복지": "support-guide",
        "생활": "daily-guide",
        "경제": "business-guide",
        "관광": "travel-guide",
        "행사": "festival-guide",
    }[category]
    filename = out_dir / f"{d.isoformat()}-{slugify(category)}-{i+1:02d}-{slug}.md"
    content = f"""---
title: {title}
date: {d.isoformat()}
summary: 울산 시민이 실제로 많이 찾는 정보를 이해하기 쉽게 정리했습니다.
category: {category}
tags:
  - 울산
  - {category}
  - 생활정보
---

## 핵심 요약
{title}에 필요한 핵심 내용을 먼저 확인하세요.

## 무엇을 준비하면 되나요
- 대상 여부 확인
- 신청 경로 확인
- 필요한 서류 정리
- 접수 시기 점검

## 꼭 확인할 점
- 공식 공고 기준 확인
- 신청 기간 마감 전 접수
- 중복 지원 가능 여부 확인

## 마무리
울산 시민에게 도움이 되는 실용 정보를 계속 업데이트하겠습니다.
"""
    filename.write_text(content, encoding="utf-8")

print("make10.py 생성 완료")
