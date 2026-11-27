"""Split the dataset into train, validation and test by object.

Usage:  python split.py [data_folder]

Writes <data>/split.csv. Files already listed there never move, so the test set stays frozen.
"""

import csv
import random
import sys
from pathlib import Path

from manifest import read_manifest

SHARES = {"train": 0.70, "val": 0.15, "test": 0.15}
SEED = 2026


def assign_splits(rows: list[dict], previous: dict[str, str]) -> dict[str, str]:
    result: dict[str, str] = {}
    for craft in sorted({r["class"] for r in rows}):
        objects: dict[str, list[str]] = {}
        for row in rows:
            if row["class"] == craft:
                objects.setdefault(row["object_id"], []).append(row["file"])

        counts = dict.fromkeys(SHARES, 0)
        new = []
        for object_id in sorted(objects):
            files = objects[object_id]
            old = next((previous[f] for f in sorted(files) if f in previous), None)
            if old:
                counts[old] += len(files)
                result.update(dict.fromkeys(files, old))
            else:
                new.append(files)

        random.Random(f"{SEED}-{craft}").shuffle(new)
        new.sort(key=len, reverse=True)  # place large groups while there is room (stable sort)
        total = sum(len(f) for f in objects.values())
        for files in new:
            # Give the object to whichever split is furthest below its share.
            name = max(SHARES, key=lambda s: SHARES[s] * total - counts[s])
            counts[name] += len(files)
            result.update(dict.fromkeys(files, name))
    return result


def read_split(root: Path) -> dict[str, str]:
    path = Path(root) / "split.csv"
    if not path.exists():
        return {}
    with path.open(newline="", encoding="utf-8") as handle:
        return {row["file"]: row["split"] for row in csv.DictReader(handle)}


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "data")
    rows = [r for r in read_manifest(root) if (root / r["file"]).is_file()]
    if not rows:
        print("The manifest is empty. Run manifest.py or collect.py first.")
        return 1
    result = assign_splits(rows, read_split(root))
    with (root / "split.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(("file", "split"))
        writer.writerows(sorted(result.items()))
    for name in SHARES:
        print(f"{name:<6}{sum(1 for v in result.values() if v == name):>6}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
