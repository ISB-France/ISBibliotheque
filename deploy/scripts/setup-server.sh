#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Ce script doit être exécuté en root (sudo)." >&2
  exit 1
fi

# ── 1. Prérequis système ──
apt-get update
apt-get install -y --no-install-recommends \
  docker.io \
  docker-compose-v2 \
  nginx \
  apache2-utils \
  git

systemctl enable --now docker

# ── 2. Création des dossiers ──
mkdir -p /var/www/isbibliotheque-prod
mkdir -p /var/www/isbibliotheque-recette
mkdir -p /etc/isbibliotheque

# ── 3. Clonage du repo (production) ──
if [ ! -d /var/www/isbibliotheque-prod/.git ]; then
  git clone -b main \
    git@github.com:ISB-France/ISBibliotheque.git \
    /var/www/isbibliotheque-prod
fi

# ── 4. Clonage du repo (recette) ──
if [ ! -d /var/www/isbibliotheque-recette/.git ]; then
  git clone -b recette \
    git@github.com:ISB-France/ISBibliotheque.git \
    /var/www/isbibliotheque-recette
fi

# ── 5. Configuration Nginx ──
cp /var/www/isbibliotheque-prod/deploy/nginx/prod.conf    /etc/nginx/sites-available/isbibliotheque
cp /var/www/isbibliotheque-prod/deploy/nginx/recette.conf /etc/nginx/sites-available/recette.isbibliotheque

ln -sf /etc/nginx/sites-available/isbibliotheque          /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/recette.isbibliotheque   /etc/nginx/sites-enabled/

# ── 6. Protection recette ──
htpasswd -cb /etc/nginx/.htpasswd-isbibliotheque-recette admin "changeme-please"

# ── 7. Clé SSH pour GitHub ──
if [ ! -f /root/.ssh/deploy-key-isbibliotheque ]; then
  ssh-keygen -t ed25519 -f /root/.ssh/deploy-key-isbibliotheque -N "" -C "github-actions-deploy-isbibliotheque"
  echo ">>> Ajoute cette clé publique dans Deploy Keys du repo GitHub :"
  cat /root/.ssh/deploy-key-isbibliotheque.pub
fi

# ── 8. Redémarrage Nginx ──
nginx -t && systemctl enable --now nginx

# ── 9. Fichiers .env ──
if [ ! -f /etc/isbibliotheque/prod.env ]; then
  cp /var/www/isbibliotheque-prod/deploy/.env.prod.example /etc/isbibliotheque/prod.env
  echo ">>> Édite /etc/isbibliotheque/prod.env avec tes vraies valeurs"
fi

if [ ! -f /etc/isbibliotheque/recette.env ]; then
  cp /var/www/isbibliotheque-recette/deploy/.env.recette.example /etc/isbibliotheque/recette.env
  echo ">>> Édite /etc/isbibliotheque/recette.env avec tes vraies valeurs"
fi

echo ""
echo "=== Setup terminé ! ==="
echo "1. Édite les fichiers /etc/isbibliotheque/prod.env et /etc/isbibliotheque/recette.env"
echo "2. Ajoute la clé publique dans GitHub Deploy Keys"
echo "3. Ajoute les secrets GitHub (SSH_HOST, SSH_USER, SSH_PRIVATE_KEY, DEPLOY_PATH_PROD, DEPLOY_PATH_RECETTE)"
echo "4. Lance le premier déploiement manuel depuis GitHub Actions"
