# Codebase Map

Actual directory structure (verified against the repository, not assumed):

```
Visart/
├── app/
│   ├── admin/
│   │   ├── layout.tsx            # Static shell, no auth gate (see AUTHENTICATION.md)
│   │   └── page.tsx               # Client component: view router for all admin sub-views
│   ├── api/
│   │   ├── admin/
│   │   │   ├── activity/route.ts  # GET activity log
│   │   │   ├── products/route.ts  # GET/PATCH/DELETE products (CMS)
│   │   │   ├── reviews/route.ts   # GET/PATCH review moderation
│   │   │   ├── settings/route.ts  # GET/PUT platform settings
│   │   │   ├── stats/route.ts     # GET dashboard stats + health + performance
│   │   │   └── users/route.ts     # GET/PATCH/POST artisans + customer leads
│   │   ├── feedback/route.ts      # GET/POST buyer reviews
│   │   ├── generate/route.ts      # POST AI listing generation
│   │   └── verify-authenticity/route.ts  # GET authenticity audit
│   ├── create/page.tsx            # Artisan input → generation → save → redirect
│   ├── product/[id]/page.tsx      # Server-rendered public product page
│   ├── workspace/page.tsx         # Post-generation editing hub
│   ├── globals.css
│   ├── layout.tsx                 # Root HTML shell, header/footer, fonts, AccessibilityProvider
│   └── page.tsx                   # Landing page
├── components/
│   ├── admin/          # 14 components: dashboard, products/reviews CMS, settings, sidebar/header, login page
│   ├── brand/           # Logo, Wordmark
│   ├── create/           # ImageUploader, ProductForm, ProcessingState
│   ├── landing/           # 9 marketing sections (Hero, FAQ, pricing widget, etc.)
│   ├── motion/             # FadeIn, Stagger (Motion library wrappers)
│   ├── product/             # ProductView + 6 sub-components (hero, details, story, authenticity, feedback, language switcher)
│   ├── ui/                   # Atomic primitives: Button, Card, Badge, Input, Textarea, Score, VoiceInputButton, AudioPlayerControl, Accessibility{Provider,Toolbar}
│   └── workspace/             # WorkspaceContainer + tab panels (Listing/Marketing/Pricing/Reach/Readiness)
├── lib/
│   ├── ai/
│   │   ├── authenticity.ts    # Authenticity audit + feedback risk classifier (Gemini + fallbacks)
│   │   └── visart.ts           # Listing generation (Gemini + fallbacks), pricing prompt, mock generator
│   ├── audio/
│   │   ├── stt.ts               # useSpeechToText() hook — browser SpeechRecognition
│   │   └── tts.ts                # speakText(), useAudioPlayer() hook — browser SpeechSynthesis
│   ├── data/seed.ts               # Hardcoded SEED_PRODUCTS (demo catalogue, always in memory)
│   ├── demo/demoProduct.ts        # A second, mostly-unused static demo product constant
│   ├── frontend/generationClient.ts  # Client-side entry point: image compression + demo/real branching
│   ├── storage/preferences.ts     # Accessibility prefs, localStorage-only
│   ├── supabase/
│   │   ├── admin.ts    # All admin-CMS data functions — mostly localStorage, NOT Supabase-backed (see below)
│   │   ├── client.ts    # Supabase client factory (anon key only)
│   │   ├── config.ts     # Env var reading + isSupabaseConfigured()
│   │   ├── feedback.ts    # Buyer feedback dual-persistence (memory/localStorage + Supabase)
│   │   ├── products.ts     # Product dual-persistence (memory/localStorage + Supabase)
│   │   └── storage.ts       # Image upload to Supabase Storage, with base64 data-URL fallback
│   └── validation/visart.ts   # Zod schemas: VisartInputSchema, VisartGenerationSchema
├── supabase/schema.sql          # Sole DB schema definition (tables, RLS, storage bucket policy) — apply manually
├── types/                        # Hand-maintained TS types: admin.ts, database.ts, feedback.ts, frontend.ts, visart.ts
├── docs/                          # This documentation set
├── .env.example
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Important Files — Responsibility, Dependents, Change Risk

| File | Responsibility | Depends on | Used by | Change Risk |
|---|---|---|---|---|
| [`lib/validation/visart.ts`](../lib/validation/visart.ts) | Defines the canonical shape of both generation input and generation output | — | `app/api/generate`, `lib/ai/visart.ts`, `lib/frontend/generationClient.ts` | **High** — changing a field name here breaks the Gemini structured-output schema (`lib/ai/visart.ts`), the prompt text, every component that reads `VisartGeneration`, and `types/visart.ts` (kept in sync by hand, not generated from this schema) |
| [`lib/ai/visart.ts`](../lib/ai/visart.ts) | Gemini prompt + schema + fallback cascade + mock generator | `lib/validation/visart.ts`, `@google/genai` | `app/api/generate`, `lib/frontend/generationClient.ts` (imports `getMockGeneration` directly for demo mode) | **High** — the JSON schema passed to Gemini ([`visartResponseSchema`](../lib/ai/visart.ts#L4)) must stay in lockstep with `VisartGenerationSchema` and with every component under `components/workspace/*` and `components/product/*` that reads specific fields |
| [`lib/supabase/products.ts`](../lib/supabase/products.ts) | Single source of truth for reading/writing a "product" across memory/localStorage/Supabase | `lib/supabase/client.ts`, `lib/data/seed.ts` | `app/create`, `app/workspace`, `app/product/[id]`, all `app/api/admin/*` routes (via `lib/supabase/admin.ts`) | **High** — almost every page depends on this; the read-fallback order (memory → localStorage → sessionStorage → seed → Supabase) is load-bearing for the demo experience — see [`getProductById`](../lib/supabase/products.ts#L188) |
| [`supabase/schema.sql`](../supabase/schema.sql) | Postgres schema + RLS policies | — | Any real (non-demo) deployment | **High** — no migration tooling exists; changing a column here requires manually updating `types/database.ts`, every `.from("table")` call in `lib/supabase/*`, and re-running the SQL against the live Supabase project by hand — see the [RLS policy block](../supabase/schema.sql#L37) |
| [`components/admin/AdminLoginPage.tsx`](../components/admin/AdminLoginPage.tsx) | "Authenticates" the admin user | — | `app/admin/page.tsx` | **Critical / Security** — [hardcoded credentials](../components/admin/AdminLoginPage.tsx#L27) shipped to the client bundle; see [AUTHENTICATION.md](AUTHENTICATION.md) and [SECURITY.md](SECURITY.md) |
| `app/api/admin/*/route.ts` (6 files: [activity](../app/api/admin/activity/route.ts), [products](../app/api/admin/products/route.ts), [reviews](../app/api/admin/reviews/route.ts), [settings](../app/api/admin/settings/route.ts), [stats](../app/api/admin/stats/route.ts), [users](../app/api/admin/users/route.ts)) | Backing API for the admin CMS | `lib/supabase/admin.ts`, `lib/supabase/products.ts` | `app/admin/page.tsx` and its child views | **Critical / Security** — none of these routes check any form of authentication or authorization; anyone who can reach the server can call them directly, bypassing the client-side login entirely |
| [`lib/supabase/admin.ts`](../lib/supabase/admin.ts) | Admin-domain data (artisans, customers, activity log, settings, "health"/"performance" metrics) | `lib/supabase/products.ts`, `lib/supabase/feedback.ts` | `app/api/admin/*` | **Medium** — most of this data is `localStorage`-only (never reaches Postgres) or partly hardcoded/simulated (growth rates, latency numbers); see [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) |
| [`types/database.ts`](../types/database.ts) | Hand-written mirror of `supabase/schema.sql` for the Supabase JS client's generics | `types/visart.ts`, `types/frontend.ts` | `lib/supabase/client.ts` and everything that imports `Database` | **Medium** — not generated by the Supabase CLI; a schema change will silently desync this file unless updated manually |

## Naming and Path Conventions

- Path alias `@/*` maps to the repo root (`tsconfig.json`), e.g. `@/lib/ai/visart`.
- Route handlers live at `app/api/<segment>/route.ts` per the Next.js App Router convention; there is no separate `pages/api` (this project does not use the Pages Router).
- Component directories are grouped by *feature area* (`create/`, `product/`, `workspace/`, `admin/`), not by component type, except for `ui/` (generic atoms) and `motion/` (animation wrappers).
