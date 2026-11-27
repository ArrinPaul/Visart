"""Move downloaded photos that are clearly not a craft object into <data>/rejected/.

Usage:  python clean.py [data_folder]

Only downloaded files are checked (never our own photos). It rejects obvious non-objects, such as
people or buildings. It does not check whether a photo has the right class.
"""

import sys
from pathlib import Path

from PIL import Image

from embedder import Embedder
from manifest import read_manifest, write_manifest

WANTED = [
    "a photo of a pottery or ceramic object", "a photo of a wooden object or wood carving",
    "a photo of a textile, fabric or saree", "a photo of a metal object such as brass or copper",
    "a photo of a bamboo, cane or wicker object",
]
JUNK = [
    "a photo of a person or a group of people", "a photo of a building or a room", "a landscape or street scene",
    "a scanned document, text page, map or diagram", "a painting, drawing or print on paper",
    "a photo of an animal", "a photo of living plants or a forest", "a photo of food", "a photo of a vehicle",
]
REJECT_ABOVE = 0.6
DOWNLOADED = ("wc-", "cma-", "met-", "ov-")


def main(argv):
    root = Path(argv[1] if len(argv) > 1 else "data")
    rows = read_manifest(root)
    targets = [r for r in rows if r["object_id"].startswith(DOWNLOADED) and (root / r["file"]).is_file()]
    embedder = Embedder()
    text = embedder.embed_text(WANTED + JUNK)

    rejected = set()
    for start in range(0, len(targets), 64):
        chunk = targets[start:start + 64]
        images = [Image.open(root / r["file"]).convert("RGB") for r in chunk]
        junk = (100 * embedder.embed(images) @ text.T).softmax(1)[:, len(WANTED):].sum(1)
        for row, score in zip(chunk, junk.tolist()):
            if score > REJECT_ABOVE:
                rejected.add(row["file"])
        print(f"checked {start + len(chunk)}/{len(targets)}", flush=True)

    for file in rejected:
        target = root / "rejected" / file.removeprefix("images/")
        target.parent.mkdir(parents=True, exist_ok=True)
        (root / file).replace(target)
    write_manifest(root, [r for r in rows if r["file"] not in rejected])
    print(f"rejected {len(rejected)} of {len(targets)} downloaded photos")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
