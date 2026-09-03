# Entity-Relationship Diagram

Canonical version of the diagram also shown in [DATABASE.md](../DATABASE.md). Reflects only the 3 tables that actually exist in [`supabase/schema.sql`](../../supabase/schema.sql) — see [DATABASE.md](../DATABASE.md#what-actually-reaches-postgres) for what admin-CMS-displayed data has *no* backing table at all (customers, activity log, settings, review moderation status).

```mermaid
erDiagram
    ARTISANS ||--o{ PRODUCTS : "creates (artisan_id, nullable, on delete set null)"
    PRODUCTS ||--o{ PRODUCT_FEEDBACK : "receives (product_id, on delete cascade)"

    ARTISANS {
        uuid id PK
        text name
        text location
        text craft
        text preferred_language "default 'en'"
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCTS {
        text id PK "app-generated or gen_random_uuid()::text"
        uuid artisan_id FK
        text image_url "may be a Supabase Storage URL or a base64 data: URL"
        jsonb input_data "raw artisan-supplied facts"
        jsonb generated_data "full VisartGeneration AI output"
        boolean is_published "default true"
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCT_FEEDBACK {
        text id PK "app-generated"
        text product_id FK
        text user_name
        text user_location
        boolean is_verified_buyer "always true in practice, not actually verified"
        integer rating "check 1-5"
        text authenticity_rating "check enum, 4 values"
        text comment
        jsonb craft_checks
        text suspected_counterfeit_reason
        boolean flagged_as_fake "default false"
        integer helpful_count "default 0, never incremented by any endpoint"
        jsonb gemini_analysis
        timestamptz created_at
    }
```

**RLS**: all three tables have Row Level Security enabled with fully permissive (`using (true)` / `with check (true)`) public policies — see [SECURITY.md](../SECURITY.md) finding #3.
