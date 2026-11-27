# VISART ML service

Scores product photos. Today it returns rule-based quality tips only; `classification` and
`embedding` are `null` until the models are trained and added.

## Run (Windows, from this folder)

    python -m venv .venv
    .venv\Scripts\python -m pip install -r requirements.txt
    $env:ML_SERVICE_SECRET = "<same value as in .env.local>"
    .venv\Scripts\python -m uvicorn app:app --port 8000

## Test

    .venv\Scripts\python -m pytest -q

## Dataset

See [DATA.md](DATA.md). `python manifest.py` counts the collected photos and lists problems.

## Training on Google Colab

Upload `colab/visart_training.ipynb` to Colab, choose a T4 GPU and run all. It downloads the data, cleans
it, splits it, trains both models and gives you `visart_results.zip`. Unzip that into this folder to get
`models/classifier.pt` and `reports/classifier.md`. After changing a script, run `python make_notebook.py`.

## Duplicate test copies

`python dupes.py` writes edited copies of the test photos to `data/duplicates/`.
