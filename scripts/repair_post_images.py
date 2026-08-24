from pathlib import Path
import argparse
import re

POSTS_DIR = Path("src/content/posts")

IMAGE_POOLS = {
    "parking": [
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=1400",
        "https://upload.wikimedia.org/wikipedia/commons/3/3a/Ulsan_129.30972E_35.52012N.jpg",
    ],
    "pharmacy": [
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1400",
    ],
    "welfare": [
        "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400",
    ],
    "economy": [
        "https://upload.wikimedia.org/wikipedia/commons/e/eb/Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/de/Port_Terminal_Of_Ulsan.JPG",
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1400",
    ],
    "event": [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1400",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1400",
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
    ],
}

def group_from_name(name: str) -> str:
    match = re.match(r"^\d{4}-\d{2}-\d{2}-([a-z]+)-", name)
    return match.group(1) if match else "other"

def read_field(text: str, key: str) -> str:
    match = re.search(rf"^{key}:\s*(.*)$", text, flags=re.M)
    return match.group(1).strip().strip('"\'') if match else ""

def category_for_group(group: str, current: str) -> str:
    return {
        "life": "생활",
        "welfare": "복지",
        "economy": "경제",
        "event": "행사",
        "ulsan": "명소",
        "place": "명소",
    }.get(group, "명소" if "울산 아시나요" in current else current or "기타")

def topic_kind(title: str, group: str, category: str) -> str:
    if "주차" in title:
        return "parking"
    if "약국" in title or "병원" in title or "진료" in title:
        return "pharmacy"
    if category == "복지":
        return "welfare"
    if category == "경제":
        return "economy"
    if category == "행사":
        return "event"
    return "scenic"

def image_block(title: str, kind: str) -> str:
    images = IMAGE_POOLS.get(kind, IMAGE_POOLS["scenic"])
    return "\n".join(f"![{title} {i + 1}]({url})" for i, url in enumerate(images[:6]))

def repair_text(text: str, group: str) -> str:
    title = read_field(text, "title")
    category = category_for_group(group, read_field(text, "category"))
    kind = topic_kind(title, group, category)
    text = re.sub(r"^category:\s*.*$", f"category: {category}", text, flags=re.M)
    text = re.sub(r"^tags:\n(?:\s+- .*\n)+", f"tags:\n  - 울산\n  - {category}\n  - 자동생성\n", text, flags=re.M)
    frontmatter = re.match(r"^---\n[\s\S]*?\n---\n", text)
    start = frontmatter.end() if frontmatter else 0
    rest = re.sub(r"^(?:\s*!\[[^\]]*\]\([^)]+\)\s*)+", "", text[start:].lstrip()).lstrip()
    return text[:start].rstrip() + "\n\n" + image_block(title, kind) + "\n\n" + rest

def main() -> None:
    parser = argparse.ArgumentParser(description="Repair Ulsan365 image/category matching in existing posts.")
    parser.add_argument("--limit-per-group", type=int, default=3)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    changed = []
    for group in ["life", "welfare", "economy", "event", "ulsan", "place"]:
        paths = sorted([p for p in POSTS_DIR.glob("*.md") if group_from_name(p.name) == group], reverse=True)
        for path in paths[:args.limit_per_group]:
            old = path.read_text(encoding="utf-8")
            new = repair_text(old, group)
            if old != new:
                changed.append(path)
                if args.write:
                    path.write_text(new, encoding="utf-8")
    for path in changed:
        print(path)
    print(f"changed: {len(changed)}")

if __name__ == "__main__":
    main()
