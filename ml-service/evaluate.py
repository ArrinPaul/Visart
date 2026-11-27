"""Metrics and figures for the report, from the saved model and the test split.

Usage:  python evaluate.py [data_folder]     (in a notebook: %run evaluate.py data)

Writes reports/metrics.md, reports/metrics.json and reports/figures/*.png.
"""

import json
import re
import sys
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import torch
from sklearn import metrics as sk

from classifier import Classifier
from manifest import CLASSES, read_manifest
from split import read_split
from train import DEVICE, load, predict

FIGURES = Path("reports/figures")
LOG_LINE = re.compile(r"^(\w+) (head|fine-tune) (\d+)/\d+ loss ([\d.]+) val macro-F1 ([\d.]+)")


def parse_log(text: str) -> dict:
    """{architecture: [(loss, validation macro-F1), ...]} from the training output."""
    history: dict = {}
    for line in text.splitlines():
        match = LOG_LINE.match(line)
        if match:
            history.setdefault(match[1], []).append((float(match[4]), float(match[5])))
    return history


def calibration(confidence, correct, bins: int = 10):
    """Expected calibration error and (mean confidence, accuracy, count) per non-empty bin."""
    confidence, correct = np.asarray(confidence, float), np.asarray(correct, float)
    index = np.minimum((confidence * bins).astype(int), bins - 1)
    rows = [(confidence[index == b].mean(), correct[index == b].mean(), int((index == b).sum()))
            for b in range(bins) if (index == b).any()]
    return sum(abs(c - a) * n for c, a, n in rows) / len(confidence), rows


def summary(truth, probabilities) -> dict:
    guess = probabilities.argmax(1)
    labels = list(range(probabilities.shape[1]))
    report = lambda average: sk.precision_recall_fscore_support(
        truth, guess, labels=labels, average=average, zero_division=0)
    macro, weighted = report("macro"), report("weighted")
    one_hot = np.eye(len(labels))[truth]
    both = [i for i in labels if 0 < one_hot[:, i].sum() < len(truth)]
    return {
        "Accuracy": sk.accuracy_score(truth, guess),
        "Balanced accuracy": sk.balanced_accuracy_score(truth, guess),
        "Top-2 accuracy": float(np.mean([t in np.argsort(p)[-2:] for t, p in zip(truth, probabilities)])),
        "Macro precision": macro[0], "Macro recall": macro[1], "Macro F1": macro[2], "Weighted F1": weighted[2],
        "ROC-AUC (macro)": float(np.mean([sk.roc_auc_score(one_hot[:, i], probabilities[:, i]) for i in both])),
        "Average precision (macro)": float(np.mean(
            [sk.average_precision_score(one_hot[:, i], probabilities[:, i]) for i in both])),
        "Cohen's kappa": sk.cohen_kappa_score(truth, guess),
        "Matthews correlation": sk.matthews_corrcoef(truth, guess),
        "Test log loss": sk.log_loss(truth, probabilities, labels=labels),
    }


def show(name: str):
    plt.tight_layout()
    plt.savefig(FIGURES / f"{name}.png", dpi=200, bbox_inches="tight")
    plt.show()
    plt.close()


def heatmap(matrix, title, fmt, name):
    plt.figure(figsize=(6, 5))
    plt.imshow(matrix, cmap="Blues")
    plt.colorbar()
    for i in range(len(matrix)):
        for j in range(len(matrix)):
            plt.text(j, i, format(matrix[i][j], fmt), ha="center", va="center",
                     color="white" if matrix[i][j] > matrix.max() / 2 else "black")
    plt.xticks(range(len(CLASSES)), CLASSES, rotation=45)
    plt.yticks(range(len(CLASSES)), CLASSES)
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.title(title)
    show(name)


def curves(truth, probabilities):
    one_hot = np.eye(len(CLASSES))[truth]
    for kind, name in (("ROC curves", "roc_curves"), ("Precision-recall curves", "pr_curves")):
        plt.figure(figsize=(6, 5))
        for i, craft in enumerate(CLASSES):
            if not 0 < one_hot[:, i].sum() < len(truth):
                continue
            if name == "roc_curves":
                x, y, _ = sk.roc_curve(one_hot[:, i], probabilities[:, i])
                score = sk.auc(x, y)
            else:
                y, x, _ = sk.precision_recall_curve(one_hot[:, i], probabilities[:, i])
                score = sk.average_precision_score(one_hot[:, i], probabilities[:, i])
            plt.plot(x, y, label=f"{craft} ({score:.3f})")
        if name == "roc_curves":
            plt.plot([0, 1], [0, 1], "k--", linewidth=0.8)
        plt.xlabel("False positive rate" if name == "roc_curves" else "Recall")
        plt.ylabel("True positive rate" if name == "roc_curves" else "Precision")
        plt.title(kind)
        plt.legend()
        show(name)


def main(argv):
    root = Path(argv[1] if len(argv) > 1 else "data")
    FIGURES.mkdir(parents=True, exist_ok=True)
    model = Classifier.load("models/classifier.pt")
    network = model.model.to(DEVICE)

    _, images, labels = load(root, "test")
    probabilities = predict(network, images).numpy()
    truth, guess = labels.numpy(), probabilities.argmax(1)
    confidence, correct = probabilities.max(1), guess == truth

    overall = summary(truth, probabilities)
    ece, bins = calibration(confidence, correct)
    overall["Expected calibration error"] = ece
    per_class = sk.classification_report(truth, guess, labels=range(len(CLASSES)), target_names=CLASSES,
                                         output_dict=True, zero_division=0)

    # 1. data distribution
    split = read_split(root)
    rows = read_manifest(root)
    plt.figure(figsize=(8, 4))
    bottom = np.zeros(len(CLASSES))
    for name in ("train", "val", "test"):
        counts = np.array([sum(r["class"] == c and split.get(r["file"]) == name for r in rows) for c in CLASSES])
        plt.bar(CLASSES, counts, bottom=bottom, label=name)
        bottom += counts
    plt.title("Images per class and split")
    plt.legend()
    show("data_distribution")

    # 2. training curves and model comparison
    log = Path("train_log.txt")
    history = parse_log(log.read_text()) if log.exists() else {}
    if history:
        figure, (left, right) = plt.subplots(1, 2, figsize=(12, 4))
        for arch, points in history.items():
            epochs = range(1, len(points) + 1)
            left.plot(epochs, [p[0] for p in points], marker="o", label=arch)
            right.plot(epochs, [p[1] for p in points], marker="o", label=arch)
        for axis, title in ((left, "Training loss"), (right, "Validation macro-F1")):
            axis.set_title(title)
            axis.set_xlabel("Epoch")
            axis.legend()
        show("training_curves")
        plt.figure(figsize=(5, 4))
        best = {arch: max(p[1] for p in points) for arch, points in history.items()}
        bars = plt.bar(best.keys(), best.values())
        plt.bar_label(bars, fmt="%.3f")
        plt.ylim(0, 1.05)
        plt.title("Best validation macro-F1 by model")
        show("model_comparison")
    else:
        print("No train_log.txt: training curves and model comparison are skipped.")

    # 3. confusion matrices and per-class scores
    matrix = sk.confusion_matrix(truth, guess, labels=range(len(CLASSES)))
    heatmap(matrix, "Confusion matrix (counts)", "d", "confusion_counts")
    heatmap(matrix / np.maximum(matrix.sum(1, keepdims=True), 1), "Confusion matrix (share of true class)",
            ".2f", "confusion_normalised")
    plt.figure(figsize=(9, 4))
    x = np.arange(len(CLASSES))
    for offset, key in zip((-0.27, 0, 0.27), ("precision", "recall", "f1-score")):
        plt.bar(x + offset, [per_class[c][key] for c in CLASSES], 0.27, label=key)
    plt.xticks(x, CLASSES)
    plt.ylim(0, 1.05)
    plt.title("Precision, recall and F1 by class (test)")
    plt.legend(loc="lower right")
    show("per_class_scores")

    # 4. ROC and precision-recall
    curves(truth, probabilities)

    # 5. confidence, calibration and the uncertain threshold
    plt.figure(figsize=(7, 4))
    plt.hist([confidence[correct], confidence[~correct]], bins=20, range=(0, 1), stacked=True,
             label=["correct", "wrong"])
    plt.axvline(model.threshold, color="black", linestyle="--", label=f"threshold {model.threshold}")
    plt.title("Prediction confidence (test)")
    plt.legend()
    show("confidence_histogram")
    plt.figure(figsize=(5, 5))
    plt.plot([0, 1], [0, 1], "k--", linewidth=0.8)
    plt.plot([b[0] for b in bins], [b[1] for b in bins], marker="o")
    plt.xlabel("Mean confidence")
    plt.ylabel("Accuracy")
    plt.title(f"Reliability diagram (ECE {ece:.3f})")
    show("reliability")
    grid = np.linspace(0.2, 0.99, 80)
    plt.figure(figsize=(7, 4))
    plt.plot(grid, [(confidence >= t).mean() for t in grid], label="share of photos answered")
    plt.plot(grid, [correct[confidence >= t].mean() if (confidence >= t).any() else np.nan for t in grid],
             label="accuracy of answers")
    plt.axvline(model.threshold, color="black", linestyle="--")
    plt.xlabel("Threshold")
    plt.title("Effect of the uncertain threshold (test)")
    plt.legend()
    show("threshold_tradeoff")

    # 6. most confident mistakes
    wrong = [i for i in np.argsort(-confidence) if not correct[i]][:12]
    if wrong:
        plt.figure(figsize=(14, 7))
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
        for n, i in enumerate(wrong):
            plt.subplot(2, 6, n + 1)
            plt.imshow((images[i] * std + mean).clamp(0, 1).permute(1, 2, 0))
            plt.title(f"true {CLASSES[truth[i]]}\nsaid {CLASSES[guess[i]]} {confidence[i]:.2f}", fontsize=9)
            plt.axis("off")
        show("mistakes")

    # 7. speed on CPU (the service runs without a GPU)
    network.cpu().eval()
    with torch.inference_mode():
        network(images[:1])
        started = time.perf_counter()
        for _ in range(10):
            network(images[:1])
        overall["CPU seconds per image"] = (time.perf_counter() - started) / 10
    parameters = sum(p.numel() for p in network.parameters())

    lines = [f"# Evaluation: {model.version}", "",
             f"Test images: {len(truth)}. Parameters: {parameters / 1e6:.2f} million. "
             f"Uncertain threshold: {model.threshold}.",
             "Test photos are web photos with search-based labels, **not** artisan phone photos.", "",
             "| Metric | Value |", "|---|---|"]
    lines += [f"| {k} | {v:.4f} |" for k, v in overall.items()]
    lines += ["", "| Class | Precision | Recall | F1 | Images |", "|---|---|---|---|---|"]
    lines += [f"| {c} | {per_class[c]['precision']:.3f} | {per_class[c]['recall']:.3f} | "
              f"{per_class[c]['f1-score']:.3f} | {int(per_class[c]['support'])} |" for c in CLASSES]
    Path("reports/metrics.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    Path("reports/metrics.json").write_text(json.dumps(
        {"version": model.version, "overall": {k: round(float(v), 4) for k, v in overall.items()},
         "per_class": {c: per_class[c] for c in CLASSES}, "confusion": matrix.tolist()}, indent=2),
        encoding="utf-8")
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    main(sys.argv)
