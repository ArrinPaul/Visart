import io

import numpy as np
import pytest
import torch
from fastapi.testclient import TestClient
from PIL import Image

import app as app_module
from app import MAX_BYTES, app
from classifier import build, save
from manifest import CLASSES

client = TestClient(app)


@pytest.fixture(autouse=True)
def secret(monkeypatch):
    monkeypatch.setenv("ML_SERVICE_SECRET", "s3cret")
    monkeypatch.setenv("ML_MODEL_PATH", "does-not-exist.pt")
    monkeypatch.setenv("ML_EMBEDDINGS", "off")


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


def test_classification_comes_from_the_model_file(monkeypatch, tmp_path):
    save(tmp_path / "m.pt", build("mobilenet_v3_large", pretrained=False), "mobilenet_v3_large", 0.0, "test-7")
    monkeypatch.setenv("ML_MODEL_PATH", str(tmp_path / "m.pt"))
    body = analyze(noise()).json()
    assert body["classification"]["label"] in CLASSES
    assert "test-7" in body["model_version"]


def test_embedding_is_included_when_enabled(monkeypatch):
    class Fake:
        def embed(self, images):
            return torch.ones(len(images), 512)

    monkeypatch.setenv("ML_EMBEDDINGS", "on")
    monkeypatch.setattr(app_module, "load_embedder", lambda: Fake())
    assert analyze(noise()).json()["embedding"] == [1.0] * 512


def test_a_broken_model_file_does_not_break_quality_checks(monkeypatch, tmp_path):
    (tmp_path / "bad.pt").write_bytes(b"junk")
    monkeypatch.setenv("ML_MODEL_PATH", str(tmp_path / "bad.pt"))
    body = analyze(noise()).json()
    assert body["classification"] is None and body["quality"]["score"] == 100
