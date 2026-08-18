-- VISART Database Schema — Member C Platform Layer

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create products table
create table if not exists public.products (
  id text primary key default uuid_generate_v4()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  input jsonb not null default '{}'::jsonb,
  generation jsonb not null default '{}'::jsonb,
  image_url text not null default ''
);

-- RLS Policies
alter table public.products enable row level security;

-- Allow public read access to products
create policy "Allow public read access to products"
  on public.products
  for select
  using (true);

-- Allow public insert access to products
create policy "Allow public insert access to products"
  on public.products
  for insert
  with check (true);

-- Allow public update access to products
create policy "Allow public update access to products"
  on public.products
  for update
  using (true);

-- Storage bucket setup
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Allow public image uploads"
  on storage.objects
  for insert
  with check (bucket_id = 'product-images');

create policy "Allow public image access"
  on storage.objects
  for select
  using (bucket_id = 'product-images');
