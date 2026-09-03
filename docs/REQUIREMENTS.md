# Requirements

All requirements below are inferred from the current implementation (`Source: Inferred from implementation`) unless otherwise noted — no separate product-requirements document exists in the repository to cite as an authoritative source.

## Functional Requirements

### FR-001 — AI Listing Generation
**Actor**: Artisan (unauthenticated). **Description**: The system shall generate a structured product listing (title, description, category, keywords, pricing guidance, marketing copy, Hindi/Kannada translations of title+description, a heritage story, and a readiness score) from artisan-supplied facts and an optional photo. **Preconditions**: none. **Main flow**: artisan submits `/create` form → `POST /api/generate` (or client-side mock in demo mode) → structured `VisartGeneration` returned. **Alternative flow**: Gemini unavailable/misconfigured → demo mode returns a deterministic mock; real mode returns an error. **Postconditions**: none until the artisan also saves (FR-002) — generation alone does not persist anything. **Dependencies**: FR-002 to become a durable listing. **Priority**: High. **Source**: Inferred from implementation (`app/api/generate/route.ts`, `lib/ai/visart.ts`).

### FR-002 — Save Generated Listing
**Actor**: Artisan. **Description**: The system shall persist a generated listing (plus the original input facts, image URL, and optional artisan profile) as a `products` record, publishing it by default (`is_published: true`). **Preconditions**: FR-001 completed successfully. **Main flow**: `saveProduct()` writes to local cache and best-effort to Supabase. **Alternative flow**: Supabase unavailable → listing persists only in the current browser's `localStorage` (not durable across devices/browsers, not visible to other users). **Priority**: High. **Source**: Inferred (`lib/supabase/products.ts`).

### FR-003 — Edit Listing in Workspace
**Actor**: Artisan. **Description**: The system shall allow editing of a saved listing's generated fields across Listing/Pricing/Marketing/Reach/Readiness tabs. **Preconditions**: a product exists and is reachable via `?id=`. **Main flow**: `/workspace` → panel edit → `updateProductData()`. **Priority**: Medium. **Source**: Inferred (`app/workspace/page.tsx`, `components/workspace/*`).

### FR-004 — Publish / Unpublish a Listing
**Actor**: Admin (unauthenticated in practice — see AUTHENTICATION.md). **Description**: Toggle a product's `is_published` flag via the admin Products CMS. **Priority**: Medium. **Source**: Inferred (`PATCH /api/admin/products`).

### FR-005 — Public Product Viewing
**Actor**: Buyer (unauthenticated, anonymous). **Description**: Any visitor can view any product's page at `/product/[id]`, including its AI-generated authenticity audit and existing buyer feedback, without any access restriction. **Priority**: High. **Source**: Inferred (`app/product/[id]/page.tsx`).

### FR-006 — Authenticity Audit Generation
**Actor**: System, triggered by a buyer viewing a product. **Description**: The system shall generate (freshly, on every view) an AI authenticity forensics report for the viewed product, incorporating existing buyer feedback as signal. **Priority**: High. **Source**: Inferred (`lib/ai/authenticity.ts`).

### FR-007 — Submit Buyer Feedback / Counterfeit Report
**Actor**: Buyer (unauthenticated). **Description**: A buyer may submit a rating, an authenticity verdict, a free-text comment, structured craft checks, and an optional suspected-counterfeit reason for a product; the system runs an AI (or heuristic) risk classification against the submission and flags it if risky. **Preconditions**: product exists. **Priority**: High. **Source**: Inferred (`app/api/feedback/route.ts`, `lib/ai/authenticity.ts#analyzeFeedbackWithGemini`).

### FR-008 — Voice Dictation for Listing Creation
**Actor**: Artisan. **Description**: Form fields on `/create` may be filled via browser speech-to-text instead of typing. **Preconditions**: browser supports `SpeechRecognition`. **Priority**: Medium (core accessibility goal of the product, per landing-page copy in `components/landing/VoiceAccessibilitySection.tsx`). **Source**: Inferred (`lib/audio/stt.ts`).

### FR-009 — Audio Narration of Heritage Story
**Actor**: Buyer. **Description**: A visitor may listen to a product's story narrated via browser text-to-speech, in English, Hindi, or Kannada voice/locale selection. **Priority**: Medium. **Source**: Inferred (`lib/audio/tts.ts`).

### FR-010 — Bilingual Listing Display
**Actor**: Buyer. **Description**: A visitor may switch a product's displayed title/description between English, Hindi, and Kannada. **Priority**: Medium. **Source**: Inferred (`components/product/LanguageSwitcher.tsx`; see [features/translation.md](features/translation.md) for the exact field-level scope).

### FR-011 — Admin Catalogue Management
**Actor**: Admin. **Description**: View all products with computed readiness/authenticity/review aggregates; edit, publish/unpublish, or delete any product. **Priority**: Medium. **Source**: Inferred (`app/api/admin/products`).

### FR-012 — Review Moderation
**Actor**: Admin. **Description**: View all buyer feedback across the catalogue and set a moderation status (approved/pending/flagged/rejected). **Note**: this status is UI-only and does not persist to the underlying review record in the database (see [DATABASE.md](DATABASE.md)). **Priority**: Low-Medium (currently non-durable). **Source**: Inferred (`app/api/admin/reviews`).

### FR-013 — Platform Settings
**Actor**: Admin. **Description**: View/update a set of platform configuration values (site title, maintenance mode, active AI model label, moderation thresholds, pricing multiplier, supported languages, TTS toggle). **Note**: several of these settings are not actually consumed by the systems they appear to configure — see [features/admin-cms.md](features/admin-cms.md). **Priority**: Low (currently mostly cosmetic). **Source**: Inferred (`app/api/admin/settings`).

## Non-Functional Requirements

### Performance
**Status: not formally specified.** No documented latency SLA exists. Observed behavior: demo-mode generation has an artificial 2-second delay; real-mode generation latency depends entirely on Gemini API response time plus up to 2 retry attempts across up to 5 candidate models with 1200ms/attempt backoff on transient errors (worst case, several seconds to tens of seconds before falling through to an error or the last candidate). No caching exists anywhere, so authenticity audits and generation calls are never faster on repeat access.

### Security
See [SECURITY.md](SECURITY.md) in full. Summary status: **not production-hardened** — no server-side admin authentication/authorization, fully public database RLS write policies, hardcoded client-shipped admin credentials, no rate limiting.

### Availability
**Status: not formally specified**, and not architecturally addressed — single Next.js process design with in-process memory state (see [DEPLOYMENT.md](DEPLOYMENT.md#caveat-in-memory-state-does-not-survive-multiple-instances)); no redundancy, failover, or multi-region design exists in the codebase. The app does degrade gracefully at the *feature* level (demo-mode/mock fallbacks keep the UI functional without Gemini/Supabase), which is a resilience property, but not an availability SLA.

### Scalability
**Status: not formally specified.** The in-process `Map`-based caches in `lib/supabase/{products,feedback,admin}.ts` are the primary scalability constraint — they assume a single long-lived server process and do not scale horizontally without moving that state into Supabase or another shared store (most of the admin-domain data currently never reaches Supabase at all). Gemini calls are synchronous and unqueued, so throughput is bounded by direct API request concurrency with no backpressure/queueing mechanism.

### Maintainability
Modularity is reasonable at the directory level (`lib/ai`, `lib/supabase`, `lib/audio`, `lib/validation`, feature-grouped `components/`), but several cross-cutting contracts (the `VisartGeneration` shape, the Gemini candidate-model list) are duplicated by hand across multiple files rather than defined once — see [FEATURE_DEPENDENCIES.md](FEATURE_DEPENDENCIES.md) for the exact list. No automated tests exist (see [TESTING.md](TESTING.md)) to guard against regressions when making these coordinated changes.

### Usability
Responsive layout via Tailwind CSS v4 utility classes (not independently verified per-breakpoint in this pass); voice dictation and audio narration as explicit accessibility features (`components/ui/AccessibilityProvider.tsx`, `AccessibilityToolbar.tsx`, `lib/storage/preferences.ts` for font-size/contrast/reduced-motion/simplified-language/auto-read-aloud preferences, persisted per-browser via `localStorage`).

### Reliability
Extensive fallback-on-failure design for AI calls (mock generators) and for database writes (never throw, log and continue) — see [ERROR_HANDLING.md](ERROR_HANDLING.md). The tradeoff, stated plainly: reliability here is achieved by silently degrading to non-durable local state rather than by retry-until-success against a durable store, which is a deliberate resilience choice for a fallback-heavy prototype but not equivalent to production data-durability guarantees.

### Compatibility
No documented browser support matrix. Voice dictation (`SpeechRecognition`) and narration (`SpeechSynthesis`) are both feature-detected with graceful degradation in code, but actual cross-browser behavior (particularly Safari/iOS, which has historically had limited/no `SpeechRecognition` support) was not independently verified in this documentation pass — treat as **not formally specified** until tested against a real browser matrix.
