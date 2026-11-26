# VISART

AI-assisted product listing studio for craft artisans. An artisan enters a few facts and a photo;
Google Gemini writes the listing, price guidance, marketing copy, Hindi and Kannada translations and
a heritage story. We are now adding our own photo checks (see the plan below).

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase, Gemini, and a Python
(FastAPI) service for photo checks.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

With no configuration the app runs in demo mode on sample data. `/admin` needs a Supabase project:
see [docs/ADMIN_PROVISIONING.md](docs/ADMIN_PROVISIONING.md).

## Configuration

Copy `.env.example` to `.env.local`.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_VISART_DEMO_MODE` | `false` turns demo mode off |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Listing generation and text audit |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database and image storage |
| `SUPABASE_SERVICE_ROLE_KEY`, `APP_ORIGIN` | Admin login and photo checks (server only) |
| `ML_SERVICE_URL`, `ML_SERVICE_SECRET` | Photo checks; see [ml-service/README.md](ml-service/README.md) |

## Layout

| Folder | Contents |
|---|---|
| `app/` | Pages and API routes |
| `components/` | UI |
| `lib/` | AI calls, authentication, photo checks, database access |
| `ml-service/` | Python inference service |
| `supabase/` | Schema and migrations |

## Checks

```bash
npm test && npm run lint && npm run build
cd ml-service && .venv\Scripts\python -m pytest -q
```

## Photo checks project

- [Design](docs/superpowers/specs/2026-11-26-craft-verification-engine-design.md)
- [Week-by-week plan](docs/superpowers/plans/2026-11-26-craft-verification-engine-plan.md)

## Security limits

Do not put real user data in this app yet. The database rules in `supabase/schema.sql` allow anyone
with the public key to read and change products and feedback, and the `/admin` screen reads and
writes through that same key. Admin login protects the screen and the `/api/admin/*` routes only.
There are no artisan accounts, and the public AI routes have no rate limit.
