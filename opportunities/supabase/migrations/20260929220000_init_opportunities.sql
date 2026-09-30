-- ==============================================================================
-- BREAKOUT OPPORTUNITIES HUB — SUPABASE SCHEMA
-- Applied with `bunx supabase db push` (after `bunx supabase link`). Then load the catalog with
-- `bun run db:sync` (uploads data/opportunities.json).
--
-- Access model: the app talks to Supabase only from its server, with the service role key
-- (bypasses RLS). RLS stays on so the public anon key can read published rows and nothing else.
-- Community suggestions arrive as status='draft', source='community' and are published by an
-- admin (status='active', verified=true) or archived when rejected.
-- ==============================================================================

create type public.opportunity_category as enum (
  'hackathon',
  'grant',
  'accelerator',
  'incubator',
  'scholarship',
  'fellowship',
  'internship',
  'contest'
);

create type public.opportunity_modality as enum (
  'remoto',
  'presencial',
  'hibrido'
);

create table if not exists public.opportunities (
  id text primary key,                         -- app ids, e.g. 'opp-yc-w27'
  slug text not null unique,
  title text not null check (char_length(title) between 3 and 200),
  organization text not null check (char_length(organization) between 2 and 200),
  category public.opportunity_category not null,
  description text not null check (char_length(description) <= 5000),
  deadline date not null,
  deadline_display text,
  funding_or_prize text not null default 'No especificado',
  eligibility text not null default '',
  modality public.opportunity_modality not null default 'remoto',
  location text,
  application_url text not null check (application_url ~* '^https?://'),
  tags text[] not null default array[]::text[],
  featured boolean not null default false,
  verified boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed', 'archived')),
  source text not null default 'community' check (source in ('catalog', 'community')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists idx_opportunities_public on public.opportunities (status, verified, deadline);
create index if not exists idx_opportunities_category on public.opportunities (category);
create index if not exists idx_opportunities_review on public.opportunities (source, status, created_at desc);
create index if not exists idx_opportunities_tags on public.opportunities using gin (tags);

-- Keep updated_at honest on every change
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger opportunities_touch_updated_at
  before update on public.opportunities
  for each row execute function public.touch_updated_at();

-- Row Level Security: public (anon/authenticated keys) may only read published rows.
-- There are deliberately no insert/update/delete policies; writes go through the server.
alter table public.opportunities enable row level security;

create policy "Public can view published opportunities"
  on public.opportunities for select
  to anon, authenticated
  using (status = 'active' and verified = true);
