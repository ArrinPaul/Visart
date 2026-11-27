"""Craft type classifier: model building, saving, loading, prediction and scoring."""

import numpy as np
import torch
from PIL import Image
from torchvision import models
from torchvision.transforms import v2

from manifest import CLASSES

ARCHITECTURES = {
    "mobilenet_v3_large": (models.mobilenet_v3_large, models.MobileNet_V3_Large_Weights.IMAGENET1K_V2),
    "efficientnet_b0": (models.efficientnet_b0, models.EfficientNet_B0_Weights.IMAGENET1K_V1),
}
NORMALIZE = v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
PREPARE = v2.Compose([
    v2.ToImage(), v2.Resize(256, antialias=True), v2.CenterCrop(224),
    v2.ToDtype(torch.float32, scale=True), NORMALIZE,
])


def build(arch: str, pretrained: bool = True) -> torch.nn.Module:
    factory, weights = ARCHITECTURES[arch]
    model = factory(weights=weights if pretrained else None)
    last = model.classifier[-1]
    model.classifier[-1] = torch.nn.Linear(last.in_features, len(CLASSES))
    return model


def save(path, model, arch: str, threshold: float, version: str) -> None:
    torch.save({"state": model.state_dict(), "arch": arch, "classes": list(CLASSES),
                "threshold": float(threshold), "version": version}, path)


class Classifier:
    def __init__(self, model, classes, threshold, version):
        self.model, self.classes, self.threshold, self.version = model.eval(), classes, threshold, version

    @classmethod
    def load(cls, path):
        data = torch.load(path, map_location="cpu", weights_only=True)  # never unpickle arbitrary code
        model = build(data["arch"], pretrained=False)
        model.load_state_dict(data["state"])
        return cls(model, data["classes"], data["threshold"], data["version"])

    @torch.inference_mode()
    def predict(self, image: Image.Image) -> dict:
        probabilities = self.model(PREPARE(image.convert("RGB")).unsqueeze(0)).softmax(1)[0]
        confidence, index = probabilities.max(0)
        label = self.classes[int(index)] if float(confidence) >= self.threshold else "uncertain"
        return {"label": label, "confidence": round(float(confidence), 4)}


def pick_threshold(confidence: np.ndarray, correct: np.ndarray, target: float = 0.9, floor: float = 0.5) -> float:
    """Lowest confidence at which accepted predictions reach the target precision."""
    for value in np.unique(np.concatenate([[floor], confidence[confidence >= floor]])):
        accepted = confidence >= value
        if accepted.any() and correct[accepted].mean() >= target:
            return round(float(value), 4)
    return 0.95


def scores(confusion, classes) -> dict:
    """Rows are true classes, columns are predictions."""
    matrix = np.asarray(confusion, dtype=float)
    per_class, f1_values = {}, []
    for i, name in enumerate(classes):
        hit = matrix[i, i]
        precision = hit / matrix[:, i].sum() if matrix[:, i].sum() else 0.0
        recall = hit / matrix[i].sum() if matrix[i].sum() else 0.0
        f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
        f1_values.append(f1)
        per_class[name] = {"precision": round(float(precision), 3), "recall": round(float(recall), 3),
                           "f1": round(float(f1), 3), "support": int(matrix[i].sum())}
    return {"per_class": per_class, "macro_f1": round(float(np.mean(f1_values)), 3),
            "accuracy": round(float(np.trace(matrix) / matrix.sum()), 3) if matrix.sum() else 0.0}
