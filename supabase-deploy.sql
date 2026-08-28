-- CABMY: script a executer dans Supabase SQL Editor
-- Projet attendu: dkhgaehodxugrwpdvbuk

create table if not exists public.articles (
  id bigint primary key generated always as identity,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  titre text not null,
  cat text not null default 'actualite',
  statut text not null default 'brouillon',
  resume text,
  contenu text,
  emoji text default '📰',
  date text,
  mediatype text,
  mediaurl text,
  mediaurls jsonb,
  mediaalt text,
  featured boolean not null default false
);

alter table public.articles add column if not exists featured boolean not null default false;
alter table public.articles enable row level security;

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media" on storage.objects;
drop policy if exists "Service role manage media" on storage.objects;

create policy "Public read media"
on storage.objects for select to public
using (bucket_id = 'media');

create policy "Service role manage media"
on storage.objects for all to service_role
using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "Public read articles" on public.articles;
drop policy if exists "Admin read all articles" on public.articles;
drop policy if exists "Admin insert articles" on public.articles;
drop policy if exists "Admin update articles" on public.articles;
drop policy if exists "Admin delete articles" on public.articles;

create policy "Public read articles"
on public.articles for select to anon, authenticated
using (statut = 'publie');

create policy "Admin read all articles"
on public.articles for select to authenticated
using (true);

create policy "Admin insert articles"
on public.articles for insert to authenticated
with check (true);

create policy "Admin update articles"
on public.articles for update to authenticated
using (true) with check (true);

create policy "Admin delete articles"
on public.articles for delete to authenticated
using (true);

-- Le formulaire public actuel ne demande pas d'email pour une pre-inscription.
alter table public.preinscriptions alter column email drop not null;
