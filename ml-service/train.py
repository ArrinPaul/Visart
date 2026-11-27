"""Fine-tune the craft classifier, compare architectures and write a report.

Usage:  python train.py [data_folder]

Saves models/classifier.pt (best validation macro-F1) and reports/classifier.md. The test split is
used once, for the chosen model only.
"""

import json
import os
import random
import sys
import time
from datetime import date
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torchvision.transforms import v2

from classifier import ARCHITECTURES, NORMALIZE, PREPARE, build, pick_threshold, save, scores
from manifest import CLASSES, read_manifest
from split import read_split

SEED = 2026
BATCH = 32
HEAD_EPOCHS = int(os.environ.get("HEAD_EPOCHS", 3))
TUNE_EPOCHS = int(os.environ.get("TUNE_EPOCHS", 10))
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
PATIENCE = 3

AUGMENT = v2.Compose([
    v2.RandomResizedCrop(224, scale=(0.6, 1.0), antialias=True), v2.RandomHorizontalFlip(),
    v2.RandomRotation(10), v2.ColorJitter(0.3, 0.3, 0.2, 0.03),
    v2.RandomGrayscale(0.05), v2.ToDtype(torch.float32, scale=True), NORMALIZE,
])


def load(root: Path, split_name: str):
    """Returns (resized uint8 images for augmentation, ready tensors, labels)."""
    split = read_split(root)
    raw, ready, labels = [], [], []
    for row in read_manifest(root):
        if split.get(row["file"]) != split_name:
            continue
        with Image.open(root / row["file"]) as image:
            image = image.convert("RGB")
            ready.append(PREPARE(image))
            raw.append(v2.functional.to_image(image.resize((256, 256))))
        labels.append(CLASSES.index(row["class"]))
    return raw, torch.stack(ready), torch.tensor(labels)


@torch.inference_mode()
def predict(model, images):
    model.eval()
    return torch.cat([model(images[i:i + 64].to(DEVICE)).softmax(1).cpu() for i in range(0, len(images), 64)])


def confusion(truth, predicted):
    matrix = np.zeros((len(CLASSES), len(CLASSES)), dtype=int)
    for t, p in zip(truth.tolist(), predicted.tolist()):
        matrix[t, p] += 1
    return matrix


def run_epoch(model, optimizer, loss_fn, raw, labels, frozen):
    model.train()
    if frozen:
        model.features.eval()  # keep batch-norm statistics while only the head learns
    order = torch.randperm(len(labels))
    total = 0.0
    for start in range(0, len(order), BATCH):
        index = order[start:start + BATCH]
        if len(index) < 2:
            continue
        batch = torch.stack([AUGMENT(raw[i]) for i in index.tolist()]).to(DEVICE)
        optimizer.zero_grad()
        loss = loss_fn(model(batch), labels[index].to(DEVICE))
        loss.backward()
        optimizer.step()
        total += float(loss) * len(index)
    return total / len(labels)


def train_one(arch, train_set, val_set):
    torch.manual_seed(SEED)
    random.seed(SEED)
    raw, _, labels = train_set
    _, val_images, val_labels = val_set
    model = build(arch).to(DEVICE)
    counts = torch.bincount(labels, minlength=len(CLASSES)).float()
    loss_fn = torch.nn.CrossEntropyLoss(weight=(counts.sum() / (len(CLASSES) * counts.clamp(min=1))).to(DEVICE),
                                        label_smoothing=0.05)
    best, best_state, waited = -1.0, None, 0

    for stage, epochs in (("head", HEAD_EPOCHS), ("fine-tune", TUNE_EPOCHS)):
        for parameter in model.features.parameters():
            parameter.requires_grad = False
        if stage == "fine-tune":
            for block in list(model.features)[-4:]:
                for parameter in block.parameters():
                    parameter.requires_grad = True
        trainable = [p for p in model.parameters() if p.requires_grad]
        optimizer = torch.optim.AdamW(trainable, lr=1e-3 if stage == "head" else 2e-4, weight_decay=1e-2)
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, epochs)
        waited = 0
        for epoch in range(epochs):
            started = time.time()
            loss = run_epoch(model, optimizer, loss_fn, raw, labels, frozen=stage == "head")
            scheduler.step()
            predicted = predict(model, val_images).argmax(1)
            f1 = scores(confusion(val_labels, predicted), CLASSES)["macro_f1"]
            print(f"{arch} {stage} {epoch + 1}/{epochs} loss {loss:.3f} val macro-F1 {f1:.3f} "
                  f"({time.time() - started:.0f}s)", flush=True)
            if f1 > best:
                best, waited = f1, 0
                best_state = {k: v.clone() for k, v in model.state_dict().items()}
            else:
                waited += 1
                if stage == "fine-tune" and waited >= PATIENCE:
                    break
    model.load_state_dict(best_state)
    return model, best


def report(path, results, arch, threshold, test, matrix, covered, accepted_precision, sizes):
    lines = [f"# Craft classifier, {date.today().isoformat()}", "",
             "**Data:** openly licensed web and museum photos (Wikimedia Commons, Cleveland Museum of Art,",
             "The Met). Labels come from search terms and collection types and were not all hand-checked.",
             "**These numbers are not accuracy on artisan phone photos**, which has not been measured.", "",
             f"Images: train {sizes[0]}, validation {sizes[1]}, test {sizes[2]}.", "",
             "## Model comparison (validation)", "", "| Architecture | Macro-F1 |", "|---|---|"]
    lines += [f"| {name} | {f1:.3f} |" for name, f1 in results.items()]
    lines += ["", f"Chosen: **{arch}**.", "", "## Test set (chosen model, evaluated once)", "",
              f"Macro-F1 **{test['macro_f1']:.3f}**, accuracy {test['accuracy']:.3f}.", "",
              "| Class | Precision | Recall | F1 | Images |", "|---|---|---|---|---|"]
    lines += [f"| {c} | {v['precision']} | {v['recall']} | {v['f1']} | {v['support']} |"
              for c, v in test["per_class"].items()]
    lines += ["", "Confusion matrix (rows are true classes):", "",
              "| | " + " | ".join(CLASSES) + " |", "|---" * (len(CLASSES) + 1) + "|"]
    lines += [f"| **{c}** | " + " | ".join(str(int(v)) for v in matrix[i]) + " |" for i, c in enumerate(CLASSES)]
    lines += ["", "## Uncertain threshold", "",
              f"Chosen on validation: {threshold}. On test, {covered:.0%} of photos get an answer, and "
              f"{accepted_precision:.0%} of those answers are right. The rest are `uncertain`.",
              "Photos of things outside the five classes have not been tested."]
    path.parent.mkdir(exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main(argv):
    root = Path(argv[1] if len(argv) > 1 else "data")
    torch.set_num_threads(10)
    sets = {name: load(root, name) for name in ("train", "val", "test")}
    sizes = [len(sets[n][2]) for n in ("train", "val", "test")]
    print("device:", DEVICE, "| images:", dict(zip(sets, sizes)), flush=True)

    trained = {arch: train_one(arch, sets["train"], sets["val"]) for arch in ARCHITECTURES}
    results = {arch: f1 for arch, (_, f1) in trained.items()}
    arch = max(results, key=results.get)
    model = trained[arch][0]

    val_probabilities = predict(model, sets["val"][1])
    confidence, guess = val_probabilities.max(1)
    threshold = pick_threshold(confidence.numpy(), (guess == sets["val"][2]).numpy())

    test_confidence, test_guess = predict(model, sets["test"][1]).max(1)
    matrix = confusion(sets["test"][2], test_guess)
    test = scores(matrix, CLASSES)
    accepted = test_confidence >= threshold
    correct = test_guess == sets["test"][2]
    covered = float(accepted.float().mean())
    precision = float(correct[accepted].float().mean()) if accepted.any() else 0.0

    Path("models").mkdir(exist_ok=True)
    version = f"{arch}-{date.today().isoformat()}"
    save("models/classifier.pt", model, arch, threshold, version)
    report(Path("reports/classifier.md"), results, arch, threshold, test, matrix, covered, precision, sizes)
    print(json.dumps({"version": version, "val": results, "test_macro_f1": test["macro_f1"],
                      "threshold": threshold, "coverage": round(covered, 3),
                      "accepted_precision": round(precision, 3)}), flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
