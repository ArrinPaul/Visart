import io

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app import MAX_BYTES, app

client = TestClient(app)


@pytest.fixture(autouse=True)
def secret(monkeypatch):
    monkeypatch.setenv("ML_SERVICE_SECRET", "s3cret")


def png(array):
    out = io.BytesIO()
    Image.fromarray(array.astype(np.uint8)).save(out, "PNG")
    return out.getvalue()


def noise(low=0, high=256, size=800):
    return png(np.random.default_rng(0).integers(low, high, (size, size)))


def analyze(data, key="s3cret"):
    headers = {"x-ml-secret": key} if key else {}
    return client.post("/analyze", headers=headers, files={"file": ("p.png", data, "image/png")})


def tips(data):
    return " ".join(analyze(data).json()["quality"]["tips"]).lower()


def test_rejects_missing_or_wrong_secret():
    assert analyze(noise(), key=None).status_code == 401
    assert analyze(noise(), key="nope").status_code == 401


def test_refuses_everything_when_secret_unset(monkeypatch):
    monkeypatch.delenv("ML_SERVICE_SECRET")
    assert analyze(noise()).status_code == 503


def test_rejects_non_images_and_oversize():
    assert analyze(b"not an image").status_code == 400
    assert analyze(b"0" * (MAX_BYTES + 1)).status_code == 413


def test_good_photo_scores_full_marks_and_models_are_absent():
    body = analyze(noise()).json()
    assert body["quality"] == {"score": 100, "tips": []}
    assert body["classification"] is None
    assert body["embedding"] is None
    assert body["model_version"]


def test_dark_photo():
    assert "dark" in tips(noise(0, 40))


def test_blurred_photo():
    gradient = np.tile(np.linspace(0, 255, 800), (800, 1))
    assert "blur" in tips(png(gradient))


def test_small_photo():
    assert "small" in tips(noise(size=200))
