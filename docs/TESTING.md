# Testing

## Current State

**There is no test suite in this repository.** Verified by repo-wide search: no files matching `*.test.*`, `*.spec.*`, or a `__tests__` directory anywhere under the project (outside `node_modules`). `package.json` has no test framework listed as a dependency (no Jest, Vitest, Playwright, Testing Library, Cypress, etc.) and no `test` script — only `dev`, `build`, `start`, `lint`.

There is also no CI configuration: no `.github/workflows` directory exists.

## What Exists Instead

- **TypeScript compilation** as a correctness check: `tsconfig.json` has `strict: true`. Running `tsc --noEmit` (not wired as an npm script, but runnable directly, or implicitly via `next build`) will catch type errors across the app. This is the closest thing to an automated correctness gate currently in the project.
- **ESLint**: `npm run lint` (`eslint.config.mjs`, `eslint-config-next`) checks lint rules, not correctness or behavior.
- **Manual/demo-mode verification**: the entire "demo mode" system (`NEXT_PUBLIC_VISART_DEMO_MODE`, mock generators in `lib/ai/visart.ts` and `lib/ai/authenticity.ts`) functions as a manual smoke-test harness — it lets a developer exercise every UI flow end-to-end without needing a Gemini key or Supabase project, but it is not automated and does not assert anything.

## Recommended Coverage (Not Yet Implemented)

Documented here as a starting point for whoever adds testing — not a claim that any of this exists yet:

| Area | Suggested test type | Why it matters here specifically |
|---|---|---|
| `lib/validation/visart.ts` schemas | Unit | Cheap, high-value — schema drift here breaks generation silently |
| `lib/ai/visart.ts#getMockGeneration` / `lib/ai/authenticity.ts#getMockAuthenticityAudit` | Unit | These are pure functions (input → deterministic output) and are the actual behavior most demo runs exercise — currently entirely unverified |
| `app/api/*/route.ts` | Integration (route handler level) | Validation edge cases (missing fields, wrong types) are currently only covered by manual testing |
| `lib/supabase/products.ts` / `feedback.ts` fallback ordering | Integration | The memory → localStorage → seed → Supabase read order, and the "never throw on Supabase write failure" behavior, are both load-bearing and easy to regress silently |
| `app/api/admin/*` | Integration | Given the current lack of auth (see [SECURITY.md](SECURITY.md)), tests here should also assert the *absence* of unintended data exposure once auth is added, to prevent regression |

## How to Run What Does Exist

```bash
npm run lint        # ESLint
npx tsc --noEmit    # Type check (not a package.json script; run directly)
npm run build       # Full production build — also surfaces type errors and most runtime import issues
```
