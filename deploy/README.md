# Déploiement — ISBibliotheque

## Architecture

```
                    Serveur unique
               ┌─────────────────────────┐
               │    Nginx (80/443)       │
               │   reverse proxy         │
               └──┬─────────────────┬────┘
                  │                 │
     portail.isb-group.fr    recette.portail.isb-group.fr
        ┌────────────┐         ┌──────────────┐
        │ :3000      │         │ :3001        │
        │ prod       │         │ recette      │
        └────────────┘         └──────────────┘
```

## Dossiers

| Environnement | Code source | Fichier .env | Branche |
|---|---|---|---|
| Production | `/var/www/isbibliotheque-prod` | `/etc/isbibliotheque/prod.env` | `main` |
| Recette | `/var/www/isbibliotheque-recette` | `/etc/isbibliotheque/recette.env` | `recette` |

## Workflow Git

```
dev ──→ recette ──→ main
  (dev)   (test)    (prod)
```

## Setup serveur

```bash
# 1. Une seule fois
sudo bash /var/www/isbibliotheque-prod/deploy/scripts/setup-server.sh

# 2. Éditer les .env
nano /etc/isbibliotheque/prod.env
nano /etc/isbibliotheque/recette.env
```

## Secrets GitHub requis

| Secret | Description |
|---|---|
| `SSH_HOST` | IP du serveur |
| `SSH_USER` | Utilisateur SSH |
| `SSH_PRIVATE_KEY` | Clé privée SSH |
| `DEPLOY_PATH_PROD` | `/var/www/isbibliotheque-prod` |
| `DEPLOY_PATH_RECETTE` | `/var/www/isbibliotheque-recette` |

## Commandes utiles

```bash
# Logs
docker compose -p isbibliotheque-prod logs -f
docker compose -p isbibliotheque-recette logs -f

# Redémarrer
docker compose -p isbibliotheque-prod restart

# Stopper
docker compose -p isbibliotheque-recette down
```
