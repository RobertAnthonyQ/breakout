-- ==============================================================================
-- BREAKOUT OPPORTUNITIES HUB — SUPABASE DATABASE SCHEMA
-- Centralized directory of grants, hackathons, accelerators, scholarships, and contests
-- ==============================================================================

-- 1. Enum for Categories
create type public.opportunity_category as enum (
  'hackathon',
  'grant',
  'accelerator',
  'incubator',
  'scholarship',
  'contest'
);

-- 2. Enum for Modality
create type public.opportunity_modality as enum (
  'remoto',
  'presencial',
  'hibrido'
);

-- 3. Opportunities Table
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  organization text not null,
  category public.opportunity_category not null,
  description text not null,
  deadline date not null,
  funding_or_prize text default 'No especificado',
  eligibility text not null,
  modality public.opportunity_modality not null default 'remoto',
  location text,
  application_url text not null,
  tags text[] default array[]::text[],
  featured boolean not null default false,
  verified boolean not null default true,
  status text not null default 'active' check (status in ('active', 'closed', 'draft', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Indexes for Performance and Queries
create index if not exists idx_opportunities_category on public.opportunities(category);
create index if not exists idx_opportunities_deadline on public.opportunities(deadline);
create index if not exists idx_opportunities_featured on public.opportunities(featured);
create index if not exists idx_opportunities_status on public.opportunities(status);
create index if not exists idx_opportunities_tags on public.opportunities using gin(tags);

-- Full-text search index for fast filtering on title, organization, and description
alter table public.opportunities add column if not exists fts tsvector 
  generated always as (
    setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(organization, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'C')
  ) stored;

create index if not exists idx_opportunities_fts on public.opportunities using gin(fts);

-- 5. Row Level Security (RLS)
alter table public.opportunities enable row level security;

-- Public can read all active and verified opportunities
create policy "Public can view active opportunities"
  on public.opportunities for select
  using (status = 'active' and verified = true);

-- Tech team / Admins can read all records (including drafts and closed)
create policy "Authenticated users can view all opportunities"
  on public.opportunities for select
  to authenticated
  using (true);

-- Authenticated users (Freddy, Saymon) can insert opportunities
create policy "Authenticated users can insert opportunities"
  on public.opportunities for insert
  to authenticated
  with check (auth.uid() is not null);

-- Authenticated users can update opportunities
create policy "Authenticated users can update opportunities"
  on public.opportunities for update
  to authenticated
  using (auth.uid() is not null);

-- Authenticated users can delete opportunities
create policy "Authenticated users can delete opportunities"
  on public.opportunities for delete
  to authenticated
  using (auth.uid() is not null);

-- 6. Seed Data Function
create or replace function public.seed_initial_opportunities()
returns void
language plpgsql
as $$
begin
  insert into public.opportunities (
    slug, title, organization, category, description, deadline, funding_or_prize,
    eligibility, modality, location, application_url, tags, featured, verified, status
  ) values 
  (
    'yc-w27',
    'Y Combinator Batch (Early Application)',
    'Y Combinator',
    'accelerator',
    'El programa de aceleración de startups más prestigioso del mundo. Inversión estándar de $500,000 USD bajo acuerdo SAFE y 3 meses de mentoría intensiva en San Francisco.',
    '2026-10-15',
    '$500,000 USD',
    'Startups tecnológicas en etapa temprana (con o sin producto lanzado). Equipos globales.',
    'presencial',
    'San Francisco, CA, EE. UU.',
    'https://www.ycombinator.com/apply',
    array['startups', 'venture capital', 'silicon valley', 'global'],
    true,
    true,
    'active'
  ),
  (
    'startup-peru-11g',
    'StartUp Perú 11G — Emprendimientos Innovadores',
    'ProInnóvate Perú (Produce)',
    'grant',
    'Fondo concursable no reembolsable del Estado Peruano para cofinanciar el despegue comercial y validación de productos/servicios con alto componente de innovación.',
    '2026-10-30',
    'Hasta S/. 60,000 PEN (no reembolsable)',
    'Personas naturales o jurídicas domiciliadas en Perú con un prototipo funcional probado.',
    'remoto',
    'Perú',
    'https://www.proinnovate.gob.pe/',
    array['peru', 'grant', 'no reembolsable', 'startupperu'],
    true,
    true,
    'active'
  ),
  (
    'platanus-ventures-2026',
    'Platanus Ventures Batch 2026',
    'Platanus Ventures',
    'accelerator',
    'Aceleradora latinoamericana fundada por programadores para programadores. Invierte $100,000 USD por el 7% de equity, conectando founders con la mejor red técnica de la región.',
    '2026-11-01',
    '$100,000 USD',
    'Startups tech de América Latina con fundadores técnicos destacados.',
    'hibrido',
    'Santiago de Chile / Remoto',
    'https://platanus.ventures/',
    array['latam', 'startups', 'technical founders', 'software'],
    true,
    true,
    'active'
  ),
  (
    'ethglobal-hackathon',
    'ETHGlobal Hackathon Autumn',
    'ETHGlobal',
    'hackathon',
    'Hackathon internacional de 36 horas para construir aplicaciones descentralizadas, agentes inteligentes en blockchain y herramientas de infraestructura web3 con mentores de primer nivel.',
    '2026-10-24',
    '+$150,000 USD en premios por tracks',
    'Desarrolladores, diseñadores y constructores de todo el mundo sin costo de inscripción.',
    'remoto',
    'Online',
    'https://ethglobal.com/',
    array['hackathon', 'web3', 'ai', 'bounties'],
    false,
    true,
    'active'
  ),
  (
    'santander-open-academy-ai',
    'Becas Santander Tech & AI',
    'Banco Santander & Universidades Aliadas',
    'scholarship',
    'Becas integrales de formación avanzada en Inteligencia Artificial, Prompt Engineering y desarrollo full-stack certificadas internacionalmente.',
    '2026-11-15',
    'Beca 100% subvencionada',
    'Estudiantes universitarios y recién egresados mayores de 18 años residentes en países de la red Santander.',
    'remoto',
    'Online',
    'https://www.santanderopenacademy.com/',
    array['becas', 'ai', 'certificacion', 'estudiantes'],
    false,
    true,
    'active'
  )
  on conflict (slug) do nothing;
end;
$$;
