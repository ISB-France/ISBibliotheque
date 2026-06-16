# 📖 Index de la documentation - ISBibliotheque

Bienvenue dans le centre de documentation complet du portail ISBibliotheque.
Ce document vous aide à naviguer vers la documentation qui correspond à vos besoins.

---

## 🎯 Par profil utilisateur

### 👨‍💻 Développeur (frontend/backend)

**Vous voulez :**

- Comprendre le code
- Lancer localement
- Développer une nouvelle feature

**Commencez par :**

1. 📋 [README.md](./README.md) - Vue d'ensemble du projet
2. ⚡ [GUIDE_RAPIDE.md](./GUIDE_RAPIDE.md) - Installation en 5 min
3. 📖 [DOCUMENTATION.md](./DOCUMENTATION.md) - Architecture et code complet

**Sections utiles**

- Code source: `src/app/App.tsx` (composant principal 506 lignes)
- Composants: `src/app/components/`
- Styles: `src/styles/` avec Tailwind CSS

**Scripts utiles**

```bash
pnpm dev        # Lancer localement
pnpm build      # Build production
npm audit       # Vérifier vulnérabilités
```

---

### 👨‍💼 Administrateur système / Responsable IT

**Vous voulez :**

- Déployer le portail sur le serveur
- Configurer Docker/Nginx
- Maintenir en production

**Commencez par :**

1. 📋 [README.md](./README.md) - Vue d'ensemble
2. 🚚 [GUIDE_DEPLOYMENT.md](./GUIDE_DEPLOYMENT.md) - Guide IT détaillé **← ESSENTIEL**
3. 📖 [DOCUMENTATION.md](./DOCUMENTATION.md) - Section "Configuration et déploiement"

**Fichiers essentiels**

- `Dockerfile` - Image Docker
- `docker-compose.yml` - Orchestration Docker **← RECOMMANDÉ**
- `nginx.conf` - Configuration Nginx
- `package.json` - Dépendances

**Commandes clés**

```bash
# Docker Compose (RECO)
docker-compose up -d

# Build manuel
pnpm build
sudo cp -r dist/* /var/www/

# Nginx
sudo systemctl restart nginx
```

---

### 👔 Manager / Product Owner

**Vous voulez :**

- Comprendre le projet à haut niveau
- Voir les features et capacités
- Connaître la roadmap

**Commencez par :**

1. 📋 [README.md](./README.md) - Vue générale
2. 📖 [DOCUMENTATION.md](./DOCUMENTATION.md) - Sections:
   - Vue d'ensemble
   - Caractéristiques principales
   - Architecture technique

**À savoir**

- 12 applications métier pré-configurées
- Design moderne avec palette marron/jaune ISB
- Interface responsive et accessible
- Prêt pour déploiement production

---

### 🎨 Designer / UX

**Vous voulez :**

- Comprendre le design system
- Les couleurs utilisées
- Les composants UI

**Commencez par :**

1. 🎨 [Guidelines.md](./guidelines/Guidelines.md) - Directives design ISB
2. 📖 [DOCUMENTATION.md](./DOCUMENTATION.md) - Section "Structure des couleurs"
3. 📋 [README.md](./README.md) - Section "Branding"

**Palette couleurs clés**

- 🟫 Marron foncé: #3B2800
- 🟨 Jaune accent: #FFDD00
- 🟧 Marron moyen: #8C6A40
- ⬜ Fond: #FDFAF5

---

## 📁 Index complet des fichiers

### 📚 Documentation

| Fichier                      | Audience   | Contenu                  |
| ---------------------------- | ---------- | ------------------------ |
| **README.md**                | Tous       | Vue d'ensemble générale  |
| **GUIDE_RAPIDE.md**          | Dev/Admins | Installation 5 min       |
| **DOCUMENTATION.md**         | Dev/Admins | Documentation exhaustive |
| **GUIDE_DEPLOYMENT.md**      | Admins IT  | Déploiement sur serveur  |
| **ATTRIBUTIONS.md**          | Tous       | Licences et dépendances  |
| **guidelines/Guidelines.md** | Designers  | Directives design        |

### 🔧 Configuration

| Fichier                 | Utilité                    |
| ----------------------- | -------------------------- |
| **vite.config.ts**      | Configuration Vite build   |
| **tailwind.config.js**  | Configuration Tailwind CSS |
| **postcss.config.mjs**  | PostCSS configuration      |
| **package.json**        | Dépendances npm/pnpm       |
| **pnpm-workspace.yaml** | Workspace monorepo         |

### 🐳 Déploiement

| Fichier                | Utilité                  |
| ---------------------- | ------------------------ |
| **Dockerfile**         | Image Docker multi-stage |
| **docker-compose.yml** | Orchestration Docker     |
| **nginx.conf**         | Configuration Nginx      |

### 💻 Code source

| Dossier                    | Description                      |
| -------------------------- | -------------------------------- |
| **src/main.tsx**           | Point d'entrée React             |
| **src/app/App.tsx**        | Composant principal (506 lignes) |
| **src/app/components/**    | Composants réutilisables         |
| **src/styles/**            | CSS et thèmes Tailwind           |
| **src/app/components/ui/** | Composants shadcn/ui             |

---

## 🎯 Quick Links

### Pour démarrer

```
[GUIDE_RAPIDE.md] → Installation locale
           ↓
      pnpm install && pnpm dev
           ↓
   http://localhost:5173/
```

### Pour déployer

```
[GUIDE_DEPLOYMENT.md] → Choix scénario
           ↓
   Docker Compose (reco) OU Nginx
           ↓
  docker-compose up -d
           ↓
  http://votre-serveur/
```

### Pour développer

```
[DOCUMENTATION.md] → Section "Code du projet"
           ↓
  Lire src/app/App.tsx (506 lignes)
           ↓
       Comprendre les composants
           ↓
      Développer votre feature
```

---

## 📊 Carte mentale - Structure du projet

```
ISBibliotheque
│
├── 📑 Documentation
│   ├── README.md (Vue gérale)
│   ├── GUIDE_RAPIDE.md (5 min)
│   ├── DOCUMENTATION.md (Complet)
│   ├── GUIDE_DEPLOYMENT.md (IT)
│   └── ATTRIBUTIONS.md (Licences)
│
├── ⚙️ Configuration
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   └── postcss.config.mjs
│
├── 🐳 Docker & Deployment
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
└── 💻 Code Source
    ├── src/main.tsx (Entry point)
    ├── src/app/App.tsx (Main component)
    ├── src/app/components/
    │   ├── ISBLogo.tsx
    │   ├── AppCard.tsx
    │   ├── AddAppModal.tsx
    │   └── figma/ (Image component)
    ├── src/styles/ (CSS/Tailwind)
    └── src/app/components/ui/ (shadcn/ui)
```

---

## 🔍 Recherche rapide

### "Comment faire X ?"

| Question                       | Réponse                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **Lancer l'app localement?**   | [GUIDE_RAPIDE.md](./GUIDE_RAPIDE.md)                                             |
| **Déployer sur serveur?**      | [GUIDE_DEPLOYMENT.md](./GUIDE_DEPLOYMENT.md)                                     |
| **Comprendre l'architecture?** | [DOCUMENTATION.md](./DOCUMENTATION.md)                                           |
| **Modifier les couleurs?**     | [DOCUMENTATION.md](./DOCUMENTATION.md#-structure-des-couleurs-isb-group)         |
| **Ajouter une app?**           | [DOCUMENTATION.md](./DOCUMENTATION.md#ajouter-une-nouvelle-application)          |
| **Vérifier les dépendances?**  | [ATTRIBUTIONS.md](./ATTRIBUTIONS.md)                                             |
| **Configurer Nginx?**          | [GUIDE_DEPLOYMENT.md](./GUIDE_DEPLOYMENT.md#-scénario-2--déploiement-avec-nginx) |

---

## 📝 Format et conventions utilisés

### 📚 Niveaux de documentation

```
Level 1 (Intro)     : README.md
         ↓
Level 2 (Quick)     : GUIDE_RAPIDE.md
         ↓
Level 3 (Deep)      : DOCUMENTATION.md
         ↓
Level 4 (Specific)  : GUIDE_DEPLOYMENT.md
```

### 🎯 Sections typiques

- **Overview** : Qu'est-ce que c'est
- **Prerequisites** : Ce qu'il faut avant
- **Installation** : Comment installer
- **Usage** : Comment utiliser
- **Configuration** : Comment configurer
- **Troubleshooting** : Résoudre les problèmes

---

## ✅ Checklist - Avant de demander du support

Avez-vous consulté ?

- [ ] README.md pour une vue générale
- [ ] GUIDE_RAPIDE.md pour démarrer
- [ ] DOCUMENTATION.md pour votre cas d'usage
- [ ] Les logs (`docker logs` ou `tail /var/log/nginx/`)
- [ ] La section Troubleshooting appropriée

---

## 🚀 Chemins d'apprentissage recommandés

### Chemin 1 : Je suis développeur, nouveau sur le projet

```
1. README.md (5 min)
2. GUIDE_RAPIDE.md (5 min)
3. pnpm dev (voir le code tourner)
4. DOCUMENTATION.md - sections "App.tsx" et "Composants"
5. Explore le code source
6. Développe une feature
```

### Chemin 2 : Je dois déployer en production

```
1. README.md (5 min)
2. GUIDE_DEPLOYMENT.md (30 min)
3. Choisis: Docker Compose OU Nginx
4. Suis les étapes du guide
5. Teste localement d'abord
6. Déploie progressivement
```

### Chemin 3 : Je dois maintenir l'app

```
1. README.md (5 min)
2. GUIDE_DEPLOYMENT.md - section "Monitoring"
3. DOCUMENTATION.md - section "Maintenance"
4. Configure les logs et alertes
5. Set up des backups
```

---

## 💬 Support et Escalade

**Avant d'escalader**, vérifiez :

1. ✅ J'ai lu la documentation pertinente
2. ✅ J'ai cherché dans Troubleshooting
3. ✅ J'ai vérifié les logs
4. ✅ J'ai recherché l'erreur en ligne
5. ✅ J'ai essayé un redémarrage

**Puis contactez** : support@isb-group.fr

**En fournissant** :

- Le fichier de documentation consulté
- Les logs d'erreur completes
- Les étapes reproduisant le problème
- Votre contexte (dev/prod, Docker/Nginx, etc.)

---

## 📖 Ressources externes

- [React 18 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Version** : 1.0  
**Dernière mise à jour** : Juin 2026  
**Mainteneur** : Équipe ISB Group

**👉 Vous ne savez pas par où commencer ?** → Lisez [README.md](./README.md)
