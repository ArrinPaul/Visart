# Feature: AI Listing Generation

## Overview
Turns an artisan's raw facts (material, cost, time, location, optional photo and free-text details) into a structured, market-ready listing: title/description/category/keywords, an AI-suggested price range, marketing copy for Instagram/WhatsApp/short ads, a Hindi + Kannada translation of the title/description, a ~100–140 word heritage story, and a "digital readiness" scorecard with top-3 advice.

## Entry Points
- UI: `/create` ([app/create/page.tsx](../../app/create/page.tsx#L1))
- Client call: [`generateListing()`](../../lib/frontend/generationClient.ts#L70) in `lib/frontend/generationClient.ts`
- Server: `POST /api/generate` ([app/api/generate/route.ts](../../app/api/generate/route.ts#L1)) → [`generateVisartListing()`](../../lib/ai/visart.ts#L249) in `lib/ai/visart.ts`

## User Flow
1. Artisan fills `ProductForm` (material, production cost, time required, location, optional special details) — fields can be typed or dictated via [`VoiceInputButton`](../../components/ui/VoiceInputButton.tsx#L1) (`components/ui/VoiceInputButton.tsx`, uses [`useSpeechToText()`](../../lib/audio/stt.ts#L39)).
2. Artisan optionally drags/selects a photo in `ImageUploader`.
3. Submit triggers [`app/create/page.tsx#handleSubmit`](../../app/create/page.tsx#L63), which runs **two operations concurrently** (`Promise.all`, [L95](../../app/create/page.tsx#L95)): the generation call and the image upload ([`uploadProductImage`](../../lib/supabase/storage.ts#L17), `lib/supabase/storage.ts`).
4. `ProcessingState` component shows an animated multi-stage loading UI while both promises resolve.
5. On success, the result is persisted via [`saveProduct()`](../../lib/supabase/products.ts#L63) (`lib/supabase/products.ts`) with a hardcoded artisan name `"Local Artisan"` (see [TECHNICAL_DEBT.md](../TECHNICAL_DEBT.md) — artisan identity is not actually collected in this flow despite `ArtisanInputData` supporting a `name` field).
6. Browser is redirected to `/workspace?id=<productId>`.
7. On failure, an error message is shown with a retry option; no partial listing is saved.

## Technical Flow
```
ProductForm (typed or voice-dictated fields)
  ↓
generateListing(formData)                     [lib/frontend/generationClient.ts]
  ├─ DEMO MODE (default): calls getMockGeneration() directly in the browser
  │  after an artificial 2s delay — never touches the network.
  └─ REAL MODE (NEXT_PUBLIC_VISART_DEMO_MODE="false"):
       1. Client-side image compression: canvas resize to max 1200px, JPEG q=0.85, → base64
       2. POST /api/generate { productName, material, productionCost, timeRequired,
                                 location, specialDetails, imageUrl, imageBase64, mimeType }
       3. Server: VisartInputSchema.safeParse → 400 on failure
       4. generateVisartListing(input):
            - if no GEMINI_API_KEY: demo mode → mock; real mode → throw 500
            - else: build prompt + optional inline image part
            - loop over candidate models (see "Model Fallback Cascade" below),
              2 attempts each with backoff on transient errors
            - JSON.parse(response.text) → VisartGenerationSchema.parse() (throws on shape mismatch)
            - merge product.imageUrl/location from the original input if provided
       5. On any failure: demo mode → mock fallback; real mode → propagate error → 500
  ↓
saveProduct({ inputData, generatedData, imageUrl, artisan }) [lib/supabase/products.ts]
  ↓
redirect to /workspace?id=<id>
```

## Model Fallback Cascade
[`getCandidateModels()`](../../lib/ai/visart.ts#L139) in `lib/ai/visart.ts` returns, in order: `process.env.GEMINI_MODEL` (if set), then hardcoded `"gemini-3.5-flash"`, `"gemini-3.5-flash-lite"`, `"gemini-3.6-flash"`, `"gemini-3.1-flash-lite"`, `"gemini-3.7-flash"` (deduplicated). For each model, up to 2 attempts are made; an error is treated as "transient" (retry with `attempt * 1200ms` backoff, then move to next model) if its message contains any of: `503`, `unavailable`, `429`, `high demand`, `resource_exhausted`, `fetch failed`, `econnreset`, `etimedout`, `timeout`, `socket`, `overloaded`, `not found`, `404`. Any other error breaks out of the retry loop for that model immediately and moves to the next candidate. **These specific model name strings are not verified against Google's actual published model catalog by this documentation pass** — treat them as what the code requests, not as a guarantee those model IDs are valid; if generation always falls through to the mock, check whether these model names are current.

## Data Flow
See [DATA_FLOW.md](../DATA_FLOW.md) for the full request-response diagram.

## Frontend Implementation
- [app/create/page.tsx](../../app/create/page.tsx#L63) — orchestration, validation (`material`, `productionCost`, `timeRequired`, `location` all required; client-side only, not Zod), submit handling.
- [components/create/ProductForm.tsx](../../components/create/ProductForm.tsx#L1), [ImageUploader.tsx](../../components/create/ImageUploader.tsx#L1), [ProcessingState.tsx](../../components/create/ProcessingState.tsx#L1).
- [components/ui/VoiceInputButton.tsx](../../components/ui/VoiceInputButton.tsx#L1) — wraps [`useSpeechToText()`](../../lib/audio/stt.ts#L39) (`lib/audio/stt.ts`).
- Result consumed by `components/workspace/*` panels (Listing/Marketing/Pricing/Reach/Readiness).

## Backend Implementation
- `lib/ai/visart.ts` — [`visartResponseSchema`](../../lib/ai/visart.ts#L4) (Gemini structured-output JSON schema), [`generateVisartListing()`](../../lib/ai/visart.ts#L249), [`getMockGeneration()`](../../lib/ai/visart.ts#L173).
- `lib/validation/visart.ts` — [`VisartInputSchema`](../../lib/validation/visart.ts#L3), [`VisartGenerationSchema`](../../lib/validation/visart.ts#L17).

## Validation
- Request: Zod `safeParse`, `400` with `error.flatten()` details on failure.
- AI response: re-validated with the same `VisartGenerationSchema.parse()` — throws (caught, triggers fallback/error) if Gemini's structured output doesn't match, even though `responseSchema` was passed to the Gemini call to constrain it.

## Error Handling
- Missing `GEMINI_API_KEY`: demo mode → mock; real mode → thrown error → `500`.
- All candidate models fail: demo mode → mock; real mode → last error (or a generic "Empty response" error) propagated → `500`.
- Any other exception during generation (e.g. `JSON.parse` failure, Zod validation failure): caught in the outer `try/catch` of `generateVisartListing` — demo mode → mock; real mode → re-thrown → `500`.
- Client (`app/create/page.tsx`): catches any thrown error from `generateListing()` or `saveProduct()`, shows `errorMessage`, offers retry; does **not** distinguish between "AI failed" and "save failed" in the message shown to the user.

## Dependencies
- `@google/genai` (server only), `zod`.
- Depends on `lib/supabase/storage.ts` (concurrent image upload) and `lib/supabase/products.ts` (persistence) to complete the end-to-end flow, even though generation itself has no DB dependency.

## Modification Guide
- Adding a new output field: update [`VisartGenerationSchema`](../../lib/validation/visart.ts#L17) (validation/visart.ts) **and** [`visartResponseSchema`](../../lib/ai/visart.ts#L4) (visart.ts, Gemini schema) **and** `types/visart.ts` (`VisartGeneration` type) **and** [`getMockGeneration()`](../../lib/ai/visart.ts#L173) (so demo mode/fallback still produces the field) **and** every component that should read it (`components/workspace/*`, `components/product/*`). Missing any one of these will desync demo mode from real mode, or leave the AI unaware of the field, or leave TypeScript unaware of it.
- Changing candidate models: edit `getCandidateModels()` in **both** [`lib/ai/visart.ts:139`](../../lib/ai/visart.ts#L139) and [`lib/ai/authenticity.ts:21`](../../lib/ai/authenticity.ts#L21) — these are two independent, unsynchronized copies of the same list.

## Known Limitations
- No persistence of generation itself — a page refresh mid-flow loses the in-progress form (no draft-save).
- Demo mode's mock output is deterministic per-input but not AI-derived at all; it should not be mistaken for a preview of real-mode quality.
- The "digital readiness" score in mock mode is a fixed formula ([`lib/ai/visart.ts#getMockGeneration`](../../lib/ai/visart.ts#L173)), not learned or configurable.
- Artisan identity is not actually captured (`"Local Artisan"` hardcoded) — see [TECHNICAL_DEBT.md](../TECHNICAL_DEBT.md).
