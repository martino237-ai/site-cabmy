# CABMY - Site web du Collège Adventiste Bilingue Marathana de Yaoundé

## ⚠️ ACTIONS MANUELLES REQUISES (à faire avant d'utiliser l'admin)

Deux étapes doivent être faites **une seule fois**, directement dans le tableau de bord Supabase (https://supabase.com/dashboard). Personne d'autre que toi ne peut les faire — elles ne sont pas dans le code.

**Étape 1 — Créer le compte administrateur**
1. Ouvrir https://supabase.com/dashboard/project/cqoyhtmowyzvpjdzypgs
2. Menu de gauche → **Authentication** → **Users**
3. Cliquer **Add user** → **Create new user**
4. Renseigner un email réel et un mot de passe fort → **Create user**
5. C'est cet email + ce mot de passe qui serviront à se connecter sur `admin.html` (l'ancien mot de passe `admin` / `cabmy2024` codé en dur ne fonctionne plus).

**Étape 2 — Activer les règles de sécurité (RLS)**
1. Toujours dans le tableau de bord Supabase → menu de gauche → **SQL Editor**
2. Cliquer **New query**
3. Ouvrir le fichier [`supabase-rls.sql`](./supabase-rls.sql) à la racine de ce projet, copier tout son contenu, le coller dans l'éditeur SQL
4. Cliquer **Run**

Sans l'étape 2, les données (messages, pré-inscriptions) restent lisibles par n'importe qui disposant de la clé publique du site. Sans l'étape 1, personne ne peut se connecter à `admin.html`.

---

## Présentation

Ce projet est un site web statique pour le Collège Adventiste Bilingue Marathana de Yaoundé (CABMY).
Il est construit avec des pages HTML, du CSS, du JavaScript et Tailwind CSS pour le style.
Le site inclut une interface d'administration simple, des pages bilingues, un formulaire d'inscription imprimable et une section actualités.

## Contenu du projet

### Fichiers principaux à la racine
- `index.html` : page d'accueil
- `apropos.html` : page "À propos"
- `enseignements.html` : page des filières et cours
- `admissions.html` : page d'admission et frais
- `vie-scolaire.html` : page vie scolaire et règlement
- `actualites.html` : page d'actualités
- `contact.html` : page de contact avec formulaire
- `formulaire-inscription.html` : formulaire imprimable
- `admin.html` : interface d'administration locale
- `404.html` : page d'erreur 404
- `style.css` : feuille de style globale
- `cabmy.js` : script JavaScript principal
- `input.css` : fichier d'entrée Tailwind CSS
- `output.css` : fichier CSS généré pour le site
- `package.json` : configuration npm et scripts
- `postcss.config.js` : configuration PostCSS
- `tailwind.config.js` : configuration Tailwind CSS

### Dossier `src/`
- `src/css/` : styles spécifiques aux pages
- `src/js/` : scripts JavaScript pour chaque page
- `src/html/` : versions ou sources HTML complémentaires
- `src/input.css` : source CSS Tailwind additionnel

## Technologies utilisées

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- PostCSS
- Autoprefixer

## Installation et développement

### Pré-requis
- Node.js installé
- npm disponible

### Installation

1. Ouvrir un terminal dans le dossier du projet
2. Installer les dépendances :
   ```bash
   npm install
   ```

### Compilation Tailwind
- Générer `output.css` depuis `input.css` :
  ```bash
  npm run build
  ```
- Lancer la compilation en mode surveillance :
  ```bash
  npm run watch
  ```

> Le projet utilise le fichier racine `input.css` comme point d'entrée Tailwind. Le CSS compilé est écrit dans `output.css`.

## Structure des dossiers

```
site-cabmy/
├── cabmy.js
├── index.html
├── input.css
├── output.css
├── package.json
├── postcss.config.js
├── style.css
├── tailwind.config.js
├── README.md
├── images/
│   └── logo/
└── src/
    ├── input.css
    ├── css/
    │   ├── actualites.css
    │   ├── admin.css
    │   ├── admissions.css
    │   ├── apropos.css
    │   ├── contact.css
    │   ├── enseignements.css
    │   ├── global.css
    │   ├── index.css
    │   └── vie-scolaire.css
    ├── html/
    │   ├── 404.html
    │   ├── actualites.html
    │   ├── admin.html
    │   ├── admissions.html
    │   ├── apropos.html
    │   ├── contact.html
    │   ├── enseignements.html
    │   ├── formulaire-inscription.html
    │   └── vie-scolaire.html
    └── js/
        ├── actualites.js
        ├── admin.js
        ├── admissions.js
        ├── apropos.js
        ├── contact.js
        ├── enseignements.js
        ├── global.js
        └── index.js
```

## Personnalisation du site

### Mise à jour du contenu
- Modifier les pages HTML à la racine
- Mettre à jour les textes, les images et les coordonnées de contact
- Actualiser les frais, les calendriers et les informations scolaires

### Modifier le style
- Utiliser `style.css` pour le style global
- Utiliser `src/css/*.css` pour des styles spécifiques aux pages
- Ajouter ou ajuster les classes Tailwind dans `input.css`

### Ajouter des images
- Placer les images dans un dossier `images/` ou un dossier dédié
- Mettre à jour les balises `<img>` dans les pages HTML

## Administration locale

L'interface `admin.html` permet de gérer les articles et les formulaires depuis un navigateur local.

### Accès rapide
- Page d'administration : http://localhost:8000/src/html/admin.html
- Page publique des actualités : http://localhost:8000/src/html/actualites.html

### Authentification admin
L'accès à `admin.html` est protégé par une vraie connexion **Supabase Auth**
(email + mot de passe) — il n'y a plus de mot de passe codé en dur dans le
code source. Avant la première utilisation :

1. Ouvrir le tableau de bord Supabase → **Authentication → Users → Add user**.
2. Créer un compte avec une adresse email réelle et un mot de passe fort.
3. Exécuter `supabase-rls.sql` (voir plus bas) pour activer les règles de
   sécurité qui réservent la lecture/écriture des données sensibles à ce
   compte connecté.
4. Se connecter sur `admin.html` avec cet email/mot de passe.

La session reste active entre deux rafraîchissements de page (gérée par le
SDK Supabase) ; utiliser le bouton *Déconnexion* pour la clôturer.

### Fonctionnement actuel
- Les articles créés dans l'admin sont sauvegardés localement dans le navigateur via `localStorage`.
- La page publique lit ces données pour afficher les articles immédiatement.
- Un proxy local est utilisé pour tenter la synchronisation avec Supabase si des identifiants valides sont fournis.

### Serveur requis
Le site doit être servi via un serveur local HTTP, sinon certaines fonctionnalités de stockage et de navigation ne fonctionnent pas correctement.

### Démarrer les serveurs
Dans le dossier du projet, exécutez :

```bash
python -m http.server 8000
```

Puis démarrez le proxy :

```bash
node supabase-proxy.js
```

Le proxy écoute sur :
- http://localhost:8001/health
- http://localhost:8001/api/articles

Le proxy détient la clé `service_role` (accès complet, contourne RLS) : il
n'accepte par défaut que les requêtes venant de `http://localhost:8000`. Pour
l'utiliser depuis un autre domaine (site déployé), définir la variable
d'environnement `ALLOWED_ORIGINS` (liste séparée par des virgules) avec le(s)
domaine(s) réel(s) avant de lancer `node supabase-proxy.js`.

### Important
- Si Supabase n'est pas configuré avec une vraie clé service role, le proxy reste en mode secours et ne bloque pas l'administration.
- Les données restent accessibles localement pour éviter que l'admin ne cesse de fonctionner.

## Supabase (optionnel)

Ce projet peut aussi être connecté à un backend Supabase pour gérer les actualités, les messages de contact et les pré-inscriptions.

- Projet Supabase recommandé : `site_cabmy.com`
- URL du projet : `https://cqoyhtmowyzvpjdzypgs.supabase.co`
- Clé publique client : `sb_publishable_mG8GhOAiTlu4q4avRhL5Qw_BoOzFn2F`
- Tables SQL utilisées : `articles`, `messages`, `preinscriptions`
- Conserver les clés sensibles hors dépôt Git et dans un gestionnaire de mots de passe ou des variables d'environnement locales

### Configuration des tables Supabase

#### Table `articles`
- `id` : uuid, clé primaire, default `gen_random_uuid()` ou `uuid_generate_v4()` selon la configuration
- `titre` : text
- `cat` : text
- `statut` : text
- `resume` : text
- `contenu` : text
- `emoji` : text
- `mediaType` : text
- `mediaUrl` : text
- `mediaAlt` : text
- `date` : text
- `dateSort` : bigint
- `created_at` : timestamp with time zone, default `now()` (optionnel)

#### Table `messages`
- `id` : uuid, clé primaire, default `gen_random_uuid()` ou `uuid_generate_v4()` 
- `nom` : text
- `telephone` : text
- `email` : text
- `sujet` : text
- `message` : text
- `date` : text
- `dateSort` : bigint
- `created_at` : timestamp with time zone, default `now()`

#### Table `preinscriptions`
- `id` : uuid, clé primaire, default `gen_random_uuid()` ou `uuid_generate_v4()` 
- `nom` : text
- `niveau` : text
- `section` : text
- `tel` : text
- `date` : text
- `dateSort` : bigint
- `created_at` : timestamp with time zone, default `now()`

### SQL pour créer les tables dans Supabase

Copie ces commandes dans l'éditeur SQL du tableau de bord Supabase et exécute-les :

```sql
create extension if not exists "pgcrypto";

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  titre text,
  cat text,
  statut text,
  resume text,
  contenu text,
  emoji text,
  mediaType text,
  mediaUrl text,
  mediaAlt text,
  date text,
  dateSort bigint,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  nom text,
  telephone text,
  email text,
  sujet text,
  message text,
  date text,
  dateSort bigint,
  created_at timestamptz default now()
);

create table if not exists preinscriptions (
  id uuid primary key default gen_random_uuid(),
  nom text,
  niveau text,
  section text,
  tel text,
  date text,
  dateSort bigint,
  created_at timestamptz default now()
);
```

> Je ne peux pas exécuter ces commandes pour toi depuis ici car je n'ai pas d'accès direct à ton projet Supabase.

### Règles de sécurité Supabase

Exécutez `supabase-rls.sql` dans l'éditeur SQL du tableau de bord Supabase.
Il active RLS et crée des politiques strictes :
- `SELECT` public sur `articles` (nécessaire pour la page actualités et le tableau de bord).
- `INSERT` public sur `messages` et `preinscriptions` (formulaires publics), mais **aucune lecture publique**.
- `SELECT`/`DELETE` sur `messages` et `preinscriptions` réservés aux utilisateurs authentifiés (le compte admin).
- Aucune écriture publique sur `articles` : la création/modification/suppression passe uniquement par `supabase-proxy.js`, qui utilise la clé `service_role` côté serveur.

> ⚠️ Ne jamais désactiver RLS en production : sans ces règles, n'importe qui connaissant la clé publique peut lire ou supprimer les messages et pré-inscriptions des familles, ou modifier les articles directement via l'API Supabase.
>
> Le mot de passe administrateur ou les clés secrètes ne doivent jamais être ajoutés en clair dans le code source du projet.

### Important : Utiliser un serveur local pour tester

Les pages HTML avec Supabase **ne fonctionnent pas** si ouvertes directement (protocole `file://`). Vous devez utiliser un serveur local :

**Avec Python 3 :**
```bash
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000` dans le navigateur.

**Avec Node.js (Live Server) :**
```bash
npm install -g live-server
live-server
```

**Avec VS Code :**
- Installer l'extension "Live Server"
- Clic droit sur `index.html` → "Open with Live Server"

## Déploiement

Pour déployer le site sur un hébergement statique :
1. Compiler `output.css` avec `npm run build`
2. Copier les fichiers HTML, CSS, JS et images vers le serveur
3. Vérifier les liens et le formulaire de contact

### Hébergement recommandé
- GitHub Pages
- Netlify
- Vercel
- Hébergeurs classiques (OVH, Hostinger, CamNet)

## Conseils de maintenance

- Faire une sauvegarde régulière du projet
- Mettre à jour le contenu des actualités chaque mois
- Vérifier que les coordonnées de contact sont à jour
- Vérifier que RLS est actif sur les 3 tables Supabase (`supabase-rls.sql` exécuté) avant publication

## Notes importantes

- Le site est statique : aucune logique serveur ou base de données n’est incluse
- Le formulaire de contact devra être connecté à un service externe ou à un backend pour envoyer réellement des messages
- La page `formulaire-inscription.html` est prévue pour impression et téléchargement PDF

## Bonnes pratiques

- Garder `package.json` à jour
- Tester les pages sur mobile et tablette
- Vérifier l’accessibilité des contenus
- Remplacer les placeholders de contact, tarifs et images avant publication
