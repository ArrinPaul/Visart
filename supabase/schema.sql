-- ==============================================================================
-- VISART DATABASE SCHEMA (Supabase PostgreSQL)
-- Multi-member Unified Platform Layer
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- 1. ARTISANS TABLE
create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  craft text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  artisan_id uuid references public.artisans(id) on delete set null,
  image_url text,
  input_data jsonb not null default '{}'::jsonb,
  generated_data jsonb default '{}'::jsonb,
  is_published boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_products_artisan_id on public.products(artisan_id);
create index if not exists idx_products_created_at on public.products(created_at desc);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
alter table public.artisans enable row level security;
alter table public.products enable row level security;

-- Public policies
create policy "Allow public read on artisans"
  on public.artisans for select
  using (true);

create policy "Allow public insert on artisans"
  on public.artisans for insert
  with check (true);

create policy "Allow public update on artisans"
  on public.artisans for update
  using (true);

create policy "Allow public read on products"
  on public.products for select
  using (true);

create policy "Allow public insert on products"
  on public.products for insert
  with check (true);

create policy "Allow public update on products"
  on public.products for update
  using (true);

-- 4. STORAGE BUCKET SETUP
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public Access to product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Public Upload to product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

create policy "Public Update to product-images"
  on storage.objects for update
  using (bucket_id = 'product-images');

-- 5. PRODUCT FEEDBACK & AUTHENTICITY REVIEWS TABLE
create table if not exists public.product_feedback (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  user_name text not null,
  user_location text,
  is_verified_buyer boolean default true,
  rating integer not null check (rating >= 1 and rating <= 5),
  authenticity_rating text not null check (authenticity_rating in ('GENUINE_HANDCRAFTED', 'LIKELY_GENUINE', 'SUSPICIOUS_QUALITY', 'CONFIRMED_FAKE_REPLICA')),
  comment text not null,
  craft_checks jsonb default '{}'::jsonb,
  suspected_counterfeit_reason text,
  flagged_as_fake boolean default false,
  helpful_count integer default 0,
  gemini_analysis jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_feedback_product_id on public.product_feedback(product_id);
create index if not exists idx_feedback_created_at on public.product_feedback(created_at desc);

alter table public.product_feedback enable row level security;

create policy "Allow public read on product_feedback"
  on public.product_feedback for select
  using (true);

create policy "Allow public insert on product_feedback"
  on public.product_feedback for insert
  with check (true);

