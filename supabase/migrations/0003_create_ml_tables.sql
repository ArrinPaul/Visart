-- ML verification results. Written and read only by the server with the service-role key:
-- row level security is on with no policies, and the public roles have no grants.
-- Requires supabase/schema.sql and 0001_create_admin_users.sql. Apply manually; see README.md.

create extension if not exists vector;

create table if not exists public.listing_checks (
  product_id text primary key references public.products(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'checked', 'failed')),
  model_version text,
  predicted_class text check (predicted_class in ('pottery', 'wood', 'textile', 'metal', 'bamboo', 'uncertain')),
  confidence real check (confidence between 0 and 1),
  claim_result text check (claim_result in ('match', 'mismatch', 'cannot_tell')),
  quality jsonb,
  duplicate_of text references public.products(id) on delete set null,
  similarity real,
  review_label text,
  reviewed_by uuid references public.admin_users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.image_embeddings (
  product_id text primary key references public.products(id) on delete cascade,
  embedding vector(512) not null,
  model_version text not null,
  created_at timestamptz not null default now()
);

alter table public.listing_checks enable row level security;
alter table public.image_embeddings enable row level security;
revoke all on public.listing_checks from anon, authenticated;
revoke all on public.image_embeddings from anon, authenticated;

-- Closest stored image by cosine similarity. Exact scan: enough at project scale.
create or replace function public.match_image_embeddings(
  query vector(512),
  exclude_product text,
  min_similarity float
)
returns table (product_id text, similarity float)
language sql stable
as $$
  select e.product_id, 1 - (e.embedding <=> query) as similarity
  from public.image_embeddings e
  where e.product_id <> exclude_product
    and 1 - (e.embedding <=> query) >= min_similarity
  order by e.embedding <=> query
  limit 1;
$$;

revoke all on function public.match_image_embeddings(vector, text, float) from public, anon, authenticated;
grant execute on function public.match_image_embeddings(vector, text, float) to service_role;
