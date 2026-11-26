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
