# 🏢 ISBibliotheque — Portail Applicatif Interne ISB Group

<div align="center">

**Centralisez l'accès à vos applications internes avec un portail moderne, sécurisé et performant.**

[![License](https://img.shields.io/badge/License-Proprietary-blue)](#license)
[![Version](https://img.shields.io/badge/Version-0.0.1-brightgreen)](#)
[![Stage](https://img.shields.io/badge/Type-Stage_Project-orange)](#)

[🚀 Démarrage rapide](#-démarrage-rapide) • [📚 Documentation](#-documentation-complète) • [🏗️ Architecture](#-architecture) • [💻 Dev](#-développement) • [📞 Support](#-support)

</div>

---

## 📌 À Propos

**ISBibliotheque** est un **portail applicatif interne** qui fournit aux collaborateurs d'ISB Group une **interface unique et sécurisée** pour :

✅ **Découvrir** les applications métier disponibles  
✅ **Rechercher** par nom, catégorie ou description  
✅ **Accéder** avec authentification Microsoft Entra ID  
✅ **Lancer** d'un simple clic, orchestration serveur sécurisée  
✅ **Administrer** (rôles restreints) les applications disponibles  

**En stage ?** → Consultez [📖 Documentation](./doc/Figma/Maquettes/README.md) | **Architecte ?** → Lire [🏗️ Cadrage](./doc/DOC_ARCHITECTURE_ISBibliotheque.md)

---

## 🎯 Objectifs du Projet

| # | Objectif | Statut |
|---|----------|--------|
| 1️⃣ | Centraliser l'accès aux applications internes | ✅ Réalisé |
| 2️⃣ | Interface responsive moderne (React 18) | ✅ Réalisé |
| 3️⃣ | Sécurité via Microsoft Entra ID | 🔄 À implémenter (backend) |
| 4️⃣ | Orchestration Docker côté serveur | 🔄 À implémenter (backend) |
| 5️⃣ | Gestion des rôles et autorisations | 🔄 À implémenter (backend) |
| 6️⃣ | Déploiement sur infra interne | ✅ Dockerisé |
| 7️⃣ | CI/CD avec GitHub Actions | 🔄 À configurer |

---

## 🚀 Démarrage Rapide

### 1️⃣ Lancer localement (5 min) ⚡

```bash
# Cloner et naviguer
git clone git@github.com:ISB-France/ISBibliotheque.git
cd ISBibliotheque/doc/Figma/Maquettes

# Installer et démarrer
npm install          # ou: pnpm install
npm run dev          # ou: pnpm dev

# 🌐 Ouvrir http://localhost:5173/
```

### 2️⃣ Avec Docker (5 min) 🐳

```bash
cd ISBibliotheque/doc/Figma/Maquettes

# Builder l'image
docker build -t isb-portail:latest .

# Lancer le container
docker run -d -p 80:80 --name isb-portail isb-portail:latest

# 🌐 Ouvrir http://localhost/
```

### 3️⃣ Avec Docker Compose (recommandé) ✨

```bash
cd ISBibliotheque/doc/Figma/Maquettes
docker-compose up -d

# Vérifier
docker-compose ps

# 🌐 Ouvrir http://localhost/
```

---

## 📊 Stack Technologique

### Frontend / Portail

| Technologie | Version | Utilité |
|---|---|---|
| **React** | 18.3.1 | Framework UI |
| **TypeScript** | Latest | Typage statique |
| **Vite** | 6.3.5 | Bundler haute perf |
| **Tailwind CSS** | 4.1.12 | Framework CSS |
| **Radix UI** | Latest | Composants accessibles |
| **Lucide Icons** | 0.487 | Icônes SVG |

### Déploiement & Infrastructure

| Composant | Technologie | Usage |
|---|---|---|
| **Containerisation** | Docker / Docker Compose | Isolation + scalabilité |
| **Serveur Web** | Nginx (Alpine) | Reverse proxy + SPA routing |
| **Versioning** | GitHub | Mono-dépôt centralisé |
| **CI/CD** | GitHub Actions | Automatisation déploiement |

### À venir (Backend)

- Node.js 18 + Express (orchestration)
- Microsoft MSAL (authentification)
- Docker SDK (gestion services)
- Logging structuré (traçabilité)

---

## 🏗️ Architecture

### Vue d'ensemble

```
┌─────────────────────────────┐
│   Utilisateur Navigateur    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│  Portail React (Frontend)   │
│  Grille + Recherche + Auth  │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────────────────┐
│                Backend                  │
│  (Node.js/Express - À implémenter)     │
│  • Vérification identité                │
│  • Contrôle d'accès                     │
│  • Orchestration Docker                 │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼────┐  ┌────────▼──────┐
│ Entra ID  │  │ Docker Engine  │
│(Auth)     │  │(Applications)  │
└───────────┘  └────────────────┘
```

### Structure du dépôt

```
ISBibliotheque/
│
├── 📱 doc/
│   ├── Figma/Maquettes/         ← Frontend React (Portail)
│   │   ├── src/
│   │   │   ├── app/App.tsx      (Composant racine)
│   │   │   ├── components/      (Réutilisables)
│   │   │   └── styles/          (CSS + Tailwind)
│   │   ├── Dockerfile           (Multi-stage)
│   │   ├── docker-compose.yml   (Dev + Prod)
│   │   ├── nginx.conf           (Reverse proxy)
│   │   └── [Docs]               (6 fichiers .md)
│   │
│   └── DOC_ARCHITECTURE_ISBibliotheque.md
│       (Cadrage stratégique & technique)
│
├── 📝 README.md                 ← Ce fichier
├── 📝 .gitignore               
└── 🔄 .github/workflows/        (À configurer)
```

**📌 Note** : Le backend et les services Python seront ajoutés dans `apps/` lors de la phase 2.

---

## ✨ Fonctionnalités

### Côté Utilisateur

| Feature | Description | Status |
|---------|-------------|--------|
| 🔍 **Recherche** | Filtrer apps par nom/description | ✅ |
| 🏷️ **Catégories** | 8 catégories (Production, RH, Finance, etc.) | ✅ |
| 📱 **Responsive** | Desktop, tablette, mobile | ✅ |
| 👤 **Menu User** | Profil, préférences, support | ✅ |
| 🔔 **Notifications** | Toast au lancement d'app | ✅ |
| 🎨 **Design ISB** | Palette marron/jaune officielle | ✅ |

### Côté Administration

| Feature | Description | Status |
|---------|-------------|--------|
| ➕ **Ajouter App** | Interface d'ajout (rôles restreints) | ✅ |
| 🔐 **Contrôle d'Accès** | Vérification droits backend | 🔄 |
| 📊 **Audit Logs** | Traçabilité des actions | 🔄 |
| 🚀 **Orchestration** | Démarrage/arrêt services Docker | 🔄 |

---

## 📚 Documentation Complète

Tous les guides se trouvent dans **`doc/Figma/Maquettes/`** :

### Pour commencer

📖 **[README.md](./doc/Figma/Maquettes/README.md)**  
Vue générale du portail, features et branding.

⚡ **[GUIDE_RAPIDE.md](./doc/Figma/Maquettes/GUIDE_RAPIDE.md)**  
Installation 5 min (dev local, Docker, dépannage).

### Pour les développeurs

📘 **[DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md)** ⭐ **LE PLUS COMPLET**  
Architecture complète, composants, code détaillé, configuration, déploiement.

🗺️ **[INDEX.md](./doc/Figma/Maquettes/INDEX.md)**  
Navigation par profil (dev, admin, manager, designer).

### Pour les administrateurs

🚀 **[GUIDE_DEPLOYMENT.md](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md)** ⭐ **POUR ADMINS IT**  
Déploiement production (Docker, Nginx, SSL, monitoring, troubleshooting).

### Ressources

📋 **[ATTRIBUTIONS.md](./doc/Figma/Maquettes/ATTRIBUTIONS.md)**  
Dépendances et licences open source.

🏗️ **[DOC_ARCHITECTURE_ISBibliotheque.md](./doc/DOC_ARCHITECTURE_ISBibliotheque.md)**  
Cadrage stratégique, objectifs, stack tech, sécurité, infrastructure.

---

## 💻 Développement

### Stack locale

- Node.js 18+
- npm ou pnpm
- Docker & Docker Compose
- Git + SSH

### Commandes principales

```bash
# Installation
npm install

# Développement
npm run dev          # Serveur local avec HMR
npm run build        # Build production
npm run preview      # Prévisualiser build

# Docker
docker build -t isb-portail:latest .
docker-compose up -d
docker-compose logs -f

# Git (SSH recommandé)
git clone git@github.com:ISB-France/ISBibliotheque.git
git checkout -b feature/ma-feature
git commit -m "feat: description"
git push origin feature/ma-feature
```

### Structure du code Frontend

```
src/
├── main.tsx              # Point d'entrée React
├── app/
│   ├── App.tsx          # Composant racine (506 lignes) ⭐
│   └── components/
│       ├── ISBLogo.tsx   # Logo SVG
│       ├── AppCard.tsx   # Tuile application
│       ├── AddAppModal.tsx # Modal ajout
│       └── figma/
│           └── ImageWithFallback.tsx
│       └── ui/           # shadcn/ui components (30+)
└── styles/
    ├── index.css        # Global
    ├── globals.css      # Variables CSS
    ├── fonts.css        # Polices
    ├── tailwind.css     # Tailwind directives
    └── theme.css        # Thème ISB
```

---

## 🎨 Design & Branding ISB

### Palette officielle

| Couleur | Hex | Usage |
|---------|-----|-------|
| 🟫 **Marron foncé** | `#3B2800` | Texte principal, fondamentaux |
| 🟨 **Jaune** | `#FFDD00` | Boutons CTA, accents |
| 🟧 **Marron moyen** | `#8C6A40` | Texte secondaire, borders |
| 🟩 **Marron clair** | `#D19571` | Arrière-plans légers |
| ⬜ **Blanc cassé** | `#FDFAF5` | Fond principal |

### Applications pré-configurées (12)

**Production** → Suivi production, Planification, Maintenance  
**Logistique** → Gestion stocks, Expéditions  
**RH** → Gestion ressources humaines  
**Finance** → Facturation, Achats  
**Qualité** → Contrôle qualité, Base documentaire  
**IT** → Administration système  
**Gestion** → Tableaux de bord

---

## ✅ Checklist Avant Production

- [ ] Lancer localement : `npm run build && npm run preview`
- [ ] Build Docker : `docker build -t isb-portail:latest .`
- [ ] Tester container : `docker run -d -p 8080:80 isb-portail:latest`
- [ ] Vérifier `.gitignore` : `node_modules`, `dist`, `.env`
- [ ] Variables d'environnement : `.env.example` rempli
- [ ] HTTPS/SSL : certificats configurés
- [ ] Networking : accès réseau interne validé
- [ ] Monitoring : alertes en place
- [ ] Documentation : mise à jour complète
- [ ] Équipe notifiée : runbook partagé

---

## 📖 Chemins d'apprentissage

### 🎓 Je suis nouveau

1. Lire [README.md](./doc/Figma/Maquettes/README.md) (10 min)
2. Lancer local : `npm run dev` (5 min)
3. Explorer le code source (30 min)
4. Lire [DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md) (1h)

### 👨‍💻 Je suis développeur

1. [GUIDE_RAPIDE.md](./doc/Figma/Maquettes/GUIDE_RAPIDE.md) (5 min)
2. `npm run dev` et explorer (30 min)
3. [DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md) sections "Code du projet"
4. Développer votre feature
5. Tester & committer

### 🔧 Je suis admin IT

1. [README.md](./doc/Figma/Maquettes/README.md) (10 min)
2. [GUIDE_DEPLOYMENT.md](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md) **← ESSENTIEL** (1h)
3. Choisir : Docker Compose ou Nginx
4. Suivre les étapes du guide
5. Configurer monitoring & backups

---

## 🤝 Contribution

**Workflow Git** :

```bash
# 1. Créer une branche
git checkout -b feature/my-feature

# 2. Développer et committer (commits atomiques)
git commit -m "feat: add search functionality"

# 3. Tester localement
npm run dev
docker-compose up -d  # tester aussi en Docker

# 4. Pousser
git push origin feature/my-feature

# 5. Ouvrir une Pull Request sur GitHub
#    (description claire, tests inclus)
```

**Recommandations** :
- Commits atomiques et descriptifs
- Branches par feature
- Tests avant PR
- Documentation à jour

---

## 📞 Support

### Q&A Rapide

| ❓ Question | 📖 Ressource |
|-----------|-----------|
| Comment démarrer ? | [GUIDE_RAPIDE.md](./doc/Figma/Maquettes/GUIDE_RAPIDE.md) |
| Comment développer ? | [DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md) |
| Comment déployer ? | [GUIDE_DEPLOYMENT.md](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md) |
| Erreur Docker ? | [Troubleshooting](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md) |
| Navigation ? | [INDEX.md](./doc/Figma/Maquettes/INDEX.md) |
| Architecture ? | [DOC_ARCHITECTURE](./doc/DOC_ARCHITECTURE_ISBibliotheque.md) |

### Email

📧 **Support technique** : support@isb-group.fr

---

## 📝 License & Notes Légales

**Licence** : Propriétaire ISB Group © 2026  
**Confidentialité** : Interne uniquement  
**Authentification** : Microsoft Entra ID (comptes ISB)  
**Hébergement** : Infrastructure interne ISB uniquement  

---

## 👨‍💼 À Propos

| Aspect | Détail |
|--------|--------|
| **Projet** | Portail applicatif interne ISB |
| **Type** | Projet de Stage (professionnalisant) |
| **Développé par** | Stagiaire ISB Group |
| **Version** | 0.0.1 (v1 stable) |
| **Date** | Juin 2026 |
| **Repository** | https://github.com/ISB-France/ISBibliotheque |
| **Branche Active** | `doc` (phase 1) → `main` (merge) |

---

<div align="center">

## 🚀 Prêt à démarrer ?

**Option 1 - Développement Local** (le plus rapide)
```bash
cd doc/Figma/Maquettes && npm install && npm run dev
```

**Option 2 - Docker** (recommandé pour production)
```bash
cd doc/Figma/Maquettes && docker-compose up -d
```

→ Accédez à **[http://localhost](http://localhost/)** ou **[http://localhost:5173](http://localhost:5173)**

---

**Questions ?** Consultez [📚 Documentation](#-documentation-complète) ou sur [GitHub Issues](https://github.com/ISB-France/ISBibliotheque/issues)

**Bon développement ! 🎉**

</div>

