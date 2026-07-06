# 👨‍💼 Guide d'intégration système - ISBibliotheque

> **Audience** : Administrateurs système et responsables IT  
> **Objectif** : Déployer le portail ISBibliotheque sur serveur interne

---

## 📋 Prérequis système

### Serveur

- OS : Linux (Ubuntu 20.04+ ou CentOS 8+) recommandé
- CPU : 2+ cores
- RAM : 2GB minimum (4GB recommandé)
- Disque : 10GB minimum
- Réseau : Connectivité interne ISB Group

### Logiciels

- Docker & Docker Compose (recommandé)
- OU Node.js 18+ + npm/pnpm
- OU Nginx + Git

### Accès

- Accès root/sudo sur le serveur
- Accès à Git pour cloner le repository
- Accès au registre Docker interne (si applicable)

---

## 🚀 Scénario 1 : Déploiement avec Docker Compose (RECOMMANDÉ)

### Étape 1 : Vérifier Docker

```bash
# Vérifier Docker
docker --version
# Docker version 20.10+

# Vérifier Docker Compose
docker-compose --version
# Docker Compose version 1.29+

# Vérifier que Docker daemon fonctionne
sudo systemctl status docker
```

### Étape 2 : Cloner le repository

```bash
# Créer le répertoire de services
sudo mkdir -p /srv/isb-services
cd /srv/isb-services

# Cloner le repo (à adapter à votre git interne)
sudo git clone https://git.isb-group.fr/applications/portail.git
cd portail/doc/Figma/Maquettes
```

### Étape 3 : Lancer avec Docker Compose

```bash
# Lancer les container
sudo docker-compose up -d

# Vérifier le statut
sudo docker-compose ps

# ✅ Status doit être "running"
```

### Étape 4 : Vérifier l'accès

```bash
# Test local
curl http://localhost

# Depuis un autre poste
curl http://IP_SERVEUR

# Vérifier le health
curl http://IP_SERVEUR/health
# Répond : "healthy"
```

### Étape 5 : Configurer le DNS (optionnel)

```bash
# Ajouter dans /etc/hosts ou DNS interne
192.168.X.X  portail.isb-group.fr
```

**Accès final** : http://portail.isb-group.fr

---

## 🚀 Scénario 2 : Déploiement avec Nginx

### Étape 1 : Installer les dépendances

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nodejs npm nginx git

# Vérifier les versions
node --version   # v18+
npm --version
nginx -v
```

### Étape 2 : Cloner et builder

```bash
# Cloner le repo
cd /tmp
git clone https://git.isb-group.fr/applications/portail.git
cd portail/doc/Figma/Maquettes

# Installer les dépendances
npm install

# Ou avec pnpm
npm install -g pnpm
pnpm install

# Builder la version production
npm run build
# Génère le dossier 'dist/'
```

### Étape 3 : Déployer les fichiers

```bash
# Créer le répertoire web
sudo mkdir -p /var/www/isb-portail

# Copier les fichiers buildés
sudo cp -r dist/* /var/www/isb-portail/

# Configurer les permissions
sudo chown -R www-data:www-data /var/www/isb-portail
sudo chmod -R 755 /var/www/isb-portail
```

### Étape 4 : Configurer Nginx

```bash
# Créer la configuration
sudo nano /etc/nginx/sites-available/isb-portail
```

Coller la configuration suivante :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name portail.isb-group.fr;

    # Redirection HTTPS (optionnel si SSL)
    # return 301 https://$server_name$request_uri;

    root /var/www/isb-portail;
    index index.html;

    # Logging
    access_log /var/log/nginx/isb-portail-access.log;
    error_log /var/log/nginx/isb-portail-error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "ok\n";
    }
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/isb-portail \
    /etc/nginx/sites-enabled/isb-portail

# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Status
sudo systemctl status nginx
```

### Étape 5 : Vérifier l'accès

```bash
curl http://localhost
# Ou
curl http://portail.isb-group.fr
```

---

## 🔐 Configuration SSL/TLS (HTTPS)

### Avec Certbot et Let's Encrypt

```bash
# Installer Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Générer un certificat (domaine interne)
# Note: Let's Encrypt ne fonctionne pas pour domaines internes
# Utiliser une PKI interne ou auto-signé
```

### Avec certificat auto-signé (pour test)

```bash
# Générer un certificat auto-signé
sudo openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/ssl/private/portail.key \
    -out /etc/ssl/certs/portail.crt

# Vérifier le certificat
openssl x509 -in /etc/ssl/certs/portail.crt -text -noout
```

### Configurer Nginx avec SSL

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name portail.isb-group.fr;

    ssl_certificate /etc/ssl/certs/portail.crt;
    ssl_certificate_key /etc/ssl/private/portail.key;

    # ... reste de la config ...
}

# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name portail.isb-group.fr;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring et maintenance

### Vérifier les logs

```bash
# Nginx logs
tail -f /var/log/nginx/isb-portail-access.log
tail -f /var/log/nginx/isb-portail-error.log

# Ou avec docker
docker logs -f isb-portail
```

### Sauvegarder les configurations

```bash
# Exporter la configuration docker-compose
cd /srv/isb-services/portail
tar -czf portail-backup-$(date +%Y%m%d).tar.gz docker-compose.yml nginx.conf

# Sauvegarder les données (si pertinent)
docker-compose exec portail tar -cf - /usr/share/nginx/html \
    | gzip > portail-data-backup.tar.gz
```

### Mettre à jour le portail

```bash
# 1. Pull la dernière version
cd /srv/isb-services/portail
sudo git pull origin main

# 2. Rebuild si nécessaire
sudo docker-compose build

# 3. Redémarrer
sudo docker-compose up -d

# 4. Vérifier
sudo docker-compose ps
curl http://localhost/health
```

### Redémarrage du service

```bash
# Docker Compose
sudo docker-compose restart

# Nginx
sudo systemctl restart nginx

# Complètement
sudo docker-compose down
sudo docker-compose up -d
```

---

## 🐛 Troubleshooting

### Le service ne démarre pas

```bash
# 1. Vérifier les erreurs
docker-compose logs

# 2. Vérifier les ports
sudo lsof -i :80
sudo lsof -i :443

# 3. Nettoyer et redémarrer
docker-compose down -v
docker-compose up -d
```

### Nginx refuse les connexions

```bash
# 1. Vérifier la config
sudo nginx -t

# 2. Vérifier l'écoute
sudo ss -tlnp | grep nginx

# 3. Vérifier le firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22  # SSH important!

# 4. Relancer
sudo systemctl restart nginx
```

### Performance lente

```bash
# Vérifier la charge CPU/mémoire
top
docker stats

# Vérifier la connectivité réseau
ping 8.8.8.8
iperf3 -c autre-host

# Vérifier les disques
df -h
du -sh /var/www/isb-portail

# Augmenter la mémoire Docker si nécessaire
# Éditer /etc/docker/daemon.json
```

### Cache problématique

```bash
# Forcer un cache bust côté client
# Ajouter ?v=XXX aux ressources statiques
# Ou via Nginx
```

---

## 📈 Configuration de production

### Performance

| Paramètre          | Valeur | Raison                 |
| ------------------ | ------ | ---------------------- |
| Worker connections | 2048   | Connexions simultanées |
| Gzip               | ON     | Compression des assets |
| Client max body    | 20M    | Uploads utilisateurs   |
| Keepalive timeout  | 65s    | Persistance connexions |

### Sécurité minimale

```nginx
# Headers obligatoires
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";

# Rate limiting (optionnel)
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req zone=general burst=20;
```

### Firewall

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# iptables (alternative)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -P INPUT DROP
```

---

## 📞 Support IT

**En cas de problème :**

1. Vérifier les logs : `docker logs` ou `tail /var/log/nginx/`
2. Consulter la [documentation complète](./DOCUMENTATION.md)
3. Vérifier la [FAQ](#troubleshooting)
4. Contacter : support@isb-group.fr

---

## ✅ Checklist pré-déploiement

- [ ] Serveur préparé et accessible
- [ ] Docker/Node.js installés et testés
- [ ] Repository cloné avec succès
- [ ] Build local testé sans erreurs
- [ ] Ports 80/443 disponibles
- [ ] Firewall configuré
- [ ] DNS/Hosts configurés
- [ ] Certificats SSL prêts (si HTTPS)
- [ ] Nginx/Apache configuré
- [ ] Backup plan en place
- [ ] Rollback procedure documentée
- [ ] Équipe IT informée

---

**Version** : 1.0  
**Date** : Juin 2026  
**Auteur** : Équipe IT ISB Group
