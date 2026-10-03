-- ============================================================
-- CONTACT MESSAGES — leads from the /fr/contact and /en/contact form
--
-- WHY: inquiries used to arrive on WhatsApp only, so nothing was written
--      down and nothing could be filtered, searched or marked as handled.
--      This table is the inbox the admin panel reads from.
--
-- HOW: Supabase -> SQL Editor -> New query -> paste -> Run
--      Safe to run more than once.
--
-- PRIVACY: visitors can INSERT only. Nobody — not even a logged-in admin —
--      can read rows through the public API without the admin policy below,
--      which is restricted to the emails in `public.admins`.
-- ============================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  -- Required on purpose: a lead without a phone number cannot be called back,
  -- and WhatsApp is the primary sales channel.
  phone text not null check (length(btrim(phone)) between 6 and 32),
  event_type text check (
    event_type is null or event_type in ('mariage', 'fiançailles', 'evenement', 'autre')
  ),
  event_date date,
  location text,
  message text not null check (length(btrim(message)) between 10 and 4000),
  -- Which language the visitor wrote in, so replies match their language.
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  status text not null default 'unread' check (status in ('unread', 'handled')),
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- ---------- Indexes ----------
-- The inbox is always read newest-first and filtered by status.
create index if not exists contact_messages_status_idx
  on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Anyone may submit a message. There is deliberately no SELECT policy for
-- anon/authenticated below, so a visitor can never read the inbox back out
-- through the anon key.
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

-- Only listed admins can read the inbox.
drop policy if exists "Admin can read contact messages" on public.contact_messages;
create policy "Admin can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

-- Only listed admins can mark handled / unhandled.
drop policy if exists "Admin can update contact messages" on public.contact_messages;
create policy "Admin can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Only listed admins can delete.
drop policy if exists "Admin can delete contact messages" on public.contact_messages;
create policy "Admin can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin());

-- ============================================================
-- No seed data needed: the event types are a fixed enum checked by the
-- constraint above, and the form labels live in messages/fr.json and
-- messages/en.json rather than in the database.
-- ============================================================