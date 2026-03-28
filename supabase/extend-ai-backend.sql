-- Erweiterung für „Scribe Engine“ / AI-Agent (nach mvp-schema.sql ausführen).
-- Ziel: User-Kontext + nachvollziehbare Agent-Schritte (Research → Extract → Generate).

-- ---------------------------------------------------------------------------
-- Profil (1:1 zu auth.users) – User_Context für spätere Prompts
-- ---------------------------------------------------------------------------
create table if not exists public.scribe_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  skills jsonb not null default '[]'::jsonb,
  portfolio_urls jsonb not null default '[]'::jsonb,
  availability_hint text,
  writing_style text,
  reference_project text,
  updated_at timestamptz not null default now()
);

alter table public.scribe_profiles enable row level security;

create policy "scribe_profiles_select_own"
  on public.scribe_profiles for select
  using (auth.uid() = user_id);

create policy "scribe_profiles_insert_own"
  on public.scribe_profiles for insert
  with check (auth.uid() = user_id);

create policy "scribe_profiles_update_own"
  on public.scribe_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scribe_profiles_delete_own"
  on public.scribe_profiles for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Agent-Jobs (Log pro Lead: Research / Extract / Generate)
-- ---------------------------------------------------------------------------
create table if not exists public.scribe_agent_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lead_id uuid not null references public.scribe_leads (id) on delete cascade,
  job_type text not null check (job_type in ('research', 'extract', 'generate')),
  status text not null default 'queued'
    check (status in ('queued', 'running', 'completed', 'failed')),
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scribe_agent_jobs_lead_created_idx
  on public.scribe_agent_jobs (lead_id, created_at desc);

create index if not exists scribe_agent_jobs_user_created_idx
  on public.scribe_agent_jobs (user_id, created_at desc);

alter table public.scribe_agent_jobs enable row level security;

create policy "scribe_agent_jobs_select_own"
  on public.scribe_agent_jobs for select
  using (auth.uid() = user_id);

create policy "scribe_agent_jobs_insert_own"
  on public.scribe_agent_jobs for insert
  with check (auth.uid() = user_id);

create policy "scribe_agent_jobs_update_own"
  on public.scribe_agent_jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scribe_agent_jobs_delete_own"
  on public.scribe_agent_jobs for delete
  using (auth.uid() = user_id);
