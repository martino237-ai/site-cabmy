-- Option 1 (la plus simple pour le développement): désactiver RLS sur les tables utilisées
alter table public.articles disable row level security;
alter table public.messages disable row level security;
alter table public.preinscriptions disable row level security;

-- Option 2 (plus sécurisé): autoriser lecture/écriture authentifiée
-- À exécuter dans l'éditeur SQL de Supabase si vous préférez garder RLS activé.

-- articles
create policy if not exists "Allow authenticated reads on articles"
on public.articles
for select
to authenticated
using (true);

create policy if not exists "Allow authenticated inserts on articles"
on public.articles
for insert
to authenticated
with check (true);

create policy if not exists "Allow authenticated updates on articles"
on public.articles
for update
to authenticated
using (true)
with check (true);

create policy if not exists "Allow authenticated deletes on articles"
on public.articles
for delete
to authenticated
using (true);

-- messages
create policy if not exists "Allow authenticated reads on messages"
on public.messages
for select
to authenticated
using (true);

create policy if not exists "Allow authenticated inserts on messages"
on public.messages
for insert
to authenticated
with check (true);

-- preinscriptions
create policy if not exists "Allow authenticated reads on preinscriptions"
on public.preinscriptions
for select
to authenticated
using (true);

create policy if not exists "Allow authenticated inserts on preinscriptions"
on public.preinscriptions
for insert
to authenticated
with check (true);
