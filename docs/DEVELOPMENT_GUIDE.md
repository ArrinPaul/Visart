# Development Guide

## Adding a New Feature

```
Requirement
  ↓
Decide: does it need a new field on VisartGeneration (AI-generated content),
        a new table (durable data), or is it purely UI state?
  ↓
If AI-generated content:
  1. Add the field to lib/validation/visart.ts (Zod)
  2. Mirror it in lib/ai/visart.ts's visartResponseSchema (Gemini structured schema) + prompt text
  3. Mirror it in types/visart.ts
  4. Add it to getMockGeneration() in lib/ai/visart.ts (so demo mode isn't silently missing it)
  5. Render it in the relevant component(s) under components/workspace/ and/or components/product/
  ↓
If new durable data:
  1. Add the table to supabase/schema.sql (with RLS policies — see SECURITY.md before defaulting to
     `using (true)`/`with check (true)`)
  2. Mirror it in types/database.ts by hand
  3. Add read/write functions to the relevant lib/supabase/*.ts file, following the existing
     dual-write pattern (memory/localStorage fallback + best-effort Supabase) if the feature should
     work without Supabase configured, or a direct Supabase-only call if not
  4. Add an app/api/ route if the frontend needs it via HTTP (Server Components can call lib/ directly)
  ↓
Frontend
  ↓
Tests (none exist yet — see TESTING.md; add them for new logic if you can)
  ↓
Documentation — update the relevant file(s) under docs/ (see "Documentation Maintenance Rule" below)
```

## Modifying an Existing Feature
Before changing any file, check [FEATURE_DEPENDENCIES.md](FEATURE_DEPENDENCIES.md) for what else depends on it — this codebase has several hand-synchronized contracts (documented in [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) TD-008) where changing one file without its counterparts will compile fine but break at runtime (e.g. editing `types/visart.ts` without also editing `lib/ai/visart.ts`'s Gemini schema).

## Changing the Database Schema
1. Edit `supabase/schema.sql` (this file is not automatically applied — run the new/changed statements manually against the target Supabase project).
2. Update `types/database.ts` by hand to match.
3. Update every `lib/supabase/*.ts` function that queries the changed table.
4. Update `types/visart.ts` / `types/feedback.ts` / `types/admin.ts` if the change affects data shapes those types describe.
5. Update the relevant `components/` consumers.
6. Update `docs/DATABASE.md` and any `docs/features/*.md` that describe the affected data.

## Adding Server-Side Admin Authentication (Priority Fix)
This is called out separately because it is the highest-priority piece of technical debt (see [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) TD-001/TD-002/TD-003). At minimum, doing this properly requires touching, together, in one coordinated change:
- A real auth provider/session mechanism (none exists today).
- Every file under `app/api/admin/*` (add the auth check).
- `components/admin/AdminLoginPage.tsx` and `app/admin/page.tsx` (replace the hardcoded/default-open gate).
- `supabase/schema.sql` RLS policies (scope them to the new auth model, or the fix is incomplete — see TD-003).

## Local Setup
See the top-level [README.md](../README.md) "Getting Started" section. In short: `npm install`, optionally create `.env.local` from `.env.example`, `npm run dev`. No database or API key is required to run the app in its default demo mode.

## Documentation Maintenance Rule

```
CODE CHANGE + DOCUMENTATION CHANGE = COMPLETE CHANGE
```

Specifically for this codebase: if you add/rename/remove a field in `VisartGeneration`, a table/column, an API route, or an admin setting, treat the corresponding file(s) in `docs/` as part of the change, not a follow-up task. The most common places that go stale: `docs/API.md` (route contracts), `docs/DATABASE.md` (schema + "what actually reaches Postgres" table), `docs/features/*.md` (per-feature behavior), and `docs/TECHNICAL_DEBT.md` (remove an item once it's actually fixed, and mark it in the file rather than deleting the historical record if the fix is partial).
