-- MVP: In Supabase → SQL Editor einfügen und ausführen.
-- Danach Entwürfe/Kontakte aus dem Next-Code per supabase.from(...) anbinden.

-- Entwürfe
create table if not exists public.scribe_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('kalt-email', 'follow-up', 'antwort')),
  subject text not null default '',
  body text not null default '',
  to_email text,
  context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scribe_drafts enable row level security;

create policy "scribe_drafts_select_own"
  on public.scribe_drafts for select
  using (auth.uid() = user_id);

create policy "scribe_drafts_insert_own"
  on public.scribe_drafts for insert
  with check (auth.uid() = user_id);

create policy "scribe_drafts_update_own"
  on public.scribe_drafts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scribe_drafts_delete_own"
  on public.scribe_drafts for delete
  using (auth.uid() = user_id);

-- Kontakte
create table if not exists public.scribe_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.scribe_contacts enable row level security;

create policy "scribe_contacts_select_own"
  on public.scribe_contacts for select
  using (auth.uid() = user_id);

create policy "scribe_contacts_insert_own"
  on public.scribe_contacts for insert
  with check (auth.uid() = user_id);

create policy "scribe_contacts_update_own"
  on public.scribe_contacts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scribe_contacts_delete_own"
  on public.scribe_contacts for delete
  using (auth.uid() = user_id);
