import numpy as np
from PIL import Image

from manifest import check, read_manifest


def photo(root, craft, obj, name, seed=0, size=700):
    folder = root / "images" / craft / obj
    folder.mkdir(parents=True, exist_ok=True)
    pixels = np.random.default_rng(seed).integers(0, 256, (size, size), dtype=np.uint8)
    Image.fromarray(pixels).save(folder / name)


def problems(root):
    return " | ".join(check(root)["problems"])


def fill_sources(root):
    path = root / "manifest.csv"
    text = path.read_text(encoding="utf-8").replace(",,,\n", ",own photo,team consent,\n")
    path.write_text(text, encoding="utf-8")


def test_new_photos_are_added_and_counted(tmp_path):
    photo(tmp_path, "pottery", "ap-001", "a.png", seed=1)
    photo(tmp_path, "pottery", "ap-001", "b.png", seed=2)
    report = check(tmp_path)
    assert report["counts"]["pottery"] == {"images": 2, "objects": 1}
    assert report["counts"]["wood"] == {"images": 0, "objects": 0}
    assert [row["file"] for row in read_manifest(tmp_path)] == [
        "images/pottery/ap-001/a.png", "images/pottery/ap-001/b.png"]


def test_missing_source_and_licence_are_reported_until_filled(tmp_path):
    photo(tmp_path, "wood", "ap-002", "a.png")
    assert "no source or licence" in problems(tmp_path)
    fill_sources(tmp_path)
    assert check(tmp_path)["problems"] == []


def test_filled_values_survive_another_run(tmp_path):
    photo(tmp_path, "wood", "ap-002", "a.png", seed=1)
    check(tmp_path)
    fill_sources(tmp_path)
    photo(tmp_path, "wood", "ap-003", "a.png", seed=2)
    check(tmp_path)
    assert read_manifest(tmp_path)[0]["source"] == "own photo"


def test_reports_bad_data(tmp_path):
    photo(tmp_path, "pottery", "x-1", "a.png", seed=5)
    photo(tmp_path, "wood", "x-1", "copy.png", seed=5)
    photo(tmp_path, "plastic", "x-2", "a.png", seed=6)
    photo(tmp_path, "metal", "x-3", "tiny.png", seed=7, size=100)
    (tmp_path / "images" / "metal" / "x-3" / "broken.jpg").write_bytes(b"nope")
    found = problems(tmp_path)
    assert "same image" in found
    assert "object x-1 is in more than one class" in found
    assert "unknown class" in found
    assert "too small" in found
    assert "cannot be read" in found


def test_reports_rows_whose_file_is_gone(tmp_path):
    photo(tmp_path, "bamboo", "x-9", "a.png")
    check(tmp_path)
    (tmp_path / "images" / "bamboo" / "x-9" / "a.png").unlink()
    assert "file is missing" in problems(tmp_path)
