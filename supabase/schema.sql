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

-- ============================================================
-- STORAGE — bucket for work images
-- (run this block too, it is safe to re-run)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('works', 'works', true)
on conflict (id) do nothing;

-- Anyone can view the images
drop policy if exists "Public read works images" on storage.objects;
create policy "Public read works images"
  on storage.objects for select
  using (bucket_id = 'works');

-- Only admin (logged in) can upload / replace
drop policy if exists "Admin upload works images" on storage.objects;
create policy "Admin upload works images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'works');

-- Only admin can update
drop policy if exists "Admin update works images" on storage.objects;
create policy "Admin update works images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'works');

-- Only admin can delete
drop policy if exists "Admin delete works images" on storage.objects;
create policy "Admin delete works images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'works');

-- ============================================================
-- WORKS — richer details (location + date)
-- ============================================================
alter table public.works add column if not exists location text;
alter table public.works add column if not exists event_date date;

-- ============================================================
-- BLOG POSTS (guides)
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Anyone can see PUBLISHED posts only
drop policy if exists "Public can view published posts" on public.posts;
create policy "Public can view published posts"
  on public.posts for select
  using (published = true);

-- Only admin can manage posts (see unpublished too)
drop policy if exists "Admin can manage posts" on public.posts;
create policy "Admin can manage posts"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- FAQ
-- ============================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

-- Anyone can see published FAQ
drop policy if exists "Public can view published faqs" on public.faqs;
create policy "Public can view published faqs"
  on public.faqs for select
  using (published = true);

-- Only admin can manage FAQ
drop policy if exists "Admin can manage faqs" on public.faqs;
create policy "Admin can manage faqs"
  on public.faqs for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Extra indexes
-- ============================================================
create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_idx on public.posts (published);
create index if not exists faqs_position_idx on public.faqs (position);