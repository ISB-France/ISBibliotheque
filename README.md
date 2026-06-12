# 📱 ISBibliotheque - Portail Applicatif Interne ISB Group

**ISBibliotheque** est le portail applicatif centralisé d'**ISB Group**. Il offre aux employés une interface moderne et unique pour découvrir, rechercher et lancer toutes les applications métier internes hébergées sur des serveurs privés.

> **En stage ?** Consultez [doc/Figma/Maquettes/README.md](./doc/Figma/Maquettes/README.md) pour la documentation technique complète du portail.

---

## 🎯 Caractéristiques principales 

| Feature | Description |
|---------|-------------|
| 🔍 **Recherche & Filtrage** | Trouvez rapidement les apps par nom, description ou catégorie |
| 📱 **Interface Responsive** | Fonctionne sur desktop, tablette et mobile |
| 🏷️ **Catégorisation** | 8 catégories (Production, RH, Finance, Logistique, Qualité, IT, etc.) |
| ⚡ **Performance** | Build optimisée avec Vite, SPA React ultra-rapide |
| 🎨 **Design Cohérent** | Palette marron/jaune ISB Group, composants shadcn/ui |
| ➕ **Gestion d'apps** | Ajouter/modifier les applications via interface |
| 👤 **Menu Utilisateur** | Profil, préférences, support intégré |
| 🔔 **Notifications** | Toast feedback lors du lancement d'apps |

---

## 📊 Stack Technologique

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 18.3.1 | Framework frontend |
| **TypeScript** | Latest | Typage statique |
| **Vite** | 6.3.5 | Bundler haute performance |
| **Tailwind CSS** | 4.1.12 | Framework CSS utilitaire |
| **Radix UI** | Multiple | Composants accessibles |
| **Lucide Icons** | 0.487.0 | Icônes SVG |
| **React Router** | 7.13.0 | Routage client-side |
| **Recharts** | 2.15.2 | Graphiques (optionnel) |

---

## 📁 Structure du Projet

```
ISBibliotheque/
├── doc/
│   └── Figma/Maquettes/              # 👈 Portail React (voir /doc/Figma/Maquettes)
│       ├── src/
│       │   ├── app/App.tsx            #    Composant principal
│       │   ├── components/            #    Composants réutilisables
│       │   └── styles/                #    CSS & Tailwind
│       ├── Dockerfile                 #    Image Docker
│       ├── docker-compose.yml         #    Orchestration
│       ├── nginx.conf                 #    Config Nginx
│       ├── vite.config.ts
│       ├── package.json
│       └── [Documentation complète]   # 📚 6 fichiers .md
├── README.md                          # 👈 Ce fichier
└── [autres dossiers du projet]
```

---

## 🚀 Démarrage rapide

### Développement local (5 minutes)

```bash
cd doc/Figma/Maquettes
npm install
npm run dev
# Ouvre http://localhost:5173/
```

### Déploiement Docker (recommandé)

```bash
cd doc/Figma/Maquettes

# Build l'image
docker build -t isb-portail:latest .

# Lancer le container
docker run -d -p 80:80 --name isb-portail isb-portail:latest

# Accédez à http://localhost/
```

### Avec Docker Compose

```bash
cd doc/Figma/Maquettes
docker-compose up -d
# http://localhost/
```

---

## 📚 Documentation Complète

Toute la documentation se trouve dans `doc/Figma/Maquettes/` :

| Document | Audience | Contenu |
|----------|----------|---------|
| **README.md** | Tous | Vue d'ensemble du portail |
| **GUIDE_RAPIDE.md** | Dev/Admins | Installation 5 min |
| **DOCUMENTATION.md** | Dev/Tech | Guide exhaustif (architecture, code, config) |
| **GUIDE_DEPLOYMENT.md** | Admins IT | Déploiement production (Docker, Nginx, SSL) |
| **INDEX.md** | Tous | Navigation & chemins d'apprentissage |
| **ATTRIBUTIONS.md** | Tous | Dépendances & licences |

👉 **Commencez par :** [doc/Figma/Maquettes/INDEX.md](./doc/Figma/Maquettes/INDEX.md)

---

## 🏗️ Applications Pré-configurées

Le portail inclut **12 applications métier** pré-configurées :

### Production (🔥 Rouge)
- Suivi de production
- Planification
- Maintenance

### Logistique (🟧 Orange)
- Gestion des stocks
- Expéditions

### Ressources Humaines (🟤 Marron)
- Gestion RH

### Finance (💰 Rouge)
- Facturation
- Achats

### Qualité (✅ Marron)
- Contrôle qualité
- Base documentaire

### IT (⚙️ Jaune)
- Administration système

### Gestion (📊 Jaune)
- Tableaux de bord

Vous pouvez ajouter vos propres applications via l'interface : `+ Ajouter une application`

---

## 🎨 Branding ISB Group

Palette de couleurs officielle :

| Couleur | Hex | Utilité |
|---------|-----|---------|
| **Marron foncé** | `#3B2800` | Texte principal, backgrounds sombres |
| **Jaune** | `#FFDD00` | Accents, CTA, highlights |
| **Marron moyen** | `#8C6A40` | Texte secondaire, borders |
| **Marron clair** | `#D19571` | Arrière-plans légers |
| **Blanc cassé** | `#FDFAF5` | Fond général |

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev          # Démarrer serveur local
npm run build        # Build production
npm run preview      # Prévisualiser la build

# Docker
docker build -t isb-portail:latest .
docker-compose up -d
docker-compose ps
docker-compose logs -f

# Git
git add doc/Figma/Maquettes
git commit -m "update: ..."
git push origin main
```

---

## ✅ Checklist Pré-déploiement

- [ ] Vérifier que le `.gitignore` exclut `node_modules/`, `dist/`, `.env`
- [ ] Tester locally : `npm run dev` ou `docker-compose up`
- [ ] Build production : `npm run build`
- [ ] Vérifier les logs Docker : `docker logs isb-portail`
- [ ] Configurer les variables d'environnement (`.env`)
- [ ] Valider l'accès réseau interne
- [ ] Tester depuis un autre poste du réseau
- [ ] Configurer HTTPS/SSL si production
- [ ] Mettre en place monitoring/alertes

---

## 📖 Pour Aller Plus Loin

- **Nouveau sur le projet ?** → Consultez [doc/Figma/Maquettes/README.md](./doc/Figma/Maquettes/README.md)
- **Développeur ?** → Lisez [doc/Figma/Maquettes/DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md)
- **Admin IT ?** → Suivez [doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md)
- **Besoin de naviguer ?** → Utilisez [doc/Figma/Maquettes/INDEX.md](./doc/Figma/Maquettes/INDEX.md)

---

## 🤝 Contribution

1. Créez une branche : `git checkout -b feature/ma-feature`
2. Committez vos changements : `git commit -m "feat: description"`
3. Poussez : `git push origin feature/ma-feature`
4. Ouvrez une Pull Request

---

## 📞 Support

| Question | Ressource |
|----------|-----------|
| **Comment lancer l'app ?** | [GUIDE_RAPIDE.md](./doc/Figma/Maquettes/GUIDE_RAPIDE.md) |
| **Comment la déployer ?** | [GUIDE_DEPLOYMENT.md](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md) |
| **Erreur Docker ?** | [GUIDE_DEPLOYMENT.md#troubleshooting](./doc/Figma/Maquettes/GUIDE_DEPLOYMENT.md) |
| **Question sur le code ?** | [DOCUMENTATION.md](./doc/Figma/Maquettes/DOCUMENTATION.md) |
| **Perdu ?** | [INDEX.md](./doc/Figma/Maquettes/INDEX.md) (navigation) |

---

## 📝 License

Interne ISB Group © 2026

---

## 👨‍💼 Auteur

**Développé par :** Stagiaire ISB Group  
**Date :** Juin 2026  
**Version :** 0.0.1  
**Repository :** https://github.com/ISB-France/ISBibliotheque

---

<div align="center">

**🚀 Prêt à lancer le portail ?**

```bash
cd doc/Figma/Maquettes && docker-compose up -d
```

→ Accédez à http://localhost/

</div>
