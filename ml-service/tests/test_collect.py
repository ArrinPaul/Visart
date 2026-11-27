import io
import urllib.error

import pytest

import collect
from collect import allowed_licence, commons_record, object_id_for, openverse_record


def page(licence="CC BY-SA 4.0", title="File:Clay pot 3.jpg", width=2000, height=1500, mime="image/jpeg"):
    return {
        "title": title,
        "pageid": 7,
        "imageinfo": [{
            "mime": mime, "width": width, "height": height, "user": "Asha",
            "thumburl": "https://upload.wikimedia.org/t.jpg",
            "descriptionurl": "https://commons.wikimedia.org/wiki/File:Clay_pot_3.jpg",
            "extmetadata": {"LicenseShortName": {"value": licence},
                            "Artist": {"value": '<a href="x">Asha R</a>'}},
        }],
    }


def test_only_open_licences_are_allowed():
    for name in ("CC0", "Public domain", "CC BY 2.0", "CC BY-SA 4.0"):
        assert allowed_licence(name), name
    for name in ("", "CC BY-NC 4.0", "CC BY-ND 2.0", "Fair use", "GFDL"):
        assert not allowed_licence(name), name


def test_commons_record_keeps_attribution():
    record = commons_record(page())
    assert record["licence"] == "CC BY-SA 4.0"
    assert record["author"] == "Asha R"
    assert record["source"].startswith("https://commons.wikimedia.org/")
    assert record["url"] == "https://upload.wikimedia.org/t.jpg"


def test_commons_record_rejects_unusable_files():
    assert commons_record(page(licence="CC BY-NC 4.0")) is None
    assert commons_record(page(width=200)) is None
    assert commons_record(page(mime="image/svg+xml")) is None


def test_a_numbered_series_by_one_uploader_is_one_object():
    a = object_id_for("Asha", "File:Clay pot 1.jpg")
    assert a == object_id_for("Asha", "File:Clay pot (2).jpg")
    assert a != object_id_for("Ravi", "File:Clay pot 1.jpg")
    assert a != object_id_for("Asha", "File:Brass lamp 1.jpg")
    assert a.startswith("wc-")


def test_openverse_record_formats_the_licence_and_credit():
    record = openverse_record({"id": "abc", "url": "https://live.staticflickr.com/1.jpg", "license": "by-sa",
                               "license_version": "2.0", "creator": "Meena", "foreign_landing_url": "https://flickr.com/p/1",
                               "title": "Cane basket 2", "width": 1000, "height": 800, "source": "flickr"})
    assert record["licence"] == "CC BY-SA 2.0"
    assert allowed_licence(record["licence"])
    assert record["author"] == "Meena" and record["object_id"].startswith("ov-")


def test_openverse_record_rejects_other_licences_and_small_files():
    base = {"id": "a", "url": "u", "license": "by-nc", "license_version": "2.0", "width": 900, "height": 900}
    assert openverse_record(base) is None
    assert openverse_record({**base, "license": "cc0", "width": 100}) is None


def test_a_short_pause_is_waited_out(monkeypatch):
    calls, naps = [], []

    def urlopen(request, timeout):
        calls.append(1)
        if len(calls) < 3:
            raise urllib.error.HTTPError(request.full_url, 429, "slow down", {"Retry-After": "1"}, None)
        return io.BytesIO(b"ok")

    monkeypatch.setattr(collect.urllib.request, "urlopen", urlopen)
    monkeypatch.setattr(collect.time, "sleep", naps.append)
    assert collect.fetch("https://example.org/a", tries=4) == b"ok"
    assert naps == [5, 10]


def test_a_long_pause_stops_the_source(monkeypatch):
    def urlopen(request, timeout):
        raise urllib.error.HTTPError(request.full_url, 429, "stop", {"Retry-After": "600"}, None)

    monkeypatch.setattr(collect.urllib.request, "urlopen", urlopen)
    with pytest.raises(collect.RateLimited):
        collect.fetch("https://example.org/a")
