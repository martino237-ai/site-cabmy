-- ============================================================
-- CABMY — Politiques de sécurité Supabase (Row Level Security)
-- ============================================================
-- À copier-coller dans l'éditeur SQL du tableau de bord Supabase
-- (https://supabase.com/dashboard/project/_/sql) et exécuter.
--
-- Ce script :
--   1. Active RLS sur les 3 tables (articles, messages, preinscriptions).
--   2. Autorise la lecture publique des articles (nécessaire pour la
--      page actualites.html et le tableau de bord admin).
--   3. Autorise l'écriture publique (INSERT uniquement) sur messages
--      et preinscriptions, pour que le formulaire de contact et de
--      pré-inscription du site fonctionnent sans compte.
--   4. Réserve la lecture/suppression de messages et preinscriptions,
--      ainsi que toute écriture sur articles, aux utilisateurs
--      authentifiés (le compte admin créé dans Supabase Auth).
--
-- Important : la création/modification/suppression d'articles passe
-- par supabase-proxy.js, qui utilise la clé service_role côté serveur
-- et n'est donc jamais soumise à RLS — aucune policy d'écriture n'est
-- donc nécessaire sur "articles" pour anon/authenticated.
-- ============================================================

alter table public.articles disable row level security;
alter table public.messages disable row level security;
alter table public.preinscriptions disable row level security;

alter table public.articles enable row level security;
alter table public.messages enable row level security;
alter table public.preinscriptions enable row level security;

-- ---------- articles ----------
-- Lecture publique (site public + tableau de bord admin).
-- Écriture réservée aux utilisateurs authentifiés (admin).
drop policy if exists "Public read access on articles" on public.articles;
drop policy if exists "Public read articles" on public.articles;
drop policy if exists "Admin read all articles" on public.articles;
drop policy if exists "Allow authenticated reads on articles" on public.articles;
drop policy if exists "Allow authenticated inserts on articles" on public.articles;
drop policy if exists "Admin insert articles" on public.articles;
drop policy if exists "Allow authenticated updates on articles" on public.articles;
drop policy if exists "Admin update articles" on public.articles;
drop policy if exists "Allow authenticated deletes on articles" on public.articles;
drop policy if exists "Admin delete articles" on public.articles;

-- Lecture publique des articles
create policy "Public read articles"
on public.articles
for select
to anon, authenticated
using (true);

-- Admin authentifié peut insérer des articles
create policy "Admin insert articles"
on public.articles
for insert
to authenticated
with check (true);

-- Admin authentifié peut modifier les articles
create policy "Admin update articles"
on public.articles
for update
to authenticated
using (true)
with check (true);

-- Admin authentifié peut supprimer les articles
create policy "Admin delete articles"
on public.articles
for delete
to authenticated
using (true);

-- ---------- messages ----------
-- N'importe qui peut envoyer un message (formulaire de contact),
-- mais seul un administrateur connecté peut les lire ou les supprimer.
drop policy if exists "Public insert on messages" on public.messages;
drop policy if exists "Allow authenticated inserts on messages" on public.messages;
drop policy if exists "Allow authenticated reads on messages" on public.messages;
drop policy if exists "Authenticated read on messages" on public.messages;
drop policy if exists "Authenticated delete on messages" on public.messages;

create policy "Public insert on messages"
on public.messages
for insert
to anon, authenticated
with check (true);

create policy "Authenticated read on messages"
on public.messages
for select
to authenticated
using (true);

create policy "Authenticated delete on messages"
on public.messages
for delete
to authenticated
using (true);

-- ---------- preinscriptions ----------
-- Même logique que messages : écriture publique, lecture/suppression
-- réservées à l'administrateur connecté.
drop policy if exists "Public insert on preinscriptions" on public.preinscriptions;
drop policy if exists "Allow authenticated inserts on preinscriptions" on public.preinscriptions;
drop policy if exists "Allow authenticated reads on preinscriptions" on public.preinscriptions;
drop policy if exists "Authenticated read on preinscriptions" on public.preinscriptions;
drop policy if exists "Authenticated delete on preinscriptions" on public.preinscriptions;

create policy "Public insert on preinscriptions"
on public.preinscriptions
for insert
to anon, authenticated
with check (true);

create policy "Authenticated read on preinscriptions"
on public.preinscriptions
for select
to authenticated
using (true);

create policy "Authenticated delete on preinscriptions"
on public.preinscriptions
for delete
to authenticated
using (true);

-- ============================================================
-- Étape manuelle requise : créer le compte administrateur
-- ============================================================
-- Dans le tableau de bord Supabase : Authentication → Users → Add user.
-- Utilisez une adresse email réelle et un mot de passe fort — c'est
-- ce compte qui remplace l'ancien mot de passe codé en dur "cabmy2024"
-- pour se connecter à admin.html.
-- ============================================================
