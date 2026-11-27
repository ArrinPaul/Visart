import numpy as np
import torch
from PIL import Image

from classifier import Classifier, build, pick_threshold, save, scores
from manifest import CLASSES


def test_scores_from_a_confusion_matrix():
    result = scores([[8, 2], [0, 10]], ["a", "b"])
    assert result["per_class"]["a"] == {"precision": 1.0, "recall": 0.8, "f1": 0.889, "support": 10}
    assert result["accuracy"] == 0.9
    assert result["macro_f1"] == 0.899


def test_a_class_that_is_never_predicted_scores_zero():
    assert scores([[0, 3], [0, 3]], ["a", "b"])["per_class"]["a"]["f1"] == 0.0


def test_threshold_is_the_lowest_that_reaches_the_target_precision():
    confidence = np.array([0.95, 0.90, 0.80, 0.70, 0.60])
    correct = np.array([True, True, True, False, False])
    assert pick_threshold(confidence, correct, target=0.99, floor=0.5) == 0.8
    assert pick_threshold(confidence, correct, target=0.5, floor=0.5) == 0.5


def test_unreachable_target_gives_a_strict_threshold():
    assert pick_threshold(np.array([0.9, 0.8]), np.array([False, False]), target=0.9, floor=0.5) == 0.95


def test_saved_model_loads_and_answers_uncertain_below_threshold(tmp_path):
    torch.manual_seed(0)
    model = build("mobilenet_v3_large", pretrained=False)
    image = Image.fromarray(np.zeros((300, 300, 3), dtype=np.uint8))

    save(tmp_path / "m.pt", model, "mobilenet_v3_large", threshold=1.01, version="test-1")
    loaded = Classifier.load(tmp_path / "m.pt")
    assert loaded.version == "test-1"
    assert loaded.predict(image)["label"] == "uncertain"

    save(tmp_path / "m.pt", model, "mobilenet_v3_large", threshold=0.0, version="test-1")
    answer = Classifier.load(tmp_path / "m.pt").predict(image)
    assert answer["label"] in CLASSES and 0 <= answer["confidence"] <= 1
