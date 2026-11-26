# Design: Craft Verification Engine

Date: 2026-11-26. Status: **draft, awaiting team approval**.
Items marked **(proposed)** were not discussed; change them if wrong.

## 1. Intent

Add real machine learning and deep learning to VISART as a two-month project for a team of four.

Today all AI is Gemini API calls. The authenticity audit (`lib/ai/authenticity.ts`) sends only text, never the photo, yet can return `VERIFIED_AUTHENTIC`. This project adds checks that look at the photo and whose accuracy can be measured.

## 2. Scope

**Core**
1. Craft type classifier (our own fine-tuned model).
2. Claim check: does the photo agree with the stated material?
3. Duplicate or stolen photo detector.
4. Photo quality coach.
5. Admin review queue whose corrections become training data.

**Stretch:** handmade vs machine-made, pottery only.

**Not doing:** price prediction, fake review classifier, demand forecasting, recommendations, handloom vs powerloom, Kannada/Hindi voice, background removal. Similar-craft search is optional if everything else is done.

**Anti-goals**
- Never claim the system proves an item is authentic. It reports signals.
- Never reject or unpublish a listing automatically. A person decides.
- Never show a made-up result. If a check did not run, say "not checked".

## 3. Approaches

| Approach | Trade-off |
|---|---|
| A. Models in the browser (ONNX Runtime Web) | No server to host, but results can be faked by the client, model downloads are heavy, and duplicate search still needs a server |
| **B. Separate Python inference service + Supabase pgvector** | One more thing to run, but results are server-controlled and the ML work stays in Python |
| C. Hosted vision APIs | Fastest, but there is no model of our own to train or evaluate |

**Picked: B (proposed).**

## 4. Architecture

```
/create ──> upload photo + save product (as today)
                     │
                     v
        POST /api/verify-listing {productId}      (Next.js, server)
                     │  shared secret
                     v
        FastAPI service (ml-service/)
          quality  │  classify  │  embed
                     │
                     v
        Next.js writes listing_checks + image_embeddings (service-role key)
                     │
          ┌──────────┴───────────┐
   artisan sees quality tips   admin sees review queue
```

- Verification runs after the save and does not block publishing.
- The ML service is stateless: image in, scores out. It never touches the database.
- Next.js does the database work, including the nearest-neighbour query.

## 5. Components

### 5.1 Craft classifier
- Classes **(proposed)**: pottery, wood, textile, metal, bamboo/cane.
- Pretrained MobileNetV3 and EfficientNet-B0, fine-tuned and compared. PyTorch on Colab.
- Low confidence returns `uncertain`. The threshold is chosen on the validation set.
- Photos outside the five classes must be tested; they should come out `uncertain`.
- Grad-CAM heatmap shown to admins.

### 5.2 Claim check
- A hand-written table maps material words ("teak", "terracotta", "brass") to classes.
- Results: `match`, `mismatch`, or `cannot_tell` (unknown word or uncertain prediction).

### 5.3 Duplicate detector
- Pretrained CLIP image embedding (ViT-B/32, 512 numbers), no training.
- Cosine similarity search in pgvector. Matches above a threshold are flagged.
- Artisans are not authenticated, so the system cannot tell an artisan's own re-upload from theft. It only flags the pair for an admin.

### 5.4 Photo quality coach
- Rule-based first: blur, brightness, contrast, resolution.
- Returns plain tips such as "Too dark, move near a window".
- A trained model is added only if the rules prove poor on our own photos.

### 5.5 Admin review queue
- Lists flagged listings: mismatch, possible duplicate, uncertain.
- Admin confirms or corrects the class and marks duplicates true or false.
- Corrections are stored for the next retraining. Retraining is run by hand.

### 5.6 Existing authenticity audit **(proposed)**
Keep the Gemini text audit, but relabel it as an AI text review and remove "Verified" wording from buyer pages. ML results are shown to admins only in this version.

## 6. Data model

New migration `supabase/migrations/0003_create_ml_tables.sql`:

- `listing_checks`: `product_id text` (FK to `products`), `model_version`, `predicted_class`, `confidence`, `claim_result`, `quality jsonb`, `duplicate_of text`, `similarity`, `status` (`pending`, `checked`, `failed`), `review_label`, `reviewed_by`, `reviewed_at`.
- `image_embeddings`: `product_id text`, `embedding vector(512)`, `model_version`.

Both have row level security enabled with **no public policies**, like the admin tables.

## 7. Errors and security
- ML service down or slow: the listing still publishes, status stays `failed`, admins can rerun.
- The service accepts requests only with a shared secret.
- The server fetches images only from our Supabase storage host or decodes a `data:` URL. Any other URL is refused. Size and type limits are enforced server-side.
- `/api/verify-listing` is rate limited and does not recompute an existing result for anonymous callers.
- Public database writes and public image uploads remain open today, so anyone can still alter products. This project does not fix that.
- Demo mode: verification is off and shows "not checked".

## 8. Dependencies on unfinished work
- Admin login and logout exist in uncommitted files, but `app/api/admin/products` checks no session. New review routes must check one, and that guard has to be built first.
- The admin migrations are recorded as not applied to any database.
- The ML features need a real Supabase project, not demo mode.

## 9. Data
- Target 300 or more varied images per class, mostly our own photos.
- A manifest records for every image: source, licence or consent, class, object ID, split.
- All photos of one object go in the same split.
- A test set of our own phone photos is frozen in week 2 and never trained on.
- End of week 2: any class under 200 images is merged or dropped.
- The pottery stretch dataset (about 4,600 images, 697 machine-made) needs its licences checked first.

## 10. Success criteria **(proposed)**

| Measure | Target |
|---|---|
| Classifier macro-F1 on the frozen test set | 0.80 or higher |
| Duplicate recall on cropped, filtered and resized copies | 0.90 or higher |
| Duplicate false alarms on different objects | 5% or lower |
| Verification time per image on CPU | under 5 seconds |
| ML service stopped | listing still publishes |

Targets are goals, not predictions. Report the real numbers even when they miss.

## 11. Left to the builders
Augmentations, training settings, thresholds, review screen layout, and where to host the service (running it locally is enough for a demo).
