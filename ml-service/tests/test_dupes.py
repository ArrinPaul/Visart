import csv

import numpy as np
from PIL import Image

from dupes import EDITS, make_copies


def photo(root, name, seed):
    path = root / "images" / "wood" / name / "a.jpg"
    path.parent.mkdir(parents=True)
    pixels = np.random.default_rng(seed).integers(0, 256, (400, 600, 3), dtype=np.uint8)
    Image.fromarray(pixels).save(path)
    return path.relative_to(root).as_posix()


def test_every_photo_gets_one_copy_per_edit(tmp_path):
    files = [photo(tmp_path, "x-1", 1), photo(tmp_path, "x-2", 2)]
    assert make_copies(tmp_path, files) == len(files) * len(EDITS)
    with (tmp_path / "duplicates" / "pairs.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    assert {(r["original"], r["edit"]) for r in rows} == {(f, e) for f in files for e in EDITS}
    assert all((tmp_path / r["copy"]).is_file() for r in rows)


def test_copies_are_really_changed(tmp_path):
    original = photo(tmp_path, "x-1", 3)
    make_copies(tmp_path, [original])
    folder = tmp_path / "duplicates" / "x-1"
    assert Image.open(folder / "a_crop.jpg").size == (480, 320)
    assert Image.open(folder / "a_resize.jpg").size == (300, 200)
    before = np.asarray(Image.open(tmp_path / original), dtype=float).mean()
    assert np.asarray(Image.open(folder / "a_brighter.jpg"), dtype=float).mean() > before + 10
