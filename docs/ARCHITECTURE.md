# System Architecture

## System Overview

VISART is a single Next.js 16 (App Router) application — a hackathon-built ("InHack Problem Statement 2", per [`app/layout.tsx:98`](../app/layout.tsx#L98) footer) prototype for turning an artisan's raw craft photo + spoken/typed facts into a market-ready product listing: SEO copy, an AI-suggested price range, marketing snippets, a Hindi/Kannada translation, an audio-narrated heritage story, and an AI-generated "authenticity" forensics report used to reassure buyers a craft is genuinely handmade.

There is one Node.js runtime (the Next.js server), one external AI provider (Google Gemini via `@google/genai`), one optional database (Supabase Postgres + Storage), and no other backend services. The browser does real work too: client-side image compression, Web Speech API voice dictation, and Web Speech API text-to-speech narration all run entirely in the browser with no server involvement.

**Read this alongside [SECURITY.md](SECURITY.md) and [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) before treating any part of this system as production-hardened.** The admin portal in particular (`/admin`) has no real authentication — see below.

## Architecture Style

- **Monolith**, deployed as a single Next.js application (frontend + API routes in one codebase, one build, one deploy unit).
- **Server-rendered + client-rendered mix**: [`app/product/[id]/page.tsx`](../app/product/%5Bid%5D/page.tsx) is an async React Server Component that fetches data at request time; [`app/create/page.tsx`](../app/create/page.tsx), [`app/workspace/page.tsx`](../app/workspace/page.tsx), and the entire `/admin` tree are `"use client"` pages that fetch via `fetch()`/direct library calls after mount.
- **REST-ish JSON API** under [`app/api/**/route.ts`](../app/api) (Next.js Route Handlers) — not GraphQL, no API versioning, no OpenAPI spec.
- **No MVC/service-layer separation in the traditional sense.** Route handlers are thin; almost all logic (AI prompting, persistence fallback, mock data) lives directly in [`lib/`](../lib).
- **Dual-mode persistence**, not a typical "database-backed app": every write path (e.g. [`saveProduct`](../lib/supabase/products.ts#L63)) tries Supabase Postgres, but always also writes to an in-process `Map` and (in the browser) `localStorage`/`sessionStorage`, and reads (e.g. [`getProductById`](../lib/supabase/products.ts#L188)) prefer the local cache before the database. This is not a cache-aside pattern for performance — it is the actual fallback mechanism that keeps the app functional with zero external configuration. See [Demo Mode / Dual Persistence](adr/001-demo-mode-dual-persistence.md).

## Architecture Layers

```
Browser (React 19 client components)
  │  fetch() JSON, or direct lib/ calls from Server Components
  ▼
Next.js 16 App Router (Node.js server)
  ├── Server Components (app/product/[id]/page.tsx) — call lib/ directly, no HTTP hop
  └── Route Handlers (app/api/**/route.ts) — thin controllers: parse → validate (Zod, /api/generate only) → call lib/ → JSON response
        │
        ▼
  lib/ai/*        — Gemini prompt construction, multi-model fallback cascade, mock generators
  lib/supabase/*  — dual-write/dual-read persistence (memory Map + localStorage + Supabase), storage upload
  lib/validation/* — Zod schemas (input validation only; AI output is also re-validated with the same Zod schema)
        │
        ▼
  Google Gemini API (@google/genai)         Supabase (Postgres + Storage, optional)
```

There is no separate "controller / service / repository" layering — `lib/supabase/products.ts`, `lib/supabase/feedback.ts`, and `lib/supabase/admin.ts` each combine query logic, fallback logic, and (for admin) audit logging in one file per domain.

## Component Responsibilities

| Directory | Responsibility |
|---|---|
| [`app/page.tsx`](../app/page.tsx) | Marketing landing page ([`components/landing/*`](../components/landing)). |
| [`app/create/`](../app/create) | Artisan input form (voice or typed) + image upload → calls the generation pipeline → saves the product → redirects to `/workspace`. |
| [`app/workspace/`](../app/workspace) | Post-generation editing/review hub for a single product (`?id=` query param), tabs for listing/pricing/marketing/reach/readiness. |
| [`app/product/[id]/`](../app/product/%5Bid%5D) | Public, server-rendered product page: listing, story with audio playback, authenticity report, buyer feedback. |
| [`app/admin/`](../app/admin) | Client-only CMS: dashboard, products table, artisans/customers CRM views, review moderation, analytics/performance (partly simulated), settings, activity log. See [AUTHENTICATION.md](AUTHENTICATION.md) — this section has no real access control. |
| [`app/api/generate/route.ts`](../app/api/generate/route.ts) | `POST` — runs the Gemini listing-generation pipeline (or mock fallback) and returns JSON. Does **not** persist anything itself. |
| [`app/api/verify-authenticity/route.ts`](../app/api/verify-authenticity/route.ts) | `GET` — loads a product + its feedback, runs the Gemini authenticity-audit pipeline, returns the audit. |
| [`app/api/feedback/route.ts`](../app/api/feedback/route.ts) | `GET`/`POST` — read/submit buyer reviews; `POST` also triggers a Gemini (or heuristic) fake-review risk classifier. |
| [`app/api/admin/*`](../app/api/admin) | CRUD-ish endpoints backing the admin CMS. **No authentication or authorization check in any of these routes** — see [SECURITY.md](SECURITY.md). |
| [`lib/ai/visart.ts`](../lib/ai/visart.ts) | Listing generation: builds the Gemini prompt + structured JSON schema, runs the model-cascade retry loop ([`getCandidateModels`](../lib/ai/visart.ts#L135)), validates the response with Zod, and provides [`getMockGeneration`](../lib/ai/visart.ts#L169) (deterministic, input-derived mock used both as an offline fallback and as the entire demo-mode code path). |
| [`lib/ai/authenticity.ts`](../lib/ai/authenticity.ts) | Authenticity audit generation, mock audit fallback, and the buyer-feedback fake-review risk classifier (Gemini-backed, with a keyword-heuristic fallback when no API key is configured). |
| [`lib/supabase/*`](../lib/supabase) | All persistence: Supabase client construction, products, feedback, storage upload, and the admin-domain data functions (artisans, customers, activity log, settings — mostly `localStorage`-backed, not database-backed; see [DATABASE.md](DATABASE.md)). |
| [`lib/audio/*`](../lib/audio) | Browser-native voice input (`SpeechRecognition`) and narration (`SpeechSynthesis`) — no server-side speech processing exists anywhere in this codebase. |
| [`lib/validation/visart.ts`](../lib/validation/visart.ts) | The one Zod schema pair (`VisartInputSchema`, `VisartGenerationSchema`) used for both request validation and AI-response validation. |
| [`types/`](../types) | Hand-written TypeScript types mirroring the above; [`types/database.ts`](../types/database.ts) mirrors `supabase/schema.sql` but is maintained by hand, not generated. |
| [`supabase/schema.sql`](../supabase/schema.sql) | The only source of truth for the Postgres schema; there is no migrations directory or migration tool — this file must be run manually against a Supabase project. |
| [`components/`](../components) | Presentational/feature components, grouped by area (`admin/`, `create/`, `landing/`, `product/`, `workspace/`, `ui/` primitives, `motion/` Motion-library wrappers, `brand/`). |

## Communication

- **HTTP only.** All client→server communication is `fetch()` to Next.js Route Handlers returning JSON. No WebSockets, no Server-Sent Events, no polling for live updates (the admin dashboard's "System Health" is a synchronous request-time check, not a live monitor).
- **No message queue, no background jobs, no webhooks.** Every AI call and every database write happens synchronously inside the HTTP request that triggered it.
- **External integrations**: Google Gemini (`@google/genai`, server-side only, requires `GEMINI_API_KEY`) and Supabase (`@supabase/supabase-js`, browser-safe anon key only — there is no service-role/privileged Supabase usage anywhere in the code, despite the file name [`lib/supabase/admin.ts`](../lib/supabase/admin.ts), which is just a set of data-access functions for the `/admin` UI, not a privileged client).
- **Browser-native APIs**: `SpeechRecognition`/`webkitSpeechRecognition` (voice dictation) and `speechSynthesis` (narration) — both feature-detected, both silently unavailable on unsupported browsers (Safari/iOS has partial/no support for `SpeechRecognition`; verify current behavior before relying on it for a specific browser matrix).

## Demo Mode vs. Real Mode

Controlled by `NEXT_PUBLIC_VISART_DEMO_MODE` (default: demo mode is **on** unless the variable is explicitly the string `"false"`):

- **Demo mode, generation**: [`lib/frontend/generationClient.ts:66`](../lib/frontend/generationClient.ts#L66) never calls `/api/generate` at all — it calls [`getMockGeneration()`](../lib/ai/visart.ts#L169) directly in the browser after an artificial 2-second delay. The server-side fallback in `lib/ai/visart.ts` (used only when `/api/generate` *is* called, i.e. in real mode with a missing/failing Gemini call) is separate code that happens to be the same function.
- **Real mode**: the browser calls `POST /api/generate`, which requires `GEMINI_API_KEY` to be set or it throws (caught and surfaced as an error to the user, since demo mode is off).
- **Both modes**: authenticity audits (`/api/verify-authenticity`) and the feedback fake-review classifier fall back to their mock/heuristic implementations whenever `GEMINI_API_KEY` is absent or every candidate Gemini model fails — this fallback is independent of `NEXT_PUBLIC_VISART_DEMO_MODE` and happens in *both* modes if the API key is missing or Gemini is down.

This means the "Resilient AI Fallback Strategy" is real for the Gemini call layer, but the demo-mode / real-mode switch is a separate, coarser toggle that (for the primary generation flow) bypasses the server API entirely rather than falling back to it.
