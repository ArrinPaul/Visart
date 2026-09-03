# VISART

AI-assisted product listing studio for craft artisans, built on Next.js 16 + Google Gemini + Supabase. An artisan describes a handmade product (material, cost, time, location, optional photo); Gemini generates a market-ready listing (title/description, fair-trade pricing guidance, marketing copy, a Hindi + Kannada translation, a heritage story, and a readiness score); the listing is published to a public product page with an AI authenticity forensics report and buyer feedback.

Full engineering documentation lives in **[`docs/`](docs/README.md)** — architecture, API/database reference, requirements, UML diagrams, and a full accounting of current security gaps and technical debt. Start there for anything beyond local setup.

> **Before deploying this anywhere real users can reach it**, read [`docs/SECURITY.md`](docs/SECURITY.md) and [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md). The admin portal (`/admin`) and every `/api/admin/*` route currently have no real authentication or authorization, and the database's Row Level Security policies are fully public. This is documented in detail, not hidden — see [`docs/TECHNICAL_DEBT.md`](docs/TECHNICAL_DEBT.md) for the full list and recommended fixes.

## Problem Statement

Traditional artisans often lack the time, language fluency, or e-commerce know-how to turn a handmade craft into a compelling, fairly-priced online listing. VISART's goal is to compress that gap: a few facts and a photo become a complete listing in one step, with voice dictation and multilingual output for accessibility, and buyer-facing authenticity signals to build trust in a handmade item's provenance.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini (`@google/genai`), structured JSON output, model-cascade fallback |
| Database | Supabase (PostgreSQL + Storage) |
| Validation | Zod |
| Voice/Audio | Browser-native Web Speech API (`SpeechRecognition` + `SpeechSynthesis`) — no server-side speech processing |

## Architecture (one paragraph)

Single Next.js deployment: pages and API routes in one process, calling Gemini and Supabase directly from `lib/`. No separate backend service, queue, or auth provider. The app is designed to run fully with **zero external credentials** via a demo mode that swaps live Gemini/Supabase calls for deterministic mock data — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/adr/001-demo-mode-dual-persistence.md`](docs/adr/001-demo-mode-dual-persistence.md) for how that works and its tradeoffs.

## Getting Started

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm

### Install & Run
```bash
git clone <this-repo>
cd Visart
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). No environment variables are required to run the app — it starts in demo mode using bundled seed/mock data.

### Configuring Real Mode (optional)
Copy `.env.example` to `.env.local` and fill in:
- `GEMINI_API_KEY` — enables real AI generation (from [Google AI Studio](https://aistudio.google.com/)).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — enables real database persistence (run [`supabase/schema.sql`](supabase/schema.sql) against your Supabase project first; there is no migration tool, it's a single manual SQL file).
- Set `NEXT_PUBLIC_VISART_DEMO_MODE=false` to require real credentials instead of falling back to mocks.

Full variable reference: [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md).

### Scripts
```bash
npm run dev     # start dev server (Turbopack)
npm run build   # production build
npm run start   # run a production build
npm run lint    # ESLint
```
No test script exists — see [`docs/TESTING.md`](docs/TESTING.md).

## Documentation Map

| Doc | Covers |
|---|---|
| [`docs/README.md`](docs/README.md) | Full documentation index |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System design, layers, demo mode |
| [`docs/CODEBASE_MAP.md`](docs/CODEBASE_MAP.md) | Directory-by-directory file map |
| [`docs/API.md`](docs/API.md) | Every API route, request/response, auth status |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Schema, RLS, what's real vs. localStorage-only |
| [`docs/features/`](docs/features/) | One doc per major feature |
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Functional & non-functional requirements |
| [`docs/uml/`](docs/uml/) | Class, use-case, and ER diagrams |
| [`docs/SECURITY.md`](docs/SECURITY.md) / [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) | Access-control model and gaps |
| [`docs/TECHNICAL_DEBT.md`](docs/TECHNICAL_DEBT.md) | Known issues, prioritized, with recommended fixes |
| [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) | How to safely add/modify features |

## Known Limitations

This is a hackathon-stage build (see the footer credit in [`app/layout.tsx`](app/layout.tsx)), not a production-hardened product. In short: no real authentication anywhere, fully public database write access, no automated tests, no deployment configuration, and several admin-dashboard metrics are illustrative rather than measured. None of this is hidden — [`docs/TECHNICAL_DEBT.md`](docs/TECHNICAL_DEBT.md) lists all of it with severity and recommended fixes, and inline code comments mark the specific lines involved.

## Contributing

Read [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md) before making changes — it covers the add-a-feature workflow, schema-change workflow, and the project's one hard rule: **code change + documentation change = complete change**. If you change a feature, an API contract, the schema, or a security-relevant behavior, update the corresponding file(s) in `docs/` in the same change.
