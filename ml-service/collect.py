"""Download openly licensed craft photos with their source, licence and author.

Usage:  python collect.py [data_folder]

Sources: Cleveland Museum of Art (CC0), The Met (CC0), Openverse and Wikimedia Commons (CC0,
public domain, CC BY, CC BY-SA). A source that asks for a long pause is left alone for this run. Safe to run again: files already listed in the manifest are not downloaded twice.
"""

import hashlib
import io
import itertools
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

from manifest import CLASSES, MIN_SIDE, read_manifest, write_manifest

AGENT = {"User-Agent": "visart-student-dataset/0.1 (educational image classification)"}
PER_CLASS = {"commons": 320, "cleveland": 0, "met": 0, "openverse": 0}  # 0: slow, gone or refusing (see DATA.md)
PREFIX = {"commons": "wc-", "cleveland": "cma-", "met": "met-", "openverse": "ov-"}
PAUSE = {"commons": 1.5, "openverse": 0.7, "cleveland": 0.2, "met": 0.2}
MAX_BYTES = 15 * 1024 * 1024
WORKERS = {"commons": 1, "cleveland": 4, "met": 3, "openverse": 4}  # Wikimedia: one at a time

COMMONS_QUERIES = {
    "pottery": ["terracotta pot", "clay pot handmade", "pottery India", "ceramic vase", "terracotta lamp", "earthenware jug"],
    "wood": ["wooden toy", "wood carving object", "carved wooden box", "wooden spoon handmade", "Channapatna toys", "wooden bowl"],
    "textile": ["saree fabric", "handwoven textile", "embroidered cloth", "woven shawl", "ikat fabric", "block printed fabric"],
    "metal": ["brass lamp", "brass vessel", "copper pot", "bronze figurine", "Bidriware", "brass handicraft"],
    "bamboo": ["bamboo basket", "cane basket", "bamboo handicraft", "wicker basket", "rattan basket", "bamboo craft product"],
}
CLEVELAND_TYPES = {"pottery": ("Ceramic", ""), "wood": ("", "wood"), "textile": ("Textile", ""),
                   "metal": ("Metalwork", ""), "bamboo": ("", "bamboo basket")}
MET_QUERIES = {"pottery": "terracotta vessel", "wood": "wood box", "textile": "textile fragment cotton",
               "metal": "brass vessel", "bamboo": "bamboo basket"}


def allowed_licence(name: str) -> bool:
    return bool(re.fullmatch(r"(?i)(cc0.*|public domain|cc by(-sa)? \d\.\d.*|pd.*)", name.strip()))


class RateLimited(Exception):
    """The site asked us to wait too long; stop using it."""


def object_id_for(uploader: str, title: str, prefix: str = "wc-") -> str:
    """Files in a numbered series from one uploader are treated as the same object."""
    stem = re.sub(r"\.\w+$", "", title.removeprefix("File:"))
    stem = re.sub(r"[\d()\[\]_\-.,#]+", " ", stem).lower().split()
    key = uploader + "|" + " ".join(stem)
    return prefix + hashlib.sha1(key.encode()).hexdigest()[:10]


def commons_record(page: dict) -> dict | None:
    info = (page.get("imageinfo") or [{}])[0]
    meta = info.get("extmetadata", {})
    licence = meta.get("LicenseShortName", {}).get("value", "")
    if info.get("mime") not in ("image/jpeg", "image/png") or not info.get("thumburl"):
        return None
    if min(info.get("width", 0), info.get("height", 0)) < 400 or not allowed_licence(licence):
        return None
    author = re.sub(r"<[^>]+>", "", meta.get("Artist", {}).get("value", "")).strip()
    return {
        "url": info["thumburl"],
        "source": info.get("descriptionurl", ""),
        "licence": licence,
        "author": " ".join((author or info.get("user", "")).split())[:120],
        "object_id": object_id_for(info.get("user", ""), page["title"]),
        "name": f"wc-{page['pageid']}",
    }


def openverse_record(item: dict) -> dict | None:
    kind = item.get("license", "")
    version = item.get("license_version") or ""
    licence = {"cc0": "CC0", "pdm": "Public domain"}.get(kind, f"CC {kind.upper()} {version}")
    if not allowed_licence(licence) or min(item.get("width") or 0, item.get("height") or 0) < 400:
        return None
    author = " ".join((item.get("creator") or item.get("source") or "").split())[:120]
    return {
        "url": item["url"],
        "source": item.get("foreign_landing_url", ""),
        "licence": licence,
        "author": author,
        "object_id": object_id_for(author, item.get("title") or item["id"], "ov-"),
        "name": f"ov-{item['id']}",
    }


def fetch(url: str, tries: int = 4, timeout: int = 40) -> bytes:
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=AGENT), timeout=timeout) as response:
                return response.read(MAX_BYTES + 1)
        except urllib.error.HTTPError as error:
            wait = int(error.headers.get("Retry-After") or 0)
            if error.code == 429 and (wait > 30 or attempt == tries - 1):
                raise RateLimited(f"{urllib.parse.urlsplit(url).netloc} asked to wait {wait}s") from error
            if error.code not in (429, 500, 502, 503) or attempt == tries - 1:
                raise
            time.sleep(max(wait, 5 * (attempt + 1)))  # never sooner than asked
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            if attempt == tries - 1:
                raise
            time.sleep(3 * (attempt + 1))
    return b""


def get_json(url: str, params: dict) -> dict:
    return json.loads(fetch(url + "?" + urllib.parse.urlencode(params)))


def commons(craft: str):
    per_query = PER_CLASS["commons"] // len(COMMONS_QUERIES[craft]) + 15
    for query in COMMONS_QUERIES[craft]:
        offset, yielded = 0, 0
        while yielded < per_query and offset < 400:
            data = get_json("https://commons.wikimedia.org/w/api.php", {
                "action": "query", "format": "json", "generator": "search", "gsrnamespace": 6,
                "gsrsearch": f"{query} filetype:bitmap", "gsrlimit": 50, "gsroffset": offset,
                "prop": "imageinfo", "iiprop": "url|mime|size|user|extmetadata", "iiurlwidth": 500,  # a standard Wikimedia thumbnail size
            })
            pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0))
            for page in pages:
                record = commons_record(page)
                if record and yielded < per_query:
                    yielded += 1
                    yield record
            offset = data.get("continue", {}).get("gsroffset")
            if offset is None:
                break


def cleveland(craft: str):
    kind, query = CLEVELAND_TYPES[craft]
    params = {"cc0": 1, "has_image": 1, "limit": PER_CLASS["cleveland"] + 20}
    if kind:
        params["type"] = kind
    if query:
        params["q"] = query
    for item in get_json("https://openaccess-api.clevelandart.org/api/artworks/", params).get("data", []):
        url = ((item.get("images") or {}).get("web") or {}).get("url")
        if url:
            yield {"url": url, "source": item.get("url", ""), "licence": "CC0", "author": "Cleveland Museum of Art",
                   "object_id": f"cma-{item['id']}", "name": f"cma-{item['id']}"}


def met(craft: str):
    base = "https://collectionapi.metmuseum.org/public/collection/v1"
    ids = get_json(f"{base}/search", {"hasImages": "true", "q": MET_QUERIES[craft]}).get("objectIDs") or []
    for object_id in ids[: PER_CLASS["met"] * 2]:
        try:
            item = json.loads(fetch(f"{base}/objects/{object_id}"))
        except (urllib.error.URLError, ValueError):
            continue
        time.sleep(0.1)
        if item.get("isPublicDomain") and item.get("primaryImageSmall"):
            yield {"url": item["primaryImageSmall"], "source": item.get("objectURL", ""), "licence": "CC0",
                   "author": "The Metropolitan Museum of Art", "object_id": f"met-{object_id}", "name": f"met-{object_id}"}


def openverse(craft: str):
    for query in COMMONS_QUERIES[craft]:
        for page in range(1, 6):
            data = get_json("https://api.openverse.org/v1/images/", {
                "q": query, "license": "cc0,pdm,by,by-sa", "category": "photograph", "mature": "false",
                "excluded_source": "wikimedia", "page_size": 20, "page": page,
            })
            time.sleep(1)
            for item in data.get("results", []):
                record = openverse_record(item)
                if record:
                    yield record
            if page >= data.get("page_count", 0):
                break


def save(root: Path, craft: str, record: dict) -> dict | None:
    data = fetch(record["url"], tries=4, timeout=15)  # skip slow files; there are plenty
    if len(data) > MAX_BYTES:
        return None
    with Image.open(io.BytesIO(data)) as image:
        image = image.convert("RGB")
        image.thumbnail((640, 640))
        if min(image.size) < MIN_SIDE:
            return None
        relative = f"images/{craft}/{record['object_id']}/{record['name']}.jpg"
        (root / relative).parent.mkdir(parents=True, exist_ok=True)
        image.save(root / relative, "JPEG", quality=90)  # re-encoding drops any metadata or payload
    return {"file": relative, "class": craft, "object_id": record["object_id"],
            "source": record["source"], "licence": record["licence"], "author": record["author"]}


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else "data")
    root.mkdir(parents=True, exist_ok=True)
    rows = {row["file"]: row for row in read_manifest(root)}
    seen = {row["source"] for row in rows.values()}
    blocked = set()

    for craft in CLASSES:
        for source in (s for s in (cleveland, met, openverse, commons) if PER_CLASS[s.__name__]):
            if source.__name__ in blocked:
                continue
            limit = PER_CLASS[source.__name__]
            prefix = "/" + PREFIX[source.__name__]
            got = sum(1 for r in rows.values() if r["class"] == craft and prefix in r["file"].rsplit(r["object_id"], 1)[-1])
            failed = 0

            def attempt(record):
                try:
                    return record, save(root, craft, record), None
                except (OSError, ValueError, Image.DecompressionBombError) as error:  # includes URLError
                    return record, None, error
                finally:
                    time.sleep(PAUSE[source.__name__])

            try:
                records = (r for r in source(craft) if r["source"] not in seen)
                with ThreadPoolExecutor(WORKERS[source.__name__]) as pool:
                    while got < limit:
                        batch = list(itertools.islice(records, min(WORKERS[source.__name__] * 3, limit - got)))
                        if not batch:
                            break
                        for record, row, error in pool.map(attempt, batch):
                            if error:
                                failed += 1
                                continue
                            seen.add(record["source"])
                            if row:
                                rows[row["file"]] = row
                                got += 1
                        write_manifest(root, [rows[key] for key in sorted(rows)])
                        print(f"  {craft:<8} {source.__name__:<9} {got:>4}/{limit}", flush=True)
            except RateLimited as error:
                blocked.add(source.__name__)
                print(f"{craft}/{source.__name__}: {error}; skipping this source", flush=True)
            except (urllib.error.URLError, ValueError, TimeoutError, ConnectionError) as error:
                print(f"{craft}/{source.__name__}: stopped early: {error}", flush=True)
            write_manifest(root, [rows[key] for key in sorted(rows)])
            print(f"{craft:<8} {source.__name__:<9} {got:>4} images ({failed} failed)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
