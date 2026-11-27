"""Stateless inference service: image in, scores out. It never touches the database."""

import hmac
import io
import logging
import os
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from quality import assess

MAX_BYTES = 8 * 1024 * 1024
MAX_PIXELS = 40_000_000
MODEL_VERSION = "quality-rules-1"
DEFAULT_MODEL = Path(__file__).parent / "models" / "classifier.pt"
log = logging.getLogger("visart.ml")

app = FastAPI(title="VISART ML service")


@lru_cache(maxsize=2)
def load_classifier(path: str):
    from classifier import Classifier  # imported late so the quality checks need no PyTorch

    return Classifier.load(path)


@lru_cache(maxsize=1)
def load_embedder():
    from embedder import Embedder

    return Embedder()


def classify(image):
    """(classification, version), or (None, None) when no usable model is present."""
    path = os.environ.get("ML_MODEL_PATH") or str(DEFAULT_MODEL)
    if not Path(path).is_file():
        return None, None
    try:
        model = load_classifier(path)
        return model.predict(image), model.version
    except Exception:
        log.exception("classifier failed")
        return None, None


def embed(image):
    if os.environ.get("ML_EMBEDDINGS", "on") == "off":
        return None
    try:
        return load_embedder().embed([image])[0].tolist()
    except Exception:
        log.exception("embedding failed")
        return None


@app.get("/health")
def health():
    return {"status": "ok", "model_version": MODEL_VERSION}


@app.post("/analyze")
def analyze(file: UploadFile = File(...), x_ml_secret: str = Header(default="")):
    secret = os.environ.get("ML_SERVICE_SECRET", "")
    if not secret:
        raise HTTPException(503, "ML_SERVICE_SECRET is not configured.")
    if not hmac.compare_digest(x_ml_secret.encode(), secret.encode()):
        raise HTTPException(401, "Unauthorized.")

    data = file.file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Image is too large.")
    try:
        image = Image.open(io.BytesIO(data))
        if image.format not in ("JPEG", "PNG", "WEBP"):
            raise HTTPException(400, "Unsupported image type.")
        if image.width * image.height > MAX_PIXELS:
            raise HTTPException(413, "Image has too many pixels.")
        image.load()
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(400, "Not a readable image.")

    image = image.convert("RGB")
    classification, version = classify(image)
    return {
        "model_version": f"{MODEL_VERSION}+{version}" if version else MODEL_VERSION,
        "quality": assess(image),
        # null means "not checked".
        "classification": classification,
        "embedding": embed(image),
    }
