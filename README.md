# Sophrologie Frontend

Site web pour le cabinet de sophrologie de Stéphanie Habert à Villepreux.

## 📋 Table des matières

- [🚀 Installation et démarrage](#-installation-et-démarrage)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Démarrage](#démarrage)
- [🛠 Stack technique](#-stack-technique)
- [📁 Structure du projet](#-structure-du-projet)
- [🌐 Pages du site](#-pages-du-site)
- [🧩 Composants clés](#-composants-clés)
  - [Navigation & Layout](#navigation--layout)
  - [Contenu & Interaction](#contenu--interaction)
  - [Formulaires](#formulaires)
  - [Affichage](#affichage)
- [⚙️ Configuration API](#️-configuration-api)
- [🎨 Styling](#-styling)
- [📱 Fonctionnalités](#-fonctionnalités)
  - [Public](#public)
  - [Administration](#administration)
- [🌐 Hébergement](#-hébergement)
  - [Vercel (Recommandé)](#vercel-recommandé)

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 16+)
- Yarn
- Backend API en cours d'exécution

### Installation
```bash
yarn install
```

### Configuration
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Démarrage
```bash
# Développement (port 3001)
yarn dev

# Build de production
yarn build

# Démarrer en production
yarn start

# Générer sitemap (après build)
yarn postbuild
```

## 🛠 Stack technique

- **Framework** : Next.js 15.4.2
- **UI Library** : React 18.2.0
- **HTTP Client** : Axios
- **Authentification** : JWT-decode
- **Icônes** : React-icons
- **SEO** : Next-sitemap
- **Styling** : CSS Modules

## 📁 Structure du projet

```
frontend/
├── components/          # Composants React réutilisables
│   ├── BackgroundMusic.js  # Lecteur de musique de fond
│   ├── ContactForm.js   # Formulaire de contact
│   ├── ContactInfo.js   # Informations de contact
│   ├── Footer.js        # Pied de page
│   ├── Header.js        # Navigation principale
│   ├── Home.js          # Contenu page d'accueil
│   ├── Map.js           # Carte Google Maps
│   ├── Resalib.js       # Widget de réservation
│   ├── SEO.js           # Gestion meta tags
│   ├── TestimonialCard.js  # Carte témoignage
│   └── TestimonialForm.js  # Formulaire témoignage
├── pages/              # Pages Next.js (routing automatique)
│   ├── admin/          # Interface d'administration
│   │   ├── index.js    # Dashboard admin
│   │   └── login.js    # Connexion admin
│   ├── _app.js         # Configuration globale App
│   ├── _document.js    # Document HTML personnalisé
│   ├── charte.js       # Charte éthique
│   ├── contact.js      # Page contact
│   ├── index.js        # Page d'accueil
│   ├── qui-suis-je.js  # Présentation
│   ├── rdv.js          # Prise de rendez-vous
│   ├── tarifs.js       # Tarifs et prestations
│   └── temoignages.js  # Témoignages clients
├── styles/             # CSS Modules
│   ├── components/     # Styles des composants
│   ├── pages/          # Styles des pages
│   └── globals.css     # Styles globaux
├── utils/
│   └── api.js          # Configuration Axios
├── public/             # Assets statiques
    ├── bannieres/      # Images de bannières
    ├── icons/          # Favicons et icônes
    └── logo/           # Logos
    ├── music/          # Musique backgroundMusic
    └── profile/        # Image du profile
```

## 🌐 Pages du site

| Route | Description | Fonctionnalités |
|-------|-------------|-----------------|
| `/` | Page d'accueil | Présentation sophrologie, bienfaits, CTA |
| `/qui-suis-je` | Présentation | Parcours de Stéphanie Habert |
| `/tarifs` | Tarifs et prestations | Grille tarifaire détaillée |
| `/rdv` | Prise de rendez-vous | Redirection Doctolib |
| `/temoignages` | Témoignages clients | Affichage + formulaire de soumission |
| `/contact` | Contact | Formulaire avec validation |
| `/charte` | Charte éthique | Code déontologique |
| `/admin` | Administration | Dashboard de gestion (login requis) |
| `/admin/login` | Connexion admin | Authentification JWT |

## 🧩 Composants clés

### Navigation & Layout
- **Header** : Navigation responsive avec menu mobile
- **Footer** : Informations de contact et liens
- **SEO** : Meta tags dynamiques par page

### Contenu & Interaction
- **Home** : Composant principal de la page d'accueil
- **BackgroundMusic** : Lecteur audio pour ambiance
- **Map** : Intégration Google Maps
- **Resalib** : Widget de réservation en ligne

### Formulaires
- **ContactForm** : Contact avec validation temps réel
- **TestimonialForm** : Soumission témoignages

### Affichage
- **ContactInfo** : bloc d'informations de contact
- **TestimonialCard** : Carte témoignage individuelle

## ⚙️ Configuration API

Le fichier `utils/api.js` configure :
- **Base URL** : Connexion vers le backend
- **Intercepteurs JWT** : Authentification automatique admin
- **Gestion erreurs** : Redirection si token expiré
- **Timeout** : 10 secondes max par requête

## 🎨 Styling

- **CSS Modules** : Styles encapsulés par composant
- **Design responsive** : Mobile-first approach
- **Thème sophrologie** : Couleurs apaisantes et naturelles

## 📱 Fonctionnalités

### Public
- ✅ Site vitrine responsive
- ✅ Formulaire de contact fonctionnel
- ✅ Soumission témoignages avec modération
- ✅ SEO optimisé avec sitemap automatique
- ✅ Widget de réservation Resalib intégré
- ✅ Carte Google Maps interactive
- ✅ Lecteur de musique de fond (page qui-suis-je)

### Administration
- ✅ Authentification sécurisée
- ✅ Gestion des témoignages (validation/suppression)
- ✅ Consultation messages de contact

## 🌐 Hébergement

### Vercel (Recommandé)

Le frontend est optimisé pour un déploiement sur Vercel :

1. **Connecter le repository** à votre compte Vercel
2. **Configurer les variables d'environnement** :
   ```env
   NEXT_PUBLIC_API_URL=https://votre-api-backend.com
   ```
3. **Déploiement automatique** sur chaque push vers la branche main
