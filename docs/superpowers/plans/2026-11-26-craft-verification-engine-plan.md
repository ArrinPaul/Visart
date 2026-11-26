# Plan: Craft Verification Engine (8 weeks, 4 people)

Design: [`../specs/2026-11-26-craft-verification-engine-design.md`](../specs/2026-11-26-craft-verification-engine-design.md)

Dates assume a start on Monday 30 November 2026. Shift them for exams and holidays.

## Roles

| Person | Owns |
|---|---|
| A | Data and classifier |
| B | Duplicate detector, photo quality, evaluation |
| C | FastAPI service, database, `/api/verify-listing` |
| D | Admin guard, review queue, artisan-facing UI |

Everyone collects and labels images in weeks 1 and 2: about 1,500 in total, so about 375 each.

## Weekly plan

| Week | A | B | C | D | Done when |
|---|---|---|---|---|---|
| **1** (30 Nov – 6 Dec) | Class list, labelling rules, manifest | Check dataset licences; sample photos for quality rules | Commit admin auth work; set up Supabase; apply migrations | Admin session guard on admin routes | Team can log in as admin; 600 images logged |
| **2** (7–13 Dec) | Clean data, split by object, freeze test set | Blur and light checks; make duplicate test copies | `0003` migration with pgvector; service skeleton with fake responses | Wire admin UI to the new login | **Gate:** 200+ images per class or classes cut |
| **3** (14–20 Dec) | Baseline MobileNetV3 | CLIP embeddings; first similarity results | Shared secret, safe image loading; `/api/verify-listing` against fake service | Review queue with fake data | A saved product creates a check record |
| **4** (21–27 Dec) | Fine-tune and compare EfficientNet-B0 | Choose duplicate threshold; quality tips | Serve quality and embeddings; pgvector query | Quality tips shown to artisan | Duplicate and quality work end to end |
| **5** (28 Dec – 3 Jan) | Error analysis, more data for weak classes, `uncertain` threshold | Material-word table and claim check | Serve the classifier; model versioning | Review actions saved | **Gate:** all core checks run end to end |
| **6** (4–10 Jan) | Grad-CAM; retrain | Evaluation script for all success criteria | Failure handling, rerun, rate limit, timing | Heatmap and duplicate side-by-side view; relabel the Gemini audit | Stopping the service does not break publishing |
| **7** (11–17 Jan) | Stretch: pottery handmade vs machine | Test with real users' phone photos | Setup instructions, deployment if wanted | Fix usability problems found in testing | No open bugs that block the demo |
| **8** (18–24 Jan) | Model card and results | Final numbers on the frozen test set | Update `docs/` (API, database, security, environment) | Demo script and recording | Report, slides and demo rehearsed |

## Interfaces to agree in week 1

So that people do not block each other:

```
POST {ML_SERVICE_URL}/analyze        header: x-ml-secret
  body: image file
  200: {
    "model_version": "string",
    "quality": { "score": 0-100, "tips": ["string"] },
    "classification": { "label": "pottery|wood|textile|metal|bamboo|uncertain", "confidence": 0-1 } | null,
    "embedding": [512 numbers] | null
  }
```

`null` means that part is not available yet. C ships this with fake values in week 2, and A and B replace them with real models.

## Team rules
- Branch per task, reviewed by one teammate before merging.
- Code change and `docs/` change go together (project rule).
- Datasets and model weights stay out of git; keep them in shared storage.
- Add tests for the claim table, quality rules, image loading and the admin guard.
- Weekly check: demo what works and compare with the "Done when" column.

## If you fall behind, cut in this order
1. Pottery stretch goal.
2. Grad-CAM heatmap.
3. Rerun button and deployment.
4. Reduce to three or four classes.

## Risks

| Risk | Response |
|---|---|
| Not enough images | Week 2 gate; broader or fewer classes |
| Model learns backgrounds, not crafts | Vary backgrounds; check heatmaps; test on own phone photos |
| Wood and bamboo confused | Merge them |
| Colab session limits | Save checkpoints to shared storage |
| Integration left too late | Fake service in week 2; end-to-end gate in week 5 |
