"""Rule-based photo quality checks. Thresholds are starting points; tune them on real product photos."""

import numpy as np
from PIL import Image

MIN_SIDE = 600
BLUR_BELOW = 60.0
DARK_BELOW = 60.0
BRIGHT_ABOVE = 220.0
FLAT_BELOW = 25.0
PENALTY = 25


def assess(image: Image.Image) -> dict:
    small = min(image.size) < MIN_SIDE
    gray = image.convert("L")
    gray.thumbnail((512, 512))  # makes the sharpness number comparable across resolutions
    p = np.asarray(gray, dtype=np.float32)

    # Variance of the Laplacian: low when there are few sharp edges.
    laplacian = p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:] - 4 * p[1:-1, 1:-1]

    tips = []
    if laplacian.size == 0 or laplacian.var() < BLUR_BELOW:
        tips.append("The photo looks blurry. Hold the phone steady and tap the item to focus.")
    if p.mean() < DARK_BELOW:
        tips.append("The photo is too dark. Move closer to a window or into daylight.")
    elif p.mean() > BRIGHT_ABOVE:
        tips.append("The photo is too bright. Avoid direct sunlight and flash.")
    if p.std() < FLAT_BELOW:
        tips.append("The item does not stand out. Use a plain background of a different colour.")
    if small:
        tips.append("The photo is small. Use your camera's full resolution.")

    return {"score": max(0, 100 - PENALTY * len(tips)), "tips": tips}
