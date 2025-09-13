create extension if not exists pgcrypto;

create table if not exists public.superheroes (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  real_name text,
  origin_description text,
  superpowers text[] default '{}',
  catch_phrase text,
  created_at timestamptz not null default now()
);

create table if not exists public.hero_images (
  id uuid primary key default gen_random_uuid(),
  hero_id uuid not null references public.superheroes(id) on delete cascade,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_hero_images_hero_id on public.hero_images(hero_id);

-- Увімкнути RLS
alter table public.superheroes enable row level security;
alter table public.hero_images enable row level security;

-- Політики читання
drop policy if exists "read heroes" on public.superheroes;
create policy "read heroes" on public.superheroes
  for select using (true);

drop policy if exists "read images" on public.hero_images;
create policy "read images" on public.hero_images
  for select using (true);