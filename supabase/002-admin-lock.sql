-- ============================================================
-- SECURITY FIX — only Youssef can manage the site
--
-- WHY: before this, ANY logged-in Supabase user could open /admin
--      and delete every photo. Now access is locked to the emails
--      listed in the `admins` table.
--
-- HOW: Supabase -> SQL Editor -> New query -> paste -> Run
--      Safe to run more than once.
-- ============================================================

-- ---------- 1. The list of admin emails ----------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admins (email)
values ('baghzaoui1@gmail.com')
on conflict (email) do nothing;

-- To add a second admin later, uncomment and run:
-- insert into public.admins (email) values ('other@example.com')
-- on conflict (email) do nothing;

alter table public.admins enable row level security;

-- An admin may read ONLY their own row (so the app can verify them).
drop policy if exists "Admins read own row" on public.admins;
create policy "Admins read own row"
  on public.admins for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- No insert / update / delete policies = nobody can change this list
-- from the website. Only you, from the Supabase SQL editor, can.

-- ---------- 2. Helper used by every RLS policy ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- 3. Replace every "any logged-in user" rule with "listed admin only"
-- ============================================================

-- works
drop policy if exists "Admin can manage works" on public.works;
create policy "Admin can manage works"
  on public.works for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- reviews
drop policy if exists "Admin can manage reviews" on public.reviews;
create policy "Admin can manage reviews"
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- posts
drop policy if exists "Admin can manage posts" on public.posts;
create policy "Admin can manage posts"
  on public.posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- faqs
drop policy if exists "Admin can manage faqs" on public.faqs;
create policy "Admin can manage faqs"
  on public.faqs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 4. Image storage (bucket "works")
-- ============================================================

drop policy if exists "Admin upload works images" on storage.objects;
create policy "Admin upload works images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'works' and public.is_admin());

drop policy if exists "Admin update works images" on storage.objects;
create policy "Admin update works images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'works' and public.is_admin())
  with check (bucket_id = 'works' and public.is_admin());

drop policy if exists "Admin delete works images" on storage.objects;
create policy "Admin delete works images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'works' and public.is_admin());
