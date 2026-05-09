# 📘 Guide d'utilisation – Site Web CABMY
## Collège Adventiste Bilingue Marathana de Yaoundé

---

## 📂 Structure du site (fichiers)

```
cabmy/
├── index.html                  ← Page d'accueil principale
├── apropos.html                ← À propos, historique, direction
├── enseignements.html          ← Sections franco / anglo / cours du soir
├── admissions.html             ← Conditions, frais, calendrier, tenues
├── vie-scolaire.html           ← Règlement, activités, pastorale
├── actualites.html             ← Liste des articles / actualités
├── contact.html                ← Formulaire de contact + plan
├── formulaire-inscription.html ← Formulaire d'inscription imprimable (PDF)
├── admin.html                  ← Interface d'administration
├── 404.html                    ← Page d'erreur 404
├── style.css                   ← Feuille de style partagée
├── cabmy.js                    ← Scripts partagés
└── README.md                   ← Ce fichier
```

---

## 🚀 Mise en ligne du site

### Option 1 : Hébergement simple (recommandé pour démarrer)
1. Compresser tous les fichiers en .zip
2. Uploader sur un hébergeur : **InfinityFree** (gratuit), **Hostinger**, **OVH**, ou **CamNet**
3. Pointer le domaine vers le répertoire

### Option 2 : Hébergement professionnel
- Domaine suggéré : `cabmy.cm` ou `cabmy.org`
- Hébergeur recommandé au Cameroun : **Camtel**, **Orange CI**, **MTN**

---

## ✏️ Personnalisations à faire AVANT la mise en ligne

### 1. Numéro de téléphone
Remplacer **tous les** `+237 600 000 000` par le vrai numéro.
Fichiers concernés : `index.html`, `apropos.html`, `enseignements.html`, `admissions.html`, `vie-scolaire.html`, `actualites.html`, `contact.html`, `formulaire-inscription.html`

### 2. Email de contact
Remplacer `contact@cabmy.cm` par le vrai email.

### 3. Frais de scolarité
Dans `admissions.html`, chercher `XX 000 FCFA` et remplir les vrais montants.
Vous pouvez aussi le faire via l'interface admin : `admin.html` → section "Frais de scolarité".

### 4. Photos
Les emojis (🎓, ⛪, etc.) sont des placeholders. Pour ajouter de vraies photos :
```html
<!-- Remplacer ceci -->
<div class="h-48 flex items-center justify-center text-4xl" style="...">🏅</div>

<!-- Par ceci -->
<img src="photos/bepc2024.jpg" alt="BEPC 2024" class="h-48 w-full object-cover">
```
Créer un dossier `photos/` dans le répertoire du site.

### 5. Logo officiel
Remplacer l'initiale `CA` dans les cercles par votre logo :
```html
<!-- Remplacer -->
<span style="font-family:'Playfair Display',serif">CA</span>

<!-- Par -->
<img src="logo.png" alt="CABMY" class="w-10 h-10 object-contain">
```

### 6. Plan Google Maps
Dans `contact.html`, remplacer les coordonnées dans l'iframe Google Maps :
```
3.8480 → latitude exacte de l'école
11.5126 → longitude exacte de l'école
```

---

## 🔐 Interface d'administration (admin.html)

### Connexion
- **URL** : `votre-site.cm/admin.html`
- **Identifiant** : `admin`
- **Mot de passe** : `cabmy2024` ← **À CHANGER AVANT MISE EN LIGNE**

### Fonctionnalités
| Section | Ce que vous pouvez faire |
|---------|--------------------------|
| Tableau de bord | Vue d'ensemble des stats |
| Actualités | Créer, modifier, supprimer des articles |
| Frais de scolarité | Mettre à jour les montants |
| Messages reçus | Voir les messages du formulaire de contact |
| Pré-inscriptions | Voir + exporter les pré-inscriptions (CSV) |

> ⚠️ **Note** : L'admin utilise le localStorage du navigateur. Pour une vraie base de données, il faudra un hébergement avec PHP/MySQL ou Firebase.

---

## 🌐 Bilinguisme (FR/EN)

Le site est entièrement bilingue. La langue est mémorisée dans le navigateur.

Pour ajouter une traduction manquante :
```html
<!-- Ajouter les attributs data-fr et data-en -->
<p data-fr="Texte en français" data-en="Text in English">Texte en français</p>
```

---

## 📰 Gestion des actualités

### Via l'interface admin (recommandé)
1. Aller sur `admin.html`
2. Se connecter
3. Cliquer "Nouvel article"
4. Remplir titre, catégorie, résumé, contenu
5. Publier

### Catégories disponibles
- 📊 Résultats
- 🏫 Vie du collège
- ⛪ Spiritualité
- 🌙 Cours du soir

---

## 🖨️ Formulaire d'inscription imprimable

La page `formulaire-inscription.html` est optimisée pour l'impression :
1. Ouvrir la page
2. Cliquer "Imprimer / Télécharger PDF"
3. Dans la boîte de dialogue, choisir "Enregistrer en PDF"

Le formulaire peut aussi être rempli à l'écran puis imprimé.

---

## 📱 Compatibilité

| Navigateur | Compatible |
|-----------|-----------|
| Chrome / Edge | ✅ Parfait |
| Firefox | ✅ Parfait |
| Safari (iOS) | ✅ Bon |
| Opera Mini | ⚠️ Basique |

| Écran | Compatible |
|-------|-----------|
| Ordinateur (1200px+) | ✅ |
| Tablette (768px+) | ✅ |
| Mobile (320px+) | ✅ |

---

## 🎨 Couleurs du site

| Couleur | Code HEX | Usage |
|---------|----------|-------|
| Bleu principal | `#1a3a6b` | Titres, boutons, fond nav |
| Bleu moyen | `#2952a3` | Dégradés |
| Or/Gold | `#c9a84c` | Accents, boutons CTA |
| Fond clair | `#e8eef8` | Sections alternées |
| Fond sombre | `#0f1f3d` | Footer, hero |

---

## 🔧 Maintenance recommandée

| Tâche | Fréquence | Responsable |
|-------|-----------|-------------|
| Ajouter une actualité | 1-2x/mois | Assistante admin |
| Mettre à jour les frais | Début d'année | Gestionnaire (EBA Marie) |
| Vérifier les formulaires | Chaque semaine | Secrétariat |
| Sauvegarder les fichiers | 1x/semaine | Webmaster |
| Modifier le calendrier | Début d'année | Webmaster |

---

## 📞 Support technique

Pour toute question technique sur le site, contacter le webmaster en charge.

---

*Document créé pour le Collège Adventiste Bilingue Marathana de Yaoundé (CABMY)*  
*Devise : TRAVAIL – DISCIPLINE – SUCCÈS*
