# 📱 ISBibliotheque - Portail Applicatif Interne ISB Group

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Structure du projet](#structure-du-projet)
4. [Guide d'installation](#guide-dinstallation)
5. [Lancement de l'application](#lancement-de-lapplication)
6. [Documentation du code](#documentation-du-code)
7. [Configuration et déploiement](#configuration-et-déploiement)
8. [Maintenance et support](#maintenance-et-support)

---

## 🎯 Vue d'ensemble

### Objectif

ISBibliotheque est un **portail applicatif web moderne** conçu pour servir de point d'entrée unique pour tous les employés de ISB Group. Il permet de découvrir, rechercher et lancer rapidement différentes applications métier internes hébergées sur des conteneurs Docker.

### Caractéristiques principales

- ✅ **Interface utilisateur moderne** avec design cohérent et professionnel
- 🔍 **Système de recherche** et filtrage par catégorie
- 📱 **Design responsive** adapté à tous les appareils
- 🎨 **Palette de couleurs unifiée** avec thème ISB Group
- ➕ **Gestion dynamique** des applications avec modal d'ajout
- 👤 **Menu utilisateur** avec informations de profil
- 🔔 **Notifications** intégrées
- 🎯 **Feedback utilisateur** avec animations de lancement

### Public cible

- Employés de ISB Group
- Administrateurs système
- Responsables IT

---

## 🏗️ Architecture technique

### Stack technologique

| Composant        | Version | Utilité                                |
| ---------------- | ------- | -------------------------------------- |
| **React**        | 18.3.1  | Framework frontend                     |
| **TypeScript**   | Latest  | Typage statique                        |
| **Vite**         | 6.3.5   | Bundler et serveur de développement    |
| **Tailwind CSS** | 4.1.12  | Framework CSS utilitaire               |
| **Lucide Icons** | 0.487.0 | Bibliothèque d'icônes                  |
| **React Router** | 7.13.0  | Routage (optionnel dans cette version) |
| **Emotion**      | 11.14+  | CSS-in-JS                              |

### Dépendances principales

#### UI Components (Radix UI)

- Accordions, Dialogs, Dropdowns, Menus, Popovers, Tabs, Tooltips, etc.

#### Fonctionnalités

- **react-hook-form** : Gestion des formulaires
- **recharts** : Graphiques et visualisations
- **react-dnd** : Drag & drop
- **sonner** : Notifications toast
- **date-fns** : Manipulation de dates

#### Styles

- **Tailwind CSS** avec Vite plugin
- **next-themes** : Gestion des thèmes
- **class-variance-authority** : Variant management
- **tailwind-merge** : Fusion intelligente de classes

---

## 📁 Structure du projet

```
src/
├── main.tsx                          # Point d'entrée React
├── app/
│   ├── App.tsx                       # Composant principal (506 lignes)
│   └── components/
│       ├── ISBLogo.tsx               # Logo SVG ISB Group
│       ├── AppCard.tsx               # Composant pour afficher une app
│       ├── AddAppModal.tsx           # Modal pour ajouter une application
│       └── figma/
│           └── ImageWithFallback.tsx # Image avec fallback
│       └── ui/                       # Composants shadcn/ui réutilisables
│           ├── button.tsx
│           ├── card.tsx
│           ├── dialog.tsx
│           ├── form.tsx
│           ├── input.tsx
│           ├── select.tsx
│           ├── tabs.tsx
│           └── [30+ autres composants...]
└── styles/
    ├── index.css                     # Styles globaux
    ├── globals.css                   # Variables globales (vide actuellement)
    ├── fonts.css                     # Polices personnalisées
    ├── tailwind.css                  # Tailwind directives
    └── theme.css                     # Thème couleurs

Configuration files:
├── index.html                        # HTML template
├── vite.config.ts                    # Configuration Vite
├── postcss.config.mjs                # Configuration PostCSS
├── package.json                      # Dépendances et scripts
└── pnpm-workspace.yaml               # Workspace pnpm
```

---

## 🛠️ Guide d'installation

### Prérequis

- **Node.js** : v18.0.0 ou supérieur
- **npm** ou **pnpm** : dernière version
- **Git** : pour le contrôle de version
- Accès au serveur interne de l'entreprise

### Étape 1 : Cloner le repository

```bash
cd /chemin/vers/ISBibliotheque
# Ou se placer dans le dossier Maquettes
cd doc/Figma/Maquettes
```

### Étape 2 : Installer les dépendances

#### Avec pnpm (recommandé)

```bash
pnpm install
```

#### Avec npm

```bash
npm install
```

### Étape 3 : Vérifier l'installation

```bash
# Affiche la version de Node.js
node --version

# Affiche la version de npm/pnpm
npm --version
# ou
pnpm --version
```

---

## 🚀 Lancement de l'application

### Mode développement

```bash
# Démarrer le serveur de développement
pnpm dev
# ou
npm run dev
```

**Résultat attendu :**

```
  VITE v6.3.5  ready in 245 ms
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

L'application sera accessible à `http://localhost:5173/` dans votre navigateur.

### Mode production

#### Option 1 : Build local pour test

```bash
# Construire le bundle de production
pnpm build
# ou
npm run build

# Servir localement pour tester
pnpm preview
```

#### Option 2 : Déploiement sur serveur interne

```bash
# 1. Build l'application pour la production
pnpm build

# 2. Les fichiers de production se trouvent dans le dossier 'dist/'
ls -la dist/

# 3. Copier les fichiers sur le serveur interne
scp -r dist/* utilisateur@serveur-interne:/var/www/isb-portail/

# 4. Ou utiliser rsync
rsync -avz dist/ utilisateur@serveur-interne:/var/www/isb-portail/
```

### Configuration pour Docker

Pour héberger sur un serveur avec Docker :

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Commandes Docker

```bash
# Builder l'image Docker
docker build -t isb-portail:latest .

# Lancer le container
docker run -d -p 80:80 --name isb-portail isb-portail:latest

# Vérifier le statut
docker ps

# Consulter les logs
docker logs isb-portail
```

#### Docker Compose (optionnel)

```bash
# docker-compose.yml
version: '3.8'
services:
  portail:
    build: .
    ports:
      - "80:80"
    restart: always
    environment:
      - API_URL=http://api.isb-group.fr
```

---

## 📚 Documentation du code

### 🎨 Structure des couleurs ISB Group

Palette harmonieuse basée sur des tons marron et jaune :

```typescript
// Couleurs principales
Primary Dark:        #3B2800  (Marron foncé)
Primary Yellow:      #FFDD00  (Jaune)
Secondary Brown:     #8C6A40  (Marron moyen)
Tertiary Brown:      #D19571  (Marron clair)
Background:          #FDFAF5  (Blanc cassé)

// Backgrounds par catégorie
Production:   #FEF0EA (rouge clair)
Logistique:   #FDF3EC (orange clair)
RH:           #FEEAD3 (jaune clair)
Gestion:      #FDD5A5 (jaune plus sombre)
```

### 📱 Composants principaux

#### **App.tsx** (Composant racine - 506 lignes)

Fonction principale : Gérer l'interface globale du portail

**Fonctionnalités :**

```typescript
// État
- apps[]         : Liste des applications affichées
- showModal      : Visibilité du modal d'ajout
- search         : Texte de recherche
- activeCategory : Catégorie sélectionnée
- userMenuOpen   : État du menu utilisateur
- launchedApp    : Nom de l'app en cours de lancement

// Méthodes principales
- filtered()         : Filtre les apps par recherche et catégorie
- handleAddApp()     : Ajoute une nouvelle application
- handleLaunch()     : Simule le lancement avec feedback visuel
```

**Sections :**

1. **Header sticky** : Logo, barre de recherche, notifications, menu utilisateur
2. **Main content** : Titre, bouton CTA, filtres catégorie
3. **Grid d'apps** : Affichage responsif avec AppCard
4. **Footer** : Copyright et liens légaux
5. **Toast de lancement** : Feedback utilisateur temporaire

#### **AppCard.tsx** (49 lignes)

Affiche une application en tant que carte cliquable

```typescript
Props:
- name: string              // Nom de l'application
- description: string       // Description courte
- icon: LucideIcon          // Icône Lucide
- color: string             // Couleur de l'icône
- bgColor: string           // Couleur de fond
- category: string          // Catégorie de l'app
- onClick?: () => void      // Callback au clic

Features:
- Animations au survol (ombres, translation)
- Barre jaune au bas au survol
- Badge de catégorie
- Responsive et accessible
```

#### **AddAppModal.tsx** (123 lignes)

Modal pour ajouter une nouvelle application

```typescript
Props:
- onClose: () => void                                    // Fermer le modal
- onAdd: (app) => void                                   // Ajouter l'app

Champs du formulaire:
- name (requis)      : Nom de l'application
- description        : Description courte
- category (select)  : Choix parmi 8 catégories
- url               : URL de l'application

Comportement:
- Validation du nom (requis)
- Fermeture au clic sur le fond semi-transparent
- Soumission avec feedback visuel
```

#### **ISBLogo.tsx** (14 lignes)

Logo SVG scalable de ISB Group

```typescript
SVG avec:
- Rectangle marron foncé (#3B2800)
- Barre jaune verticale (représente 'I')
- Formes géométriques jaunes (représentent 'S' et 'B')
- Trait divisant (pour équilibre)

Props:
- size?: number (par défaut 36px)
```

### 🎯 Catégories d'applications

```typescript
const ALL_CATEGORIES = [
  'Toutes', // Affiche toutes les apps
  'Gestion', // Tableaux de bord, reporting
  'Production', // Suivi, planification, maintenance
  'RH', // Ressources humaines
  'Finance', // Facturation, achats
  'Qualité', // Contrôle, documentation
  'Logistique', // Stocks, expéditions
  'IT', // Administration système
]
```

### 📊 Applications pré-configurées

```typescript
INITIAL_APPS = [
  // Production (Zap icon, rouge)
  - Suivi de production
  - Planification
  - Maintenance

  // Logistique (Package icon, orange)
  - Gestion des stocks
  - Expéditions

  // RH (Users icon, marron)
  - Ressources humaines

  // Gestion (BarChart icon, jaune)
  - Tableaux de bord

  // Finance (FileText icon, rouge)
  - Facturation
  - Achats

  // Qualité (ShieldCheck icon, marron)
  - Contrôle qualité
  - Base documentaire

  // IT (Settings icon, jaune)
  - Administration IT
]
```

### 🔄 Flux de données

```
App.tsx (root state)
  ↓
  ├→ Header
  │  ├→ ISBLogo
  │  ├→ Search Input (met à jour 'search')
  │  └→ User Menu (toggle 'userMenuOpen')
  │
  ├→ Main Content
  │  ├→ Filtered apps (search + category)
  │  └→ Grid de AppCard
  │       └→ onClick → handleLaunch()
  │
  ├→ AddAppModal
  │  └→ onAdd → handleAddApp() → setApps()
  │
  └→ Footer
```

### ⌨️ Interactions utilisateur

| Action           | Déclencheur               | Résultat                        |
| ---------------- | ------------------------- | ------------------------------- |
| Rechercher       | Input search              | Filtre les apps en temps réel   |
| Filtrer          | Clic catégorie            | Affiche uniquement la catégorie |
| Lancer app       | Clic sur AppCard          | Toast de confirmation 2.5s      |
| Ajouter app      | Clic "+" → Modal → Submit | Nouvelle app dans la liste      |
| Fermer modal     | Clic X ou fond            | Modal disparaît                 |
| Menu utilisateur | Clic avatar               | Menu déroulant                  |

---

## ⚙️ Configuration et déploiement

### Variables d'environnement

À créer à la racine : `.env` (si nécessaire)

```env
# API
VITE_API_URL=http://api.isb-group.fr

# Optional: Analytics
VITE_ANALYTICS_ID=

# Optional: Auth
VITE_AUTH_PROVIDER=
```

### Optimisation pour production

#### 1. Build optimisé

```bash
pnpm build
# Génère dist/ avec assets minifiés
```

#### 2. Analyse de la taille

```bash
pnpm build --debug  # Affiche les détails
```

#### 3. Performance

- Lazy loading des composants (si nécessaire)
- Code splitting automatique avec Vite
- Cache busting avec hashes de fichiers

### Déploiement sur serveur interne

#### Option 1 : Nginx

```nginx
# /etc/nginx/sites-available/isb-portail
server {
    listen 80;
    server_name portail.isb-group.fr;

    root /var/www/isb-portail;
    index index.html;

    # Fallback pour React Router
    location / {
        try_files $uri /index.html;
    }

    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
```

#### Option 2 : Apache

```apache
# .htaccess dans /var/www/isb-portail
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Option 3 : Docker avec Nginx

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Construire et lancer
docker build -t isb-portail:v1.0 .
docker run -d -p 80:80 --name portail isb-portail:v1.0

# Avec docker-compose
docker-compose up -d
```

### Checklist de déploiement

- [ ] Build testé localement
- [ ] Variables d'environnement configurées
- [ ] HTTPS activé sur le serveur
- [ ] CORS configuré si APIs externes
- [ ] Certificats SSL valides
- [ ] Logs activés
- [ ] Monitoring en place
- [ ] Backup/Rollback plan
- [ ] Documentation IT mise à jour

---

## 📖 Maintenance et support

### Commandes utiles

```bash
# Nettoyer les dépendances
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Vérifier les vulnérabilités
npm audit
# ou
pnpm audit

# Mettre à jour les dépendances
npm update
# ou
pnpm update

# Formater le code
npm run lint  # Si configuré
```

### Ajouter une nouvelle application

**Via l'interface :**

1. Cliquer sur le bouton "+ Ajouter une application"
2. Remplir le formulaire
3. Sélectionner la catégorie
4. Soumettre

**Par code (ajouter à INITIAL_APPS) :**

```typescript
{
  id: 13,
  name: "Nouvelle App",
  description: "Description courte",
  icon: Settings,  // Icône Lucide
  color: "#F08159",
  bgColor: "#FEF0EA",
  category: "IT",
}
```

### Personnaliser l'apparence

#### Changer les couleurs

Éditer `src/app/App.tsx` :

```typescript
// ICON_COLORS et styles inline
backgroundColor: "#FDFAF5",  // Nouveau fond
```

#### Ajouter une nouvelle catégorie

```typescript
// Dans App.tsx
const ALL_CATEGORIES = ["Toutes", "MaCategorie", ...];
const ICON_COLORS = {
  "MaCategorie": { color: "#XXX", bgColor: "#YYY" },
  ...
};
const ICON_MAP = {
  "MaCategorie": MonIcone,
  ...
};
```

### Intégration avec les applications backend

Actuellement, les URLs ne sont pas utilisées. Pour l'intégration :

```typescript
// Dans AppCard.tsx
<button
  onClick={() => {
    if (app.url) {
      window.open(app.url, '_blank');  // Ouvre dans nouvel onglet
      handleLaunch(app.name);
    }
  }}
>
```

### Support et documentation pour utilisateurs

Créer une page d'aide :

```typescript
// À ajouter en modal
const HELP_CONTENT = {
  Démarrage: 'Pour lancer une app, cliquez sur sa carte...',
  Recherche: 'Utilisez la barre de recherche pour filtrer...',
  Ajout: 'Seuls les admins peuvent ajouter des apps...',
}
```

### Monitoring et logs

Pour la production, ajouter :

```typescript
// Service de logging
const logEvent = (event: string, data: any) => {
  console.log(`[${new Date().toISOString()}] ${event}`, data)
  // Envoyer à votre service de monitoring
}

// Utilisation
logEvent('APP_LAUNCHED', { name: 'Suivi Production' })
```

### Résolution des problèmes courants

| Problème               | Cause                           | Solution                              |
| ---------------------- | ------------------------------- | ------------------------------------- |
| Port 5173 déjà utilisé | Autre processus utilise le port | `lsof -i :5173` puis `kill -9 <PID>`  |
| Module non trouvé      | Dépendances non installées      | `pnpm install`                        |
| Styles pas appliqués   | Tailwind pas compilé            | `pnpm dev` relance Vite               |
| Problème CORS          | Requête vers API cross-origin   | Configurer CORS sur l'API backend     |
| Build error            | Syntax error TypeScript         | Vérifier `npm run build` pour détails |

---

## 📞 Support technique

- **Issues GitHub** : Signaler des bugs
- **Email** : support@isb-group.fr
- **Documentation** : /doc/Figma/Maquettes/guidelines/Guidelines.md

---

## 📝 Notes de version

### v0.0.1 (Actuelle)

- ✅ Interface de base complète
- ✅ Système de recherche et filtrage
- ✅ Modal d'ajout d'applications
- ✅ Animations et feedback utilisateur
- ✅ Design responsive
- 🔲 Integration API backend
- 🔲 Authentication/Autorisation
- 🔲 Persistance données
- 🔲 Tests unitaires

---

**Dernière mise à jour** : Juin 2026  
**Auteur** : Stagiaire ISB Group  
**Licence** : Interne ISB Group
