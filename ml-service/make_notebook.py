"""Build colab/visart_training.ipynb from the scripts in this folder, so the notebook is one upload.

Usage:  python make_notebook.py      (run again after changing any of the scripts)
"""

import json
from pathlib import Path

HERE = Path(__file__).parent
SCRIPTS = ("manifest.py", "collect.py", "embedder.py", "clean.py", "split.py", "classifier.py", "train.py", "evaluate.py")
OUTPUT = HERE / "colab" / "visart_training.ipynb"

SHOW_SAMPLES = """import random, matplotlib.pyplot as plt
from PIL import Image
from manifest import CLASSES, read_manifest
rows = read_manifest('data')
for craft in CLASSES:
    files = [r['file'] for r in rows if r['class'] == craft]
    picks = random.Random(1).sample(files, min(16, len(files)))
    plt.figure(figsize=(16, 4)); plt.suptitle(f'{craft}: {len(files)} images')
    for i, f in enumerate(picks):
        plt.subplot(2, 8, i + 1); plt.imshow(Image.open('data/' + f)); plt.axis('off')
    plt.show()"""

SAVE_RESULTS = """!zip -q -r visart_results.zip models reports train_log.txt data/manifest.csv data/split.csv
from google.colab import files
files.download('visart_results.zip')"""


def markdown(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.splitlines(keepends=True)}


def code(text):
    return {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [],
            "source": text.splitlines(keepends=True)}


def build() -> dict:
    cells = [
        markdown("# VISART craft classifier\n\n1. **Runtime → Change runtime type → T4 GPU**\n"
                 "2. **Runtime → Run all**\n\nKeep the tab open. The download is the slow part."),
        code("!nvidia-smi -L || echo 'NO GPU: change the runtime type before training'\n"
             "!pip install -q open_clip_torch"),
        markdown("## Project scripts\nThese cells only write files. Do not edit them here."),
    ]
    cells += [code(f"%%writefile {name}\n" + (HERE / name).read_text(encoding="utf-8")) for name in SCRIPTS]
    cells += [
        markdown("## 1. Download openly licensed photos\nSafe to run again: it continues where it stopped."),
        code("!python collect.py data"),
        markdown("## 2. Remove obvious junk, then count"),
        code("!python clean.py data\n!python manifest.py data"),
        markdown("## 3. Look at the photos\nDelete wrong ones before trusting the results."),
        code(SHOW_SAMPLES),
        markdown("## 4. Split by object and train"),
        code("!python split.py data\n!python train.py data"),
        code("!cat reports/classifier.md"),
        markdown("## Results for documentation: metrics and figures"),
        code("%run evaluate.py data"),
        markdown("## 5. Download the results"),
        code(SAVE_RESULTS),
    ]
    return {"cells": cells, "nbformat": 4, "nbformat_minor": 5,
            "metadata": {"accelerator": "GPU", "colab": {"provenance": []},
                         "kernelspec": {"name": "python3", "display_name": "Python 3"}}}


if __name__ == "__main__":
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(json.dumps(build(), indent=1), encoding="utf-8")
    print("wrote", OUTPUT.relative_to(HERE))
