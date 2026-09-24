-- ============================================================
-- Youssef Photography — Database Schema
-- Run this in Supabase: SQL Editor -> New query -> Run
-- ============================================================

-- ---------- WORKS (photography pieces) ----------
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'general',
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.works enable row level security;

-- Anyone can view works (needed for the public portfolio)
drop policy if exists "Public can view works" on public.works;
create policy "Public can view works"
  on public.works for select
  using (true);

-- Only a logged-in admin can add, edit, or delete works
drop policy if exists "Admin can manage works" on public.works;
create policy "Admin can manage works"
  on public.works for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- REVIEWS (ratings + feedback) ----------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references public.works (id) on delete cascade,
  name text not null default 'Anonymous',
  rating smallint not null check (rating between 1 and 5),
  feedback text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

-- Anyone can see only APPROVED reviews (so spam stays hidden)
drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
  on public.reviews for select
  using (approved = true);

-- Any visitor can submit a review (it starts as not approved)
drop policy if exists "Public can submit reviews" on public.reviews;
create policy "Public can submit reviews"
  on public.reviews for insert
  with check (true);

-- Only admin can approve / edit / delete reviews
drop policy if exists "Admin can manage reviews" on public.reviews;
create policy "Admin can manage reviews"
  on public.reviews for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Indexes (speed) ----------
create index if not exists works_category_idx on public.works (category);
create index if not exists reviews_work_id_idx on public.reviews (work_id);
create index if not exists reviews_approved_idx on public.reviews (approved);