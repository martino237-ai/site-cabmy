# CABMY - Site web du Collège Adventiste Bilingue Marathana de Yaoundé

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

L'interface `admin.html` permet de gérer du contenu à distance via Firebase Firestore et de le rendre disponible sur la page `actualites.html`.

Fonctionnalités principales :
- ajout et modification des actualités
- publication de photos ou de vidéos d'actualité
- affichage dynamique des articles publiés sur la page publique
- suppression des articles en ligne

> Le projet nécessite une configuration Firebase valide dans `src/html/admin.html` et `src/html/actualites.html` pour que l'enregistrement en ligne fonctionne correctement.

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
- Remplacer le mot de passe ADMIN par une authentification plus sécurisée avant publication

## Notes importantes

- Le site est statique : aucune logique serveur ou base de données n’est incluse
- Le formulaire de contact devra être connecté à un service externe ou à un backend pour envoyer réellement des messages
- La page `formulaire-inscription.html` est prévue pour impression et téléchargement PDF

## Bonnes pratiques

- Garder `package.json` à jour
- Tester les pages sur mobile et tablette
- Vérifier l’accessibilité des contenus
- Remplacer les placeholders de contact, tarifs et images avant publication
