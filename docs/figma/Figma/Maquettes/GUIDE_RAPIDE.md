# ⚡ Guide de démarrage rapide - ISBibliotheque

## Pour les développeurs

### Installation minimale (5 minutes)

```bash
# 1. Aller dans le dossier projet
cd doc/Figma/Maquettes

# 2. Installer les dépendances
pnpm install
# ou npm install

# 3. Démarrer le serveur
pnpm dev
# ou npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:5173/
```

**Fin!** L'app tourne maintenant localement.

---

## Pour les admins - Déploiement rapide

### Sur Docker (recommandé)

```bash
# 1. Build
docker build -t isb-portail:latest .

# 2. Run
docker run -d -p 80:80 --name portail isb-portail:latest

# 3. Vérifier
curl http://localhost
```

**URL d'accès** : `http://votre-serveur/`

### Sur Nginx

```bash
# 1. Build
cd doc/Figma/Maquettes
pnpm build

# 2. Copier
sudo cp -r dist/* /var/www/html/

# 3. Redémarrer
sudo systemctl restart nginx
```

**URL d'accès** : `http://votre-serveur/`

---

## 📱 Fonctionnalités principales

| Fonction        | Comment utiliser                                    |
| --------------- | --------------------------------------------------- |
| **Rechercher**  | Tapez dans la barre "Rechercher une application..." |
| **Filtrer**     | Cliquez sur une catégorie en haut                   |
| **Lancer app**  | Cliquez sur la carte de l'application               |
| **Ajouter app** | Clik + → Remplissez le formulaire                   |
| **Profile**     | Cliquez sur votre avatar en haut à droite           |

---

## 🐛 Troubleshooting

| Erreur                     | Solution                          |
| -------------------------- | --------------------------------- |
| `Port 5173 already in use` | `lsof -i :5173` + `kill -9 <PID>` |
| `Module not found`         | `pnpm install`                    |
| `Styles not working`       | Redémarrez avec `pnpm dev`        |

---

## 📚 Ressources

- **Documentation complète** : `DOCUMENTATION.md`
- **Code source** : `src/app/App.tsx`
- **Dépendances** : `package.json`
