# Sophrologie Frontend

Site web pour le cabinet de sophrologie de Stéphanie Habert à Villepreux.

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
│   ├── ContactForm.js   # Formulaire de contact
│   ├── Header.js        # Navigation
│   ├── Footer.js        # Pied de page
│   ├── SEO.js          # Gestion meta tags
│   ├── TestimonialCard.js
│   └── TestimonialForm.js
├── pages/              # Pages Next.js (routing automatique)
│   ├── admin/          # Interface d'administration
│   ├── index.js        # Accueil
│   ├── qui-suis-je.js  # Présentation
│   ├── temoignages.js  # Témoignages
│   ├── contact.js      # Contact
│   ├── tarifs.js       # Tarifs
│   └── rdv.js          # Rendez-vous
├── styles/             # CSS Modules
│   ├── components/     # Styles des composants
│   ├── pages/          # Styles des pages
│   └── globals.css     # Styles globaux
├── utils/
│   └── api.js          # Configuration Axios
└── public/             # Assets statiques
    └── images/
```

## 🌐 Pages du site

| Route | Description | Fonctionnalités |
|-------|-------------|-----------------|
| `/` | Page d'accueil | Présentation sophrologie, bienfaits, CTA |
| `/qui-suis-je` | Présentation | Parcours de Stéphanie Habert |
| `/temoignages` | Témoignages clients | Affichage + formulaire de soumission |
| `/contact` | Contact | Formulaire avec validation |
| `/tarifs` | Tarifs et prestations | Grille tarifaire détaillée |
| `/rdv` | Prise de rendez-vous | Redirection Doctolib |
| `/admin` | Administration | Interface de gestion (login requis) |

## 🧩 Composants clés

### Navigation & Layout
- **Header** : Navigation responsive avec menu mobile
- **Footer** : Informations de contact et liens
- **SEO** : Meta tags dynamiques par page

### Formulaires
- **ContactForm** : Contact avec validation temps réel
- **TestimonialForm** : Soumission témoignages

### Affichage
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
- ✅ Redirection vers Doctolib pour RDV

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