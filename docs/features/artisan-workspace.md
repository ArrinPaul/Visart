# Feature: Artisan Workspace

## Overview
`/workspace` is the post-generation review/edit hub for a single product: tabs for Listing, Pricing, Marketing, Reach, and Readiness, plus a switcher across recently-created products.

## Entry Points
- [app/workspace/page.tsx:18](../../app/workspace/page.tsx#L18) (Server Component) — reads `?id=` from `searchParams`.
- [components/workspace/WorkspaceContainer.tsx](../../components/workspace/WorkspaceContainer.tsx#L1) (Client Component) — owns edit state and the client-side re-fetch workaround described below.

## Technical Flow
```
GET /workspace?id=<productId>
  ↓ (server-rendered)
getRecentProducts()  → memory Map (SEED_PRODUCTS only, on a fresh server process) + Supabase if configured
getProductById(id)   → tries server-side memory/Supabase; if not found, activeProduct falls back to
                         recentProducts[0] or SEED_PRODUCTS[0]
  ↓
<WorkspaceContainer initialProduct=... recentProducts=... />
  ↓ (client-side, on mount)
useEffect: if URL's ?id differs from the product actually rendered,
           re-run getProductById(id) IN THE BROWSER — this time it can find the product in
           localStorage (written by saveProduct() during the /create flow), and swaps it in via setProduct().
```

**Why this exists**: [`saveProduct()`](../../app/create/page.tsx#L119) (`app/create/page.tsx`) runs in the browser (it's called from a `"use client"` page), so it writes to the browser's `localStorage` and, separately, best-effort to Supabase. When the browser then navigates to `/workspace?id=...`, that request is served by the **Next.js server**, whose own in-process memory store does not contain the product that was just created client-side, and which cannot read `localStorage` at all (server-side code, no `window`). Without Supabase configured (or if the Supabase write raced/failed), the server-rendered page would show the wrong product (an arbitrary seed/recent product) until the client-side `useEffect` corrects it a moment after hydration. This is a deliberate workaround (see the source comment: `"Sync client-side cached product (from localStorage/sessionStorage) if SSR fell back to seed"`), not a bug fix opportunity to silently "clean up" — removing it would break the demo-mode-without-Supabase flow.

## What Artisans Can Do
- View/edit generated fields across five tabs ([`WorkspaceTabs.tsx`](../../components/workspace/WorkspaceTabs.tsx#L1) → [`ListingPanel`](../../components/workspace/ListingPanel.tsx#L1), [`PricingPanel`](../../components/workspace/PricingPanel.tsx#L1), [`MarketingPanel`](../../components/workspace/MarketingPanel.tsx#L1), [`ReachPanel`](../../components/workspace/ReachPanel.tsx#L1), [`ReadinessPanel`](../../components/workspace/ReadinessPanel.tsx#L1)).
- Save edits via [`updateProductData(id, patch)`](../../lib/supabase/products.ts#L373) (`lib/supabase/products.ts`) — merges a `Partial<VisartGeneration>` into the stored `generated_data`, dual-written to localStorage + best-effort Supabase.
- Switch between recently created products (`recentProducts` prop).

## Data Flow
Read: [`getRecentProducts()`](../../lib/supabase/products.ts#L302) / [`getProductById()`](../../lib/supabase/products.ts#L188). Write: [`updateProductData()`](../../lib/supabase/products.ts#L373). See [DATABASE.md](../DATABASE.md) for the read/write fallback order these functions follow.

## Dependencies
[`lib/supabase/products.ts`](../../lib/supabase/products.ts#L1); indirectly depends on the AI generation pipeline having already produced a `VisartGeneration` object to edit.

## Related Features
[AI Listing Generation](ai-listing-generation.md) (produces the data this page edits), [Authenticity Verification](authenticity-verification.md) and public product page (consumes the published result).

## Modification Guide
Any change to `VisartGeneration`'s shape (see [ai-listing-generation.md](ai-listing-generation.md#modification-guide)) must be reflected in whichever workspace panel renders/edits that field.

## Known Limitations
- No autosave — edits are only persisted when the user explicitly triggers a save action in a panel (verify per-panel save UX in each `components/workspace/*Panel.tsx` file).
- No concurrent-edit protection — `updateProductData` does a blind merge with no version/conflict check.
- No real multi-user workspace concept — there is no artisan identity/session, so "my products" is really "whatever is in this browser's localStorage plus whatever the seed catalogue contains."
