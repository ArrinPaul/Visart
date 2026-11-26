"""Stateless inference service: image in, scores out. It never touches the database."""

import hmac
import io
import os

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from quality import assess

MAX_BYTES = 8 * 1024 * 1024
MAX_PIXELS = 40_000_000
MODEL_VERSION = "quality-rules-1"

app = FastAPI(title="VISART ML service")


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

    return {
        "model_version": MODEL_VERSION,
        "quality": assess(image),
        # Filled in once the classifier and embedding models exist; null means "not checked".
        "classification": None,
        "embedding": None,
    }
