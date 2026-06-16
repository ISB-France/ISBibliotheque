# 🎯 ISBibliotheque - Portail Applicatif Interne

**Bienvenue sur le projet ISBibliotheque !**

Ce dossier contient le code source complet du portail applicatif web destiné à ISB Group. Il s'agit d'une interface moderne pour découvrir, rechercher et lancer différentes applications métier internes.

---

## 📚 Documentation disponible

Ce projet propose plusieurs niveaux de documentation :

### Pour démarrer rapidement

- **[GUIDE_RAPIDE.md](./GUIDE_RAPIDE.md)** ⚡  
  Installation et lancement en 5 minutes. Parfait pour commencer.

### Documentation complète

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** 📖  
  Guide exhaustif couvrant :
  - Architecture technique
  - Structure du projet
  - Documentation détaillée du code
  - Configuration et déploiement
  - Troubleshooting

### Ressources additionnelles

- **[ATTRIBUTIONS.md](./ATTRIBUTIONS.md)** 📜  
  Liste complète des dépendances et licences

- **[Guidelines.md](./guidelines/Guidelines.md)** 🎨  
  Directives design et branding ISB Group

---

## 🚀 Démarrage rapide

### Installation

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev

# Ouvrir dans le navigateur
# http://localhost:5173/
```

### Déploiement

```bash
# Build pour production
pnpm build

# Avec Docker
docker-compose up -d
```

---

## 📋 Structure du projet

```
.
├── src/
│   ├── main.tsx                 # Point d'entrée
│   ├── app/
│   │   ├── App.tsx              # Composant principal
│   │   └── components/          # Composants réutilisables
│   └── styles/                  # Styles et thèmes
├── vite.config.ts              # Configuration Vite
├── tailwind.config.js           # Config Tailwind
├── package.json                 # Dépendances
├── Dockerfile                   # Image Docker
├── docker-compose.yml           # Orchestration Docker
└── nginx.conf                   # Config Nginx
```

---

## 🛠️ Stack technique

- **React 18.3.1** - Framework frontend
- **TypeScript** - Typage statique
- **Vite 6.3.5** - Bundler haute performance
- **Tailwind CSS 4.1.12** - Framework CSS
- **Radix UI** - Composants accessibles
- **Lucide Icons** - Icônes SVG

---

## ✨ Fonctionnalités

- ✅ Interface recherche et filtrage
- ✅ Grid responsive des applications
- ✅ Modal d'ajout d'applications
- ✅ Menu utilisateur
- ✅ Notifications toast
- ✅ Animations fluides
- ✅ Thème couleurs ISB Group
- ✅ Design accessible

---

## 📱 Applications pré-configurées

12 applications métier dont :

- **Production** : Suivi, Planification, Maintenance
- **Logistique** : Stocks, Expéditions
- **RH** : Gestion des ressources humaines
- **Finance** : Facturation, Achats
- **Qualité** : Contrôle, Documentation
- **IT** : Administration système

---

## 🎨 Branding ISB Group

Palette couleurs:

- 🟫 **Marron foncé** : #3B2800 (primaire)
- 🟨 **Jaune** : #FFDD00 (accent)
- 🟧 **Marron moyen** : #8C6A40 (secondaire)
- ⬜ **Fond** : #FDFAF5 (blanc cassé)

---

## 🐳 Docker

### Build et lancement

```bash
# Build l'image
docker build -t isb-portail:latest .

# Lancer le container
docker run -d -p 80:80 isb-portail:latest

# Avec docker-compose
docker-compose up -d
```

### Vérification

```bash
# Voir les containers
docker ps

# Logs
docker logs isb-portail

# Health check
curl http://localhost/health
```

---

## 📝 Scripts disponibles

```bash
pnpm dev          # Démarrer le serveur de développement
pnpm build        # Build pour production
pnpm preview      # Prévisualiser la build
npm audit         # Vérifier les vulnérabilités
npm update        # Mettre à jour les dépendances
```

---

## 🔒 Sécurité

Configuration sécurisée :

- ✅ Headers de sécurité HTTP
- ✅ Content-Security-Policy
- ✅ CORS configuré
- ✅ Sanitization des inputs
- ✅ HTTPS ready

---

## 🆘 Support

| Question                          | Réponse                                                                            |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| **Comment lancer localement?**    | `pnpm dev` puis ouvrir http://localhost:5173                                       |
| **Où trouver la doc complète?**   | [DOCUMENTATION.md](./DOCUMENTATION.md)                                             |
| **Comment déployer?**             | [DOCUMENTATION.md - Déploiement](./DOCUMENTATION.md#-configuration-et-déploiement) |
| **Quelles sont les dépendances?** | [package.json](./package.json)                                                     |

---

## 📈 Roadmap

- [ ] Intégration API backend
- [ ] Système d'authentification
- [ ] Profils utilisateurs
- [ ] Persistance données
- [ ] Tests unitaires
- [ ] E2E tests
- [ ] Analytics
- [ ] Mobile app

---

## 📄 Licence

Interne ISB Group © 2026

---

## 👨‍💼 Auteur

Développé par : Stagiaire ISB Group  
Date : Juin 2026  
Version : 0.0.1

---

**Besoin d'aide ?** Consultez la [documentation complète](./DOCUMENTATION.md) ou le [guide rapide](./GUIDE_RAPIDE.md).
