# Feature: Regional Language Translation

## Correction vs. Existing README Claims
The prior README advertised translation into "Hindi, Kannada, Assamese, Telugu... Bengali & Tamil (via extensible schema)." **Verified in code: only Hindi and Kannada are actually implemented.**

- [`visartResponseSchema.translations`](../../lib/ai/visart.ts#L62) (`lib/ai/visart.ts`) has exactly two required sub-objects: `hindi` and `kannada`, each `{ title, description }`.
- `VisartGenerationSchema.translations` (`lib/validation/visart.ts`) and `VisartGeneration.translations` (`types/visart.ts`) mirror the same two-language shape exactly.
- The Gemini prompt itself instructs: *"'translations': Natural, fluent Hindi and Kannada translations for title and description."* — no other language is mentioned anywhere in the prompt text.
- [`getMockGeneration()`](../../lib/ai/visart.ts#L219) (demo mode) also only produces `hindi` and `kannada` blocks.
- `lib/audio/tts.ts`'s [`TTSLanguage`](../../lib/audio/tts.ts#L10) type is `"en" | "hi" | "kn"` — matching the same two-language scope for narration voice selection.

Assamese and Telugu **do** appear elsewhere in the codebase, but only as **display/seed metadata**, not as an implemented translation capability:
- `lib/supabase/admin.ts`'s [`SEED_ARTISANS`](../../lib/supabase/admin.ts#L35) and [`DEFAULT_SETTINGS.supportedLanguages`](../../lib/supabase/admin.ts#L208) list `"Assamese (অসমীয়া)"` and `"Telugu (తెలుగు)"` as an artisan's *preferred language* or a platform-level "supported languages" display string — these are static labels shown in the admin UI, not languages the AI actually translates into.
- [`artisans.preferred_language`](../../supabase/schema.sql#L16) in the database schema is a free-text column (default `'en'`) that can hold any string an artisan/admin sets, but nothing in the generation pipeline reads this column to decide which languages to translate into — the two translation languages are hardcoded in the schema/prompt regardless of `preferred_language`.

## What Is Translated
Only `product.title` and `product.description` — not `product.shortDescription`, not `marketing.*`, not `story.title`/`story.body`, not `pricing.rationale`. A buyer switching languages via [`components/product/LanguageSwitcher.tsx`](../../components/product/LanguageSwitcher.tsx#L1) therefore sees a mixed-language page for any field outside the two translated ones — confirmed directly in [`components/product/ProductView.tsx:56-64`](../../components/product/ProductView.tsx#L56), the component actually rendered on `/product/[id]` (note: `components/product/ProductDetails.tsx` and `ProductHero.tsx` also contain similar-looking translation-adjacent rendering code but are currently unused/dead — not imported by any page).

## Modification Guide
Adding a third language (e.g. real Telugu translation) requires updates in **four** places kept in sync by hand: `visartResponseSchema.translations` (Gemini schema), `VisartGenerationSchema.translations` (Zod), `VisartGeneration.translations` (`types/visart.ts`), and `getMockGeneration()`'s translations block — plus the TTS voice-matching logic in `lib/audio/tts.ts` if narration in that language is also wanted, and `components/product/LanguageSwitcher.tsx` to expose it in the UI. See [ai-listing-generation.md](ai-listing-generation.md#modification-guide) for the same multi-file-sync pattern.

## Recommendation for Documentation/Marketing Accuracy
Any external-facing description of VISART's language support should say "Hindi and Kannada" unless/until the schema is actually extended — the previous README's broader language list should be treated as aspirational, not current-state.
