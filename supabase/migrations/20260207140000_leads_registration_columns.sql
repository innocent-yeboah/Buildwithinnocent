-- Leads: structured bootcamp registration + consultation (matches Next.js /api/leads)
-- Run in Supabase SQL Editor or via CLI: supabase db push

alter table public.leads
  add column if not exists form_type text not null default 'consultation';

alter table public.leads
  add column if not exists experience_level text;

alter table public.leads
  add column if not exists goals text;

alter table public.leads
  add column if not exists agreed_terms_at timestamptz;

comment on column public.leads.form_type is 'consultation | registration';
comment on column public.leads.experience_level is 'Bootcamp: self-reported coding level';
comment on column public.leads.goals is 'Bootcamp goals textarea; null for consultation leads';
comment on column public.leads.agreed_terms_at is 'Server timestamp when terms checkbox accepted (registration only)';

alter table public.leads drop constraint if exists leads_form_type_check;

alter table public.leads
  add constraint leads_form_type_check check (form_type in ('consultation', 'registration'));

-- Backfill legacy rows that used source only
update public.leads
set form_type = 'registration'
where source = 'bootcamp_registration'
  and form_type = 'consultation';

create index if not exists leads_form_type_idx on public.leads (form_type);

create index if not exists leads_source_idx on public.leads (source);
