"""Make edited copies of test photos, for measuring the duplicate detector.

Usage:  python dupes.py [data_folder]

Copies every photo in the test split into <data>/duplicates/ and lists the pairs in pairs.csv.
"""

import csv
import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

from split import read_split

# name -> (edit, JPEG quality). These are the ways a copied photo is typically altered.
EDITS = {
    "crop": (lambda im: ImageOps.crop(im, (im.width // 10, im.height // 10)), 90),
    "resize": (lambda im: im.resize((im.width // 2, im.height // 2)), 90),
    "brighter": (lambda im: ImageEnhance.Brightness(im).enhance(1.35), 90),
    "grey": (lambda im: ImageOps.grayscale(im).convert("RGB"), 90),
    "compressed": (lambda im: im, 25),
}


def make_copies(root: Path, files: list[str]) -> int:
    root = Path(root)
    rows = []
    for file in files:
        source = Path(file)
        folder = root / "duplicates" / source.parent.name
        folder.mkdir(parents=True, exist_ok=True)
        with Image.open(root / source) as image:
            image = image.convert("RGB")
            for name, (edit, quality) in EDITS.items():
                target = folder / f"{source.stem}_{name}.jpg"
                edit(image).save(target, "JPEG", quality=quality)
                rows.append((file, target.relative_to(root).as_posix(), name))

    (root / "duplicates").mkdir(parents=True, exist_ok=True)
    with (root / "duplicates" / "pairs.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(("original", "copy", "edit"))
        writer.writerows(rows)
    return len(rows)


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "data")
    files = [f for f, name in read_split(root).items() if name == "test" and (root / f).is_file()]
    if not files:
        print("No test photos found. Run split.py first.")
        return 1
    print(f"made {make_copies(root, files)} copies of {len(files)} photos")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
