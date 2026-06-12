# 🏗️ Document d'Architecture — Portail Applicatif Interne ISB

> **Document de cadrage stratégique et technique**  
> Version 1.0 | Juin 2026 | Projet de Stage

---

## 📋 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Objectifs & Périmètre](#-objectifs--périmètre)
3. [Architecture Technique](#-architecture-technique)
4. [Stack Technologique](#-stack-technologique)
5. [Sécurité & Authentification](#-sécurité--authentification)
6. [Infrastructure & Déploiement](#-infrastructure--déploiement)
7. [Design & Interface](#-design--interface)
8. [Bénéfices & Conclusion](#-bénéfices--conclusion)

---

## 🎯 Vue d'ensemble

### Contexte et objectif global

Le projet consiste à développer un **portail applicatif interne** hébergé sur l'infrastructure de l'entreprise, centralisant l'accès à plusieurs applications internes déjà existantes, hébergées sur un autre serveur et exécutées sous forme de services ou conteneurs Docker.

**Finalité** : Fournir aux collaborateurs une interface web unique, simple et sécurisée permettant de :
- ✅ Se connecter avec leur compte Microsoft d'entreprise
- ✅ Visualiser les applications autorisées
- ✅ Lancer l'application souhaitée depuis le portail

### Approche retenue

**Application web interne** plutôt qu'exécutable poste client

| Bénéfice | Impact |
|----------|--------|
| Maintenance centralisée | Évite déploiements machine par machine |
| Mises à jour unitaires | Toutes les instances à jour instantanément |
| Contrôle sécurité | Point unique d'authentification et autorisation |
| Scalabilité | Compatible environnement d'entreprise |

---

## 🎯 Objectifs & Périmètre

### Objectifs fonctionnels

| # | Objectif | Détails |
|---|----------|---------|
| 1 | 🔗 Centralisation | Un point d'entrée unique pour toutes les applications internes |
| 2 | 🔐 Sécurité | Accès via Microsoft Entra ID (OpenID Connect) |
| 3 | 🎨 Présentation | Interface avec icônes/cartes applicatives et descriptions |
| 4 | ⚙️ Orchestration | Lancement contrôlé des services Docker depuis le serveur |
| 5 | 🏢 Infrastructure | Hébergement, administration et déploiement sur serveurs internes |
| 6 | ➕ Administration | Bouton pour ajouter de nouvelles applications (rôles restreints) |
| 7 | 🚀 DevOps | Mono-dépôt GitHub avec CI/CD interne |

### Périmètre fonctionnel

```
[Navigateur]
     ↓
[Portail ISBibliotheque]
     ↓
┌─────────────────────────────┐
│ 1. Authentification Entra ID │ ← Microsoft Entra ID
├─────────────────────────────┤
│ 2. Grille d'applications     │
│    • Icônes                  │
│    • Noms + descriptions     │
│    • Rôle d'accès            │
├─────────────────────────────┤
│ 3. Clic → Vérification droits│ ← Backend (Node.js/Express)
│         → Démarrage service  │ ← Docker / Services
│         → Redirection        │
├─────────────────────────────┤
│ 4. Admin : Ajout d'apps     │ (userRole === "admin")
└─────────────────────────────┘
```

---

## 🏗️ Architecture Technique

### Flux utilisateur (détaillé)

1. 👤 Utilisateur ouvre le portail → Redirection Entra ID
2. 🔓 Authentication validée → Retour avec session sécurisée
3. 📱 Portail affiche apps autorisées (selon rôles/groupes)
4. 🖱️ Clic sur une application
5. ✅ Backend vérifie :
   - Identité utilisateur ✓
   - Droits d'accès ✓
   - Validité de la demande ✓
   - Correspondance app/service Docker ✓
6. 🚀 Backend déclenche démarrage du service
7. 🔄 Utilisateur redirigé vers l'application

### Points clés de sécurité

| Contrainte | Implémentation |
|-----------|-----------------|
| ❌ **Pas de communication directe navigateur → Docker** | ✅ Toutes demandes via backend |
| ❌ **Pas d'authentification interne** | ✅ Microsoft Entra ID (OAuth2/OIDC) |
| ❌ **Pas de droits granulaires côté client** | ✅ Vérification stricte côté serveur |
| ❌ **Pas d'exposition des droits Docker** | ✅ Contrôle d'accès par rôles/groupes |

---

## 💻 Stack Technologique

### Architecture générale

```
┌─────────────────────────────────────────┐
│         COUCHE FRONTEND / PORTAIL       │
│   React 18 + TypeScript + Vite 6.3.5   │
│         Tailwind CSS 4.1.12              │
│    Composants: Radix UI + shadcn/ui    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     COUCHE BACKEND / ORCHESTRATION      │
│      Node.js 18 + Express.js            │
│    MSAL Node (Microsoft Auth)           │
│   Gestion session + vérification droits │
└──────────────┬──────────────────────────┘
               │
┌──────────────┼──────────────────────────┐
│              │                          │
│   Microsoft Entra ID      Docker Engine │
│   (Authentification)      (Services)    │
│                                         │
└─────────────────────────────────────────┘
```

### Détail des composants

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Frontend / Interface** | React + TypeScript | 18.3.1 | Portail web interactif |
| **Bundler** | Vite | 6.3.5 | Build haute performance |
| **Styles** | Tailwind CSS | 4.1.12 | Framework CSS utilitaire |
| **Composants UI** | Radix UI + shadcn | Latest | Accessibilité & composants |
| **Icônes** | Lucide React | 0.487 | Bibliothèque d'icônes SVG |
| **Backend** | Node.js + Express | 18+ | Serveur applicatif principal |
| **Authentification** | Microsoft MSAL Node | Latest | Intégration Entra ID |
| **Services techniques** | Python 3.9+ | 3.9+ | Scripts/services complémentaires |
| **Conteneurisation** | Docker / Compose | Latest | Exécution des services |
| **Versioning** | GitHub | - | Mono-dépôt centralisé |
| **CI/CD** | GitHub Actions + Runner | Latest | Automatisation déploiement |
| **Scripting** | Bash | POSIX | Scripts déploiement/exploitation |

### Justification des choix

✅ **Node.js/Express** : Leadership applicatif, gestion session, routes sécurisées  
✅ **Python** : Services complémentaires, scripts admin, traitements annexes  
✅ **React** : UI reactive, SPA performant, composants réutilisables  
✅ **Vite** : Build ultra-rapide, HMR en dev, output optimisé production  
✅ **Tailwind** : Flexibilité design, charte ISB facile à intégrer  
✅ **Microsoft Entra** : Comptes d'entreprise existants, simplification SSO  
✅ **Docker** : Isolation services, scalabilité, environnement prévisible  

---

## 🔐 Sécurité & Authentification

### Stratégie d'authentification

```
Navigateur                Backend               Entra ID
   │                        │                      │
   ├──── Clic Connexion ────→│                      │
   │                        │─── OAuth2 Flow ─────→│
   │                        │                      │
   │                        │←── Auth Code ────────│
   │                        │                      │
   │←── Redirect + Session ─│                      │
   │                        │                      │
```

**Mécanisme** :
1. OAuth2 Authorization Code Flow
2. MSAL Node gère tokens + refresh
3. Session sécurisée côté serveur
4. Validation à chaque requête sensible

### Gestion des rôles et droits

```
Utilisateur
   │
   ├─ Groupe Microsoft Entra
   │  └─ Rôle (user / admin)
   │     └─ Accès aux apps
   │        └─ Actions autorisées
   │
Backend vérifie à chaque action :
   ✓ Identity
   ✓ Groupe/Rôle
   ✓ Permissions application
   ✓ Validité de l'action
```

### Données sensibles à JAMAIS exposer

| ⚠️ INTERDIT | ✅ FAIRE |
|-----------|---------|
| Clés Docker en frontend | Transiter par backend |
| Tokens Entra ID côté client | Cookies httpOnly + secure |
| URLs internes visibles | Abstraire par le portail |
| Credentials en clair | Variables d'env + secrets |
| Historique actions non loggé | Traçabilité complète côté serveur |

---

## 🚀 Infrastructure & Déploiement

### Architecture du dépôt monoproject

```
ISBibliotheque/
│
├── 📱 doc/Figma/Maquettes/          ← Portail Frontend (React)
│   ├── src/
│   │   ├── app/App.tsx              (Composant principal)
│   │   ├── components/              (Réutilisables)
│   │   └── styles/                  (CSS + Tailwind)
│   ├── Dockerfile                   (Build multi-stage)
│   ├── docker-compose.yml           (Dev + Prod)
│   ├── nginx.conf                   (Configuration serveur)
│   ├── vite.config.ts
│   ├── package.json
│   └── [Documentation complète]
│
├── 🔧 apps/
│   ├── portal-backend/              ← Backend (Node.js/Express)
│   │   ├── src/
│   │   ├── routes/                  (Express routes)
│   │   ├── middleware/              (Auth, logs, etc.)
│   │   ├── docker/
│   │   └── package.json
│   │
│   └── python-services/             ← Services techniques (Python)
│       ├── admin_scripts/
│       ├── docker_manager/
│       └── requirements.txt
│
├── 🏢 infra/
│   ├── docker/
│   │   ├── docker-compose.prod.yml
│   │   └── services/                (Docker services config)
│   ├── scripts/
│   │   ├── deploy.sh
│   │   ├── health-check.sh
│   │   └── backup.sh
│   └── nginx/
│       └── nginx.conf               (Prod reverse proxy)
│
├── 📚 docs/
│   ├── architecture/                ← Ce document
│   ├── design/
│   │   ├── README.md                (Liens Figma)
│   │   └── charte-isb.md
│   └── exploitation/
│       ├── runbook.md
│       └── troubleshooting.md
│
├── 🔄 .github/
│   ├── workflows/
│   │   ├── build-test.yml           (Build du code)
│   │   ├── deploy-staging.yml       (Déploiement staging)
│   │   └── deploy-prod.yml          (Déploiement production)
│   └── WORKFLOW.md                  (Explication workflows)
│
├── 📝 .env.example                  (Variables d'env template)
├── 🐳 docker-compose.dev.yml        (Dev local)
├── 🐳 docker-compose.prod.yml       (Production)
└── README.md                        (Vue générale)
```

### Workflow de déploiement

```
[Push sur main]
       ↓
[GitHub Actions]
   1. Checkout code
   2. Lint + Test
   3. Build images Docker
       ├─ Portail frontend (React)
       ├─ Backend (Node.js)
       └─ Services (Python)
   4. Push images (registry local)
   5. Trigger deployment
       ↓
[Self-Hosted Runner] (réseau interne)
   1. Pull images
   2. docker-compose down (services actuels)
   3. docker-compose up (nouveaux services)
   4. Health checks
   5. Logs + notification
```

### GitHub & SSH Configuration

**Contexte** : Port 22 SSH filtré en environnement interne

**Solution** :
```bash
# ~/.ssh/config
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
```

Validates SSH auth via port 443 (standard HTTPS) au lieu du port 22 (SSH).

---

## 🎨 Design & Interface

### Direction visuelle

Le portail doit être un **lanceur d'applications minimaliste**, pas un back-office complexe.

**Inspirations** :
- Accueil Odoo (tuiles applicatives)
- Launcher iOS/Android (clarté, hiérarchie)
- **Identité propre ISB** (pas de copie)

### Palette couleurs ISB

| Nom | Hex | Utilité |
|-----|-----|---------|
| **Marron foncé** | `#3B2800` | Texte principal, fondamentaux |
| **Jaune accent** | `#FFDD00` | Boutons CTA, highlights |
| **Marron moyen** | `#8C6A40` | Texte secondaire, borders |
| **Marron clair** | `#D19571` | Accents alternatifs |
| **Beige clair** | `#FDD5A5` | Backgrounds légers |
| **Crème** | `#FEEAD3` | Backgrounds secondaires |
| **Orange clair** | `#F08159` | Accents produits |
| **Blanc cassé** | `#FDFAF5` | Fond principal |

### Typographie recommandée

- **Titres** : GT Walsheim Pro Bold / Space Grotesk Bold
- **Corps** : Space Grotesk Regular
- **Accents** : CY Semi Bold

### Composants clés

```
┌─ HEADER ─────────────────────────┐
│ Logo │ Recherche │ Notifications │ User Menu
├─────────────────────────────────┤
│ Titre : "Applications internes" │
│ Catégories : [Toutes] [RH] ...  │
├─────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐     │
│  │ App │  │ App │  │ App │  ... │
│  │ 1   │  │ 2   │  │ (+) │     │
│  └─────┘  └─────┘  └─────┘     │
│                                 │
│  (Grille responsive, 3-5 cols) │
├─────────────────────────────────┤
│ Footer : Links, Version, Support│
└─────────────────────────────────┘
```

### Figma vs GitHub

| Aspect | Outil |
|--------|-------|
| **Maquettes & Design System** | Figma (source de vérité design) |
| **Code & Composants** | GitHub (source de vérité code) |
| **Liaison** | `docs/design/README.md` avec liens Figma |

---

## 📊 Journalisation & Traçabilité

### Événements à tracer (serveur)

| Événement | Données | Exemple d'utilisation |
|-----------|---------|----------------------|
| **Connexion réussie** | User ID, Timestamp, IP | Audit de connexion |
| **Tentative échouée** | User ID, Raison, Timestamp | Détection requête suspecte |
| **Clic sur app** | User ID, App ID, Timestamp | Audit d'usage |
| **Lancement autorisé** | User ID, App ID, Service, Status | Tracer l'orchestration |
| **Lancement refusé** | User ID, App ID, Raison | Audit d'accès |
| **Erreur service** | Service, Error, Stack | Support & debugging |
| **Ajout d'application** | Admin ID, App Details, Timestamp | Audit administratif |

### Format de log structuré

```json
{
  "timestamp": "2026-06-12T12:34:56Z",
  "correlationId": "req-abc123xyz",
  "userId": "user@isb.fr",
  "action": "app_launch",
  "appId": "suivi-production",
  "status": "success",
  "details": {
    "dockerService": "suivi-prod_v2",
    "startupTime": 2500
  },
  "ipAddress": "192.168.x.x",
  "userAgent": "Mozilla/5.0...",
  "severity": "info"
}
```

---

## 🎁 Bénéfices & Conclusion

### Bénéfices métier

✅ **Point d'entrée unique** — Cohérence d'accès, expérience utilisateur simplifié  
✅ **Sécurité centralisée** — Microsoft Entra ID, rôles granulaires, audit complet  
✅ **Facilité administrative** — Ajout d'apps sans redéploiement de postes  
✅ **Scalabilité** — Support d'N applications sans complexité supplémentaire  
✅ **Traçabilité** — Logs structurés pour audit et conformité  

### Bénéfices techniques

✅ **Maintenance simple** — Mises à jour centralisées, évolu continue  
✅ **Architecture propre** — Séparation concerns (frontend/backend/docker)  
✅ **DevOps rationalisé** — CI/CD dans réseau interne, automation complète  
✅ **Base professionalisante** — Code bien structuré, documentation exhaustive  
✅ **Maintenabilité future** — Codebase claire, prête à l'évolution  

### Synthèse

Le projet ISBibliotheque constitue un **portail de lancement d'applications robuste, sécurisé et évolutif**, s'appuyant sur :

- **Frontend modernes** : React 18, Vite, Tailwind, design cohérent ISB
- **Backend sécurisé** : Node.js/Express, Microsoft Entra ID, vérification stricte
- **Infrastructure maîtrisée** : Docker, GitHub, CI/CD interne, self-hosted runners
- **Qualité code** : TypeScript, logging structuré, architecture propre
- **Documentation complète** : Architecture, déploiement, exploitation

Cette base constitue une **fondation solide, professionnelle et crédible** pour un stage productif et évolutif dans un contexte d'entreprise exigeant.

---

<div align="center">

**Documentation d'architecture — ISBibliotheque v1.0**  
*Juin 2026 — Projet de Stage*

</div>

