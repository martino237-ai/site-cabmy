-- ============================================================
-- CABMY — Schéma complet de base de données Supabase
-- ============================================================
-- À copier-coller INTÉGRALEMENT dans l'éditeur SQL du tableau de bord Supabase
-- (https://supabase.com/dashboard/project/_/sql) et exécuter.
--
-- Ce script crée :
--   1. Les tables (articles, messages, preinscriptions)
--   2. Les RLS (Row Level Security)
--   3. Les politiques d'accès
-- ============================================================

-- ══════════════════════════════════════════════════════════
-- 1️⃣ CRÉATION DES TABLES
-- ══════════════════════════════════════════════════════════

-- Table articles (actualités du site)
create table if not exists public.articles (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  titre text not null,
  cat text not null default 'actualite', -- Category: resultats, spiritualite, soir, actualite, etc.
  statut text not null default 'brouillon', -- brouillon, publie, archive
  featured boolean not null default false,
  resume text,
  contenu text,
  emoji text default '📰',
  date text, -- Date affichée (ex: "15 juin 2024")
  mediaType text, -- image, video, none
  mediaUrl text, -- URL de l'image/vidéo
  mediaUrls jsonb, -- Pour multiple medias
  mediaAlt text -- Alt text pour accessibilité
);

alter table public.articles add column if not exists featured boolean not null default false;

-- Table messages (formulaire de contact)
create table if not exists public.messages (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now(),
  nom text not null,
  email text not null,
  sujet text,
  message text not null,
  lu boolean default false, -- Marqué comme lu dans l'admin
  archive boolean default false
);

-- Table preinscriptions (formulaire d'inscription)
create table if not exists public.preinscriptions (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default now(),
  nom text not null,
  prenom text,
  email text not null,
  telephone text,
  classe text, -- Classe demandée
  statut text default 'nouveau', -- nouveau, contacté, inscrit, rejeté
  notes text, -- Notes de l'administrateur
  archive boolean default false
);

-- ══════════════════════════════════════════════════════════
-- 2️⃣ ACTIVATION DE ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════

alter table public.articles enable row level security;
alter table public.messages enable row level security;
alter table public.preinscriptions enable row level security;

-- ══════════════════════════════════════════════════════════
-- 3️⃣ POLITIQUES D'ACCÈS (RLS Policies)
-- ══════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────
-- ARTICLES — Lecture publique, écriture admin uniquement
-- ──────────────────────────────────────────────────────────

-- Lecture publique des articles publiés
create policy "Public read articles"
on public.articles
for select
to anon, authenticated
using (statut = 'publie');

-- Admin peut lire tous les articles (publiés + brouillons + archivés)
create policy "Admin read all articles"
on public.articles
for select
to authenticated
using (true);

-- Admin peut insérer des articles
create policy "Admin insert articles"
on public.articles
for insert
to authenticated
with check (true);

-- Admin peut modifier les articles
create policy "Admin update articles"
on public.articles
for update
to authenticated
using (true)
with check (true);

-- Admin peut supprimer les articles
create policy "Admin delete articles"
on public.articles
for delete
to authenticated
using (true);

-- ──────────────────────────────────────────────────────────
-- MESSAGES — Écriture publique, lecture/suppression admin
-- ──────────────────────────────────────────────────────────

-- Tout le monde peut envoyer un message
create policy "Public insert messages"
on public.messages
for insert
to anon, authenticated
with check (true);

-- Admin peut lire les messages
create policy "Admin read messages"
on public.messages
for select
to authenticated
using (true);

-- Admin peut supprimer les messages
create policy "Admin delete messages"
on public.messages
for delete
to authenticated
using (true);

-- Admin peut modifier les messages (marquer comme lu, archiver)
create policy "Admin update messages"
on public.messages
for update
to authenticated
using (true)
with check (true);

-- ──────────────────────────────────────────────────────────
-- PREINSCRIPTIONS — Écriture publique, lecture/suppression admin
-- ──────────────────────────────────────────────────────────

-- Tout le monde peut envoyer une pré-inscription
create policy "Public insert preinscriptions"
on public.preinscriptions
for insert
to anon, authenticated
with check (true);

-- Admin peut lire les pré-inscriptions
create policy "Admin read preinscriptions"
on public.preinscriptions
for select
to authenticated
using (true);

-- Admin peut supprimer les pré-inscriptions
create policy "Admin delete preinscriptions"
on public.preinscriptions
for delete
to authenticated
using (true);

-- Admin peut modifier les pré-inscriptions (statut, notes, archive)
create policy "Admin update preinscriptions"
on public.preinscriptions
for update
to authenticated
using (true)
with check (true);

-- ══════════════════════════════════════════════════════════
-- 4️⃣ DONNÉES DE TEST (optionnel)
-- ══════════════════════════════════════════════════════════

-- Insérer quelques articles de test
insert into public.articles (titre, cat, statut, resume, emoji, date) values
  ('BEPC 2024 : 96% de réussite au CABMY', 'resultats', 'publie', 'Le CABMY célèbre une année exceptionnelle aux examens du BEPC.', '🏆', '15 juin 2024'),
  ('Semaine de prière 2024', 'spiritualite', 'publie', 'Un moment de grâce et de recueillement pour toute la communauté.', '⛪', '10 mai 2024'),
  ('Inscription cours du soir ouverte', 'soir', 'publie', 'Les inscriptions pour les cours du soir 2024-2025 sont ouvertes.', '🌙', '01 sept. 2024'),
  ('Nouvel article en brouillon', 'actualite', 'brouillon', 'Cet article est en préparation...', '📝', '26 août 2024')
on conflict do nothing;

-- ══════════════════════════════════════════════════════════
-- ✅ SETUP COMPLETE
-- ══════════════════════════════════════════════════════════
-- Si vous voyez ce message sans erreur, c'est bon ! 🎉
-- Les tables et politiques RLS sont créées.
