from pathlib import Path
from datetime import date
import random
import re

POSTS_DIR = Path("src/content/posts")
POSTS_DIR.mkdir(parents=True, exist_ok=True)

today = date.today().isoformat()

topics = [
    ("life", "생활", "울산 공영주차장 이용 전 꼭 확인할 것", "울산 공영주차장 요금과 이용 팁을 정리했습니다."),
    ("life", "생활", "울산 야간약국 찾을 때 가장 빠른 방법", "급할 때 바로 찾을 수 있는 울산 야간약국 확인법입니다."),
    ("welfare", "복지", "울산 복지 지원금, 신청 전에 꼭 확인할 기준", "울산 시민이 자주 놓치는 지원금 기준을 정리했습니다."),
    ("welfare", "복지", "울산 어르신 복지 혜택, 지금 확인해야 할 내용", "울산 어르신 대상 복지 혜택 핵심만 정리했습니다."),
    ("economy", "경제", "울산 소상공인 지원정책, 놓치기 쉬운 포인트", "울산 소상공인이 챙겨야 할 지원정책 요약입니다."),
    ("economy", "경제", "울산 청년 지원사업, 지금 보기 좋은 핵심 정리", "울산 청년 대상 지원사업 핵심만 모았습니다."),
    ("event", "행사", "울산 이번 주 행사, 가기 전 체크할 것", "울산 이번 주 행사 일정과 방문 팁을 정리했습니다."),
    ("event", "행사", "울산 가족 나들이 행사, 주말 전에 볼 정리", "가족과 함께 가기 좋은 행사 정보를 모았습니다."),
    ("ulsan", "명소", "울산이 특별한 도시로 불리는 이유", "울산만의 특징과 매력을 쉽게 정리했습니다."),
    ("ulsan", "명소", "울산 현지인이 좋아하는 숨은 장소 이야기", "울산 시민들이 좋아하는 장소를 중심으로 정리했습니다."),
]

IMAGE_POOLS = {
    "parking": [
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1400",
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg",
    ],
    "pharmacy": [
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1583912267550-75846eb5bbf6?auto=format&fit=crop&q=80&w=1400",
    ],
    "welfare": [
        "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1400",
    ],
    "economy": [
        "https://upload.wikimedia.org/wikipedia/commons/e/eb/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1400",
    ],
    "event": [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1400",
        "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
        "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg",
    ],
    "scenic": [
        "https://upload.wikimedia.org/wikipedia/commons/1/1f/%EA%B0%84%EC%A0%88%EA%B3%B6%ED%92%8D%EA%B2%BD_-_panoramio.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/76/Shade_Of_Taehwagang_%2871978891%29.jpeg",
        "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ulsan_taehwaru.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/2/29/Bangudae_Petroglyphs_from_Ulsan_%285329613206%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1400",
    ],
}

def select_image_pool(group: str, category: str, title: str) -> list[str]:
    if re.search(r"야간약국|약국|병원|의료|응급|진료|클리닉", title):
        return IMAGE_POOLS["pharmacy"]
    if re.search(r"공영주차장|주차|버스|교통|분실|쓰레기|폐기물|수도|이사|생활", title):
        return IMAGE_POOLS["parking"]
    if group == "economy" or category == "경제":
        return IMAGE_POOLS["economy"]
    if group == "event" or category == "행사":
        return IMAGE_POOLS["event"]
    if group == "welfare" or category == "복지":
        return IMAGE_POOLS["welfare"]
    if group in {"ulsan", "place"} or category == "명소":
        return IMAGE_POOLS["scenic"]
    return IMAGE_POOLS["parking"]

def stable_seed(value: str) -> int:
    total = 0
    for index, char in enumerate(value):
        total += (index + 1) * ord(char)
    return total

def rotate_images(images: list[str], seed_key: str) -> list[str]:
    if not images:
        return []
    start = stable_seed(seed_key) % len(images)
    return [images[(start + index) % len(images)] for index in range(min(6, len(images)))]

def build_image_block(title: str, group: str, category: str, seed_key: str) -> str:
    images = rotate_images(select_image_pool(group, category, title), seed_key)
    return "\n".join(
        f"![{title} {index + 1}]({url})" for index, url in enumerate(images)
    )

used_titles = set()
for p in POSTS_DIR.glob("*.md"):
    text = p.read_text(encoding="utf-8", errors="ignore")
    m = re.search(r'^title:\s*(.+)$', text, flags=re.M)
    if m:
        used_titles.add(m.group(1).strip().strip('"'))

random.shuffle(topics)
picked = []
for item in topics:
    if item[2] not in used_titles:
        picked.append(item)
    if len(picked) == 2:
        break

if len(picked) < 2:
    picked = topics[:2]

existing_nums = []
for p in POSTS_DIR.glob("*.md"):
    m = re.search(r'-(\d+)-[^/]+\.md$', p.name)
    if m:
        existing_nums.append(int(m.group(1)))

next_num = max(existing_nums) + 1 if existing_nums else 1

def slugify(s: str) -> str:
    rep = {
        "울산": "ulsan",
        "공영주차장": "public-parking",
        "야간약국": "night-pharmacy",
        "복지 지원금": "welfare-support",
        "어르신 복지 혜택": "senior-welfare",
        "소상공인 지원정책": "smallbiz-support",
        "청년 지원사업": "youth-support",
        "이번 주 행사": "weekly-event",
        "가족 나들이 행사": "family-event",
        "특별한 도시": "special-city",
        "숨은 장소": "hidden-spots",
        "이용 전 꼭 확인할 것": "must-check",
        "가장 빠른 방법": "fast-guide",
        "놓치기 쉬운 포인트": "key-points",
        "핵심 정리": "summary",
        "이야기": "story",
        "이유": "reasons",
    }
    out = s
    for k, v in rep.items():
        out = out.replace(k, v)
    out = re.sub(r'[^a-zA-Z0-9\- ]', '', out)
    out = out.lower().strip().replace(" ", "-")
    out = re.sub(r'-+', '-', out)
    return out[:60].strip("-") or "post"

template = """---
title: {title}
pubDate: "{pubDate}"
summary: "{summary}"
category: {category}
tags:
  - 울산
  - {category}
  - 자동생성
---

{image_block}

## 핵심 요약
{title}에 대해 울산 시민 기준으로 꼭 알아야 할 내용만 먼저 정리했습니다.

## 이런 분께 도움됩니다
- 울산에서 관련 정보를 빠르게 찾고 싶은 분
- 신청 조건이나 이용 방법이 헷갈리는 분
- 방문 전 핵심만 먼저 확인하고 싶은 분

## 준비할 것
- 본인 확인 정보
- 운영 시간 및 장소 확인
- 공식 안내 페이지 재확인

## 이용 방법
1. 공식 안내를 먼저 확인합니다.
2. 대상 조건을 점검합니다.
3. 필요한 준비물을 챙깁니다.
4. 온라인 또는 현장 이용을 진행합니다.

## 놓치기 쉬운 포인트
- 운영 기준은 시기별로 달라질 수 있습니다.
- 최신 공지 여부를 반드시 다시 확인하는 것이 좋습니다.

## 마무리
이 글은 울산 시민이 실제로 자주 찾는 내용을 기준으로 정리했습니다. 세부 기준은 관련 기관의 최신 공지를 함께 확인하세요.
"""

created = 0
for group, category, title, summary in picked:
    num = next_num
    next_num += 1
    slug = slugify(title)
    filename = f"{today}-{group}-{num:02d}-{slug}.md"
    path = POSTS_DIR / filename
    while path.exists():
        num = next_num
        next_num += 1
        filename = f"{today}-{group}-{num:02d}-{slug}-{num}.md"
        path = POSTS_DIR / filename

    path.write_text(
        template.format(
            title=title,
            pubDate=today,
            summary=summary,
            category=category,
            image_block=build_image_block(title, group, category, filename),
        ),
        encoding="utf-8",
    )
    print(f"created: {path}")
    created += 1

print(f"총 생성: {created}개")
