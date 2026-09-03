# Feature: Admin CMS & Moderation Suite

## Overview
`/admin` is a client-only single-page dashboard ([`app/admin/page.tsx`](../../app/admin/page.tsx)) with sidebar-navigated views: Dashboard, Products CMS, Artisans, Customers, Reviews, Analytics, Performance, Activity, Settings.

**Read [AUTHENTICATION.md](../AUTHENTICATION.md) and [SECURITY.md](../SECURITY.md) first** — this entire portal has no real access control, and a meaningful portion of what it displays is not backed by the database. This document describes what the UI does, not a security or data-integrity endorsement of it.

## Views and Backing Data

| View | Component | Backing API | Data reality |
|---|---|---|---|
| Dashboard | [`DashboardView.tsx`](../../components/admin/DashboardView.tsx) | `GET /api/admin/stats` | `stats` partly real (derived from actual products/reviews, see [`getAdminDashboardStats`](../../lib/supabase/admin.ts#L279)), [`growthRates`](../../lib/supabase/admin.ts#L318) hardcoded, `performance`/parts of `health` hardcoded or simulated |
| Products CMS | [`ProductsCMSView.tsx`](../../components/admin/ProductsCMSView.tsx), [`ProductEditModal.tsx`](../../components/admin/ProductEditModal.tsx) | `GET/PATCH/DELETE /api/admin/products` | Real — reflects actual `products` data (memory/localStorage/Supabase); the one exception is [`totalInquiries`](../../lib/supabase/admin.ts#L349), regenerated randomly on every fetch |
| Artisans | [`ArtisansUsersView.tsx`](../../components/admin/ArtisansUsersView.tsx) | `GET/PATCH /api/admin/users?type=artisans` | [Seed data](../../lib/supabase/admin.ts#L35) (`SEED_ARTISANS`) + in-memory status changes via [`getArtisansList`](../../lib/supabase/admin.ts#L449); **not** read from the `artisans` Supabase table |
| Customers | [`CustomersView.tsx`](../../components/admin/CustomersView.tsx) | `GET/POST /api/admin/users?type=customers` | [`localStorage` only](../../lib/supabase/admin.ts#L20) (`getCustomerLeads`, [L493](../../lib/supabase/admin.ts#L493)); no `customers` table exists in the schema at all |
| Reviews | [`ReviewsCMSView.tsx`](../../components/admin/ReviewsCMSView.tsx), [`ReviewDetailModal.tsx`](../../components/admin/ReviewDetailModal.tsx) | `GET/PATCH /api/admin/reviews` | Review content real (from `product_feedback`, see [`getAllReviewsCMS`](../../lib/supabase/admin.ts#L517)); moderation `status` is [`localStorage`-only](../../lib/supabase/admin.ts#L23), never written back to Supabase |
| Analytics | [`AnalyticsView.tsx`](../../components/admin/AnalyticsView.tsx) | `GET /api/admin/stats` (performance) | `popularCraftCategories` view counts, `conversionRate`, `cacheHitRate` are [hardcoded constants](../../lib/supabase/admin.ts#L628) in `lib/supabase/admin.ts`, not measured; the component's own `trendData`/`geographicBreakdown` arrays are also hardcoded, see [`AnalyticsView.tsx:22`](../../components/admin/AnalyticsView.tsx#L22) |
| Performance | [`PerformanceView.tsx`](../../components/admin/PerformanceView.tsx) | `GET /api/admin/stats` (health) | `generationLatency`/`chatResponseLatency` are hardcoded constants; `supabaseDb` latency is a real (if crude) request-time measurement, `geminiAi`/`audioEngine` status/latency are hardcoded — see [`getSystemHealthMetrics`](../../lib/supabase/admin.ts#L584) |
| Activity | [`ActivityLogsView.tsx`](../../components/admin/ActivityLogsView.tsx) | `GET /api/admin/activity` | Real actions taken through the admin UI append to this log via [`logAdminActivity()`](../../lib/supabase/admin.ts#L242), but the log itself lives only in `localStorage` ([L21](../../lib/supabase/admin.ts#L21), seeded with fabricated historical entries on first load) |
| Settings | [`SettingsView.tsx`](../../components/admin/SettingsView.tsx) | `GET/PUT /api/admin/settings` | [`localStorage` only](../../lib/supabase/admin.ts#L217) ([`getAdminSettings`](../../lib/supabase/admin.ts#L655)); several settings fields (e.g. `geminiModel`) are **not wired into** the actual AI pipeline they appear to configure — see [API.md](../API.md#get-apiadminsettings) |

## Authentication
See [AUTHENTICATION.md](../AUTHENTICATION.md). Summary: default-authenticated client state ([`app/admin/page.tsx`](../../app/admin/page.tsx)), hardcoded/bypassable login screen ([`ADMIN_CREDENTIALS`](../../components/admin/AdminLoginPage.tsx#L27)), zero server-side enforcement on any `/api/admin/*` route (e.g. [`app/api/admin/products/route.ts`](../../app/api/admin/products/route.ts)).

## Data Flow
```
Admin UI view mounts
  ↓
fetch("/api/admin/<resource>")
  ↓
Route handler → lib/supabase/admin.ts function → (localStorage read, in most views) or
                                                   (lib/supabase/products.ts / feedback.ts, for real data)
  ↓
JSON response → view renders
```
Mutations (`PATCH`/`PUT`/`DELETE`/`POST`) follow the inverse path and, where applicable, call `logAdminActivity()` to append an entry to the (localStorage-only) activity log.

## Modification Guide
Before treating any admin metric as real, check `lib/supabase/admin.ts` for whether the specific field is computed from actual data or is a static constant — this file mixes both freely without any naming convention distinguishing them (see [TECHNICAL_DEBT.md](../TECHNICAL_DEBT.md)). Wiring a currently-fake metric (e.g. `conversionRate`) to real data requires both an actual tracked event source (none currently exists — there is no analytics/event-logging table or library) and a change to the corresponding `get*` function.

## Known Limitations
See [SECURITY.md](../SECURITY.md) and [DATABASE.md](../DATABASE.md#what-actually-reaches-postgres) for the full list of what does not persist to Postgres or is otherwise not real.
