# Feature Dependency Map

```
lib/validation/visart.ts (Zod schemas)
      ↓ shape contract for
lib/ai/visart.ts (generation + mock)
      ↓ produces VisartGeneration, consumed by
lib/supabase/products.ts (saveProduct / getProductById / updateProductData)
      ↓ read/written by
  ┌─────────────┬──────────────┬───────────────────┐
  ↓             ↓              ↓                    ↓
/create      /workspace    /product/[id]        /api/admin/products
(creates)    (edits)       (public display,      (CMS list/edit/delete)
                            + reads product_feedback
                            + calls lib/ai/authenticity.ts)
```

```
lib/ai/authenticity.ts
      ↓ depends on
  lib/supabase/products.ts (getProductById)
  lib/supabase/feedback.ts (getProductFeedback, submitProductFeedback)
      ↓ used by
  /api/verify-authenticity, /product/[id]/page.tsx (server-side call), /api/feedback (POST → risk classification)
```

```
lib/supabase/admin.ts
      ↓ depends on
  lib/supabase/products.ts (getRecentProducts, getProductById, toggleProductPublish, deleteProductCMS)
  lib/supabase/feedback.ts (getProductFeedback, indirectly via getAllReviewsCMS)
      ↓ used by
  all app/api/admin/* routes → app/admin/page.tsx and its child views
```

```
lib/audio/tts.ts  ← independent of the AI/DB stack entirely (pure browser API wrapper)
lib/audio/stt.ts  ← independent of the AI/DB stack entirely (pure browser API wrapper)
      both consumed by: components/ui/AudioPlayerControl.tsx, VoiceInputButton.tsx
```

## Change Impact by Module

### `types/visart.ts` / `lib/validation/visart.ts` (VisartGeneration shape)
**High impact.** Changing a field here potentially affects: `lib/ai/visart.ts` (Gemini schema + prompt + mock generator), every `components/workspace/*Panel.tsx`, every `components/product/*.tsx` that reads generated content, `lib/supabase/products.ts` (typed pass-through), `types/admin.ts` (`AdminProductSummary extends ProductRecord`), and any admin view rendering product data.
**Required tests** (once a suite exists): schema round-trip (mock generation → Zod validate → every consuming component renders without runtime error).

### `supabase/schema.sql`
**High impact, manual propagation required.** Affects `types/database.ts` (hand-maintained, not generated), every `.from("<table>")` call across `lib/supabase/*.ts`, and any existing production data (no migration tooling to manage the transition).

### `lib/supabase/products.ts` (read/write fallback logic)
**High impact.** Central dependency for `/create`, `/workspace`, `/product/[id]`, and the entire admin CMS. Changing the fallback order (memory → localStorage → sessionStorage → seed → Supabase) changes what data every one of those surfaces shows under partial-configuration conditions (no Supabase, Supabase down, fresh server process, etc.).

### `components/admin/AdminLoginPage.tsx` / admin auth state
**Security-critical, low blast radius on functionality.** Changing this does not affect any other feature's *data*, but is the single highest-priority item to change before this app is exposed beyond a trusted/local environment — see [AUTHENTICATION.md](AUTHENTICATION.md).

### `app/api/admin/*` routes
**Security-critical.** Any change here should be paired with adding the authentication/authorization check that is currently entirely absent (see [SECURITY.md](SECURITY.md)) — do not add new admin capabilities without also closing this gap, or the surface area of the existing gap grows.

## Potentially Affected — Quick Reference

| Change this | Also check |
|---|---|
| Gemini generation prompt/schema | `lib/validation/visart.ts`, `types/visart.ts`, `getMockGeneration()`, all workspace/product components reading the changed field |
| Authenticity audit schema | `types/feedback.ts`, `getMockAuthenticityAudit()`, `AuthenticityInspector.tsx` |
| Translation languages | `visartResponseSchema`, `VisartGenerationSchema`, `types/visart.ts`, `getMockGeneration()`, `lib/audio/tts.ts` (`TTSLanguage`), `LanguageSwitcher.tsx` |
| Database schema | `types/database.ts`, every `.from()` call site, existing deployed data/migration plan |
| Admin settings fields | Confirm whether the setting is actually read anywhere outside the settings UI itself (several currently are not — see [features/admin-cms.md](features/admin-cms.md)) |
