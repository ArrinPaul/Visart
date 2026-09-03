# Requirements Traceability

| Requirement | Feature Doc | Frontend | Backend | Database | Tests |
|---|---|---|---|---|---|
| FR-001 AI Listing Generation | [ai-listing-generation.md](features/ai-listing-generation.md) | `app/create/page.tsx`, `components/create/*` | `app/api/generate/route.ts`, `lib/ai/visart.ts` | none directly | None ([TESTING.md](TESTING.md)) |
| FR-002 Save Generated Listing | [ai-listing-generation.md](features/ai-listing-generation.md) | `app/create/page.tsx` | `lib/supabase/products.ts#saveProduct` | `products`, `artisans` | None |
| FR-003 Edit Listing in Workspace | [artisan-workspace.md](features/artisan-workspace.md) | `app/workspace/page.tsx`, `components/workspace/*` | `lib/supabase/products.ts#updateProductData` | `products` | None |
| FR-004 Publish / Unpublish | [admin-cms.md](features/admin-cms.md) | `components/admin/ProductsCMSView.tsx` | `app/api/admin/products/route.ts` (PATCH) | `products` | None |
| FR-005 Public Product Viewing | [authenticity-verification.md](features/authenticity-verification.md) | `app/product/[id]/page.tsx`, `components/product/*` | `lib/supabase/products.ts#getProductById` | `products`, `artisans` | None |
| FR-006 Authenticity Audit | [authenticity-verification.md](features/authenticity-verification.md) | `components/product/AuthenticityInspector.tsx` | `app/api/verify-authenticity/route.ts`, `lib/ai/authenticity.ts` | `products`, `product_feedback` (read only) | None |
| FR-007 Buyer Feedback Submission | [authenticity-verification.md](features/authenticity-verification.md) | `components/product/ProductFeedbackSection.tsx` | `app/api/feedback/route.ts`, `lib/supabase/feedback.ts` | `product_feedback` | None |
| FR-008 Voice Dictation | [heritage-storytelling-and-tts.md](features/heritage-storytelling-and-tts.md) | `components/ui/VoiceInputButton.tsx` | `lib/audio/stt.ts` (client-only) | n/a | None |
| FR-009 Audio Narration | [heritage-storytelling-and-tts.md](features/heritage-storytelling-and-tts.md) | `components/ui/AudioPlayerControl.tsx`, `components/product/ArtisanStory.tsx` | `lib/audio/tts.ts` (client-only) | n/a | None |
| FR-010 Bilingual Listing Display | [translation.md](features/translation.md) | `components/product/LanguageSwitcher.tsx` | (translation produced as part of FR-001) | `products.generated_data.translations` (jsonb) | None |
| FR-011 Admin Catalogue Management | [admin-cms.md](features/admin-cms.md) | `components/admin/ProductsCMSView.tsx`, `ProductEditModal.tsx` | `app/api/admin/products/route.ts` | `products` | None |
| FR-012 Review Moderation | [admin-cms.md](features/admin-cms.md) | `components/admin/ReviewsCMSView.tsx` | `app/api/admin/reviews/route.ts` | **Not persisted** — `localStorage` only | None |
| FR-013 Platform Settings | [admin-cms.md](features/admin-cms.md) | `components/admin/SettingsView.tsx` | `app/api/admin/settings/route.ts` | **Not persisted** — `localStorage` only | None |

Non-functional requirements are documented directly in [REQUIREMENTS.md](REQUIREMENTS.md) and cross-referenced from [SECURITY.md](SECURITY.md), [DEPLOYMENT.md](DEPLOYMENT.md), and [TESTING.md](TESTING.md) rather than tabulated here, since none currently have a dedicated implementation to trace (e.g. there is no rate-limiting module, no caching layer, no monitoring integration to point to).
