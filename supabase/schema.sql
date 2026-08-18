-- ==============================================================================
-- VISART DATABASE SCHEMA (Supabase PostgreSQL)
-- Member C — Platform / Data Engineer
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

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
  id uuid primary key default gen_random_uuid(),
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

-- For hackathon: allow public read and authenticated/anon insert/update
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

-- 4. STORAGE BUCKET SETUP (Run in Supabase SQL Editor if storage bucket doesn't exist)
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
