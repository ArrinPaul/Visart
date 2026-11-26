"""Build and check the dataset manifest.

Usage:  python manifest.py [data_folder]      (default: data)

Photos live in <data>/images/<class>/<object_id>/<file>. New photos are added to <data>/manifest.csv;
fill in the source and licence columns there. Exits with status 1 while there are problems.
"""

import csv
import hashlib
import sys
from pathlib import Path

from PIL import Image

CLASSES = ("pottery", "wood", "textile", "metal", "bamboo")
FIELDS = ("file", "class", "object_id", "source", "licence")
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MIN_SIDE = 224
TARGET_PER_CLASS = 300


def read_manifest(root: Path) -> list[dict]:
    path = Path(root) / "manifest.csv"
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def write_manifest(root: Path, rows: list[dict]) -> None:
    with (Path(root) / "manifest.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, FIELDS, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def check(root: Path) -> dict:
    root = Path(root)
    rows = {row["file"]: row for row in read_manifest(root)}
    on_disk = sorted(
        p.relative_to(root).as_posix()
        for p in (root / "images").rglob("*")
        if p.is_file() and p.suffix.lower() in EXTENSIONS
    )

    problems = []
    hashes: dict[str, str] = {}
    object_classes: dict[str, set] = {}
    counts = {name: {"images": 0, "objects": set()} for name in CLASSES}

    for file in on_disk:
        parts = file.split("/")
        if len(parts) != 4:
            problems.append(f"{file}: expected images/<class>/<object_id>/<file>")
            continue
        _, craft, object_id, _ = parts
        if craft not in CLASSES:
            problems.append(f"{file}: unknown class '{craft}'")
            continue

        row = rows.setdefault(file, {"file": file, "source": "", "licence": ""})
        row["class"], row["object_id"] = craft, object_id
        if not (row.get("source") or "").strip() or not (row.get("licence") or "").strip():
            problems.append(f"{file}: no source or licence")

        try:
            with Image.open(root / file) as image:
                image.load()
                if min(image.size) < MIN_SIDE:
                    problems.append(f"{file}: too small (under {MIN_SIDE} px)")
        except (OSError, ValueError):
            problems.append(f"{file}: cannot be read as an image")
            continue

        digest = hashlib.sha256((root / file).read_bytes()).hexdigest()
        if digest in hashes:
            problems.append(f"{file}: same image as {hashes[digest]}")
        hashes.setdefault(digest, file)

        object_classes.setdefault(object_id, set()).add(craft)
        counts[craft]["images"] += 1
        counts[craft]["objects"].add(object_id)

    for object_id, crafts in object_classes.items():
        if len(crafts) > 1:
            problems.append(f"object {object_id} is in more than one class: {', '.join(sorted(crafts))}")
    for file in sorted(set(rows) - set(on_disk)):
        problems.append(f"{file}: file is missing (delete its manifest row if intended)")

    if root.exists():
        write_manifest(root, [rows[file] for file in sorted(rows)])

    return {
        "counts": {name: {"images": c["images"], "objects": len(c["objects"])} for name, c in counts.items()},
        "problems": problems,
    }


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "data")
    if not (root / "images").is_dir():
        print(f"No photos yet. Put them in {root / 'images'}/<class>/<object_id>/")
        print("Classes: " + ", ".join(CLASSES))
        return 1

    report = check(root)
    total = 0
    print(f"{'class':<10}{'images':>8}{'objects':>9}  target {TARGET_PER_CLASS}")
    for name, count in report["counts"].items():
        total += count["images"]
        print(f"{name:<10}{count['images']:>8}{count['objects']:>9}")
    print(f"{'total':<10}{total:>8}")
    for problem in report["problems"][:50]:
        print("PROBLEM", problem)
    print(f"{len(report['problems'])} problem(s)")
    return 1 if report["problems"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
