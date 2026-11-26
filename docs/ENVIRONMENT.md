# Environment Variables

Source: `.env.example` (checked into the repo) and actual `process.env.*` reads found in `lib/`, `app/`.

| Variable | Required | Purpose | Example / Default |
|---|---|---|---|
| `NEXT_PUBLIC_VISART_DEMO_MODE` | No | `"false"` disables demo mode (client generation bypass + server-side mock fallback tolerance). Any other value, or unset, means demo mode is **on** — this is the default. Read client-side (`lib/frontend/generationClient.ts`) and server-side (`lib/ai/visart.ts`, `lib/ai/authenticity.ts`). | `true` |
| `GEMINI_API_KEY` | Only for real mode / real AI calls | Server-only Google Gemini API key. Without it: demo mode falls back to mock generation everywhere; real mode throws a `500` on `/api/generate`. | `your_gemini_api_key_here` |
| `GEMINI_MODEL` | No | If set, prepended as the first candidate in the Gemini model-cascade (`lib/ai/visart.ts`, `lib/ai/authenticity.ts`). Not validated against any known-good model list by the app. | `gemini-3.5-flash` |
| `NEXT_PUBLIC_SUPABASE_URL` | No (app runs without it, in fallback mode) | Supabase project URL. Combined with the anon key, gates `isSupabaseConfigured()`. | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous/public API key. **This key is intentionally public** (shipped to the browser) — see [SECURITY.md](SECURITY.md) for what that key can do given the current RLS policies. | `your_supabase_anon_key_here` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No | Alternate/legacy name for the same anon key; `lib/supabase/config.ts` uses this as a fallback if `NEXT_PUBLIC_SUPABASE_ANON_KEY` is unset. | — |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | No | Overrides the storage bucket name used for product image uploads. | `product-images` (default in `lib/supabase/config.ts`) |

## Server-only variables for admin login and photo checks

| Variable | Needed for | Purpose |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Admin login, photo checks | Elevated database key. Never prefix with `NEXT_PUBLIC_`. |
| `APP_ORIGIN` | Admin login, photo checks | Exact origin of the app, e.g. `http://localhost:3000`. |
| `ML_SERVICE_URL` | Photo checks | Where `ml-service/` runs. |
| `ML_SERVICE_SECRET` | Photo checks | Shared secret; set the same value for the ML service. |

## Not Present, Despite What You Might Expect

- Any secret for a third-party analytics, payments, email, or SMS provider — none of these integrations exist in the codebase.

## `isSupabaseConfigured()` Logic (`lib/supabase/config.ts`)
Returns `true` only if the URL is non-empty, starts with `http`, does **not** contain the literal substring `"your-project"` (i.e. the placeholder from `.env.example` is explicitly rejected), and the anon key is non-empty. If false, every Supabase-backed function in `lib/supabase/*.ts` silently uses only the in-memory/localStorage fallback path — see [DATABASE.md](DATABASE.md).

## Setting Up `.env.local`
Copy `.env.example` to `.env.local` (git-ignored, per `.gitignore`) and fill in real values only for the features you intend to exercise beyond demo mode. A completely empty `.env.local` (or none at all) is a valid, supported configuration — the app runs entirely on seed/mock data.
