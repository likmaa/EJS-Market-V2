# 🚀 Guide de Déploiement sur Hostinger

Guide complet pour déployer votre application Next.js 15 sur Hostinger (VPS ou Cloud Hosting).

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration du serveur](#configuration-du-serveur)
3. [Installation des dépendances](#installation-des-dépendances)
4. [Configuration de la base de données](#configuration-de-la-base-de-données)
5. [Déploiement de l'application](#déploiement-de-lapplication)
6. [Configuration Nginx](#configuration-nginx)
7. [Configuration SSL/HTTPS](#configuration-sslhttps)
8. [Gestion avec PM2](#gestion-avec-pm2)
9. [Variables d'environnement](#variables-denvironnement)
10. [Déploiement continu](#déploiement-continu)
11. [Maintenance et monitoring](#maintenance-et-monitoring)
12. [Dépannage](#dépannage)

---

## 📦 Prérequis

### Type d'hébergement requis

**⚠️ Important** : Hostinger propose plusieurs types d'hébergement :

- ❌ **Shared Hosting** : **NON adapté** pour Next.js (pas de support Node.js)
- ✅ **VPS (Virtual Private Server)** : **Recommandé** pour Next.js
- ✅ **Cloud Hosting** : **Recommandé** si support Node.js

**Vous devez avoir un VPS ou Cloud Hosting avec :**
- Accès SSH (root ou sudo)
- Node.js 18+ installé
- PostgreSQL (ou utiliser Neon/Supabase en externe)
- Nginx installé
- Certbot pour SSL (Let's Encrypt)

---

## 🖥️ Configuration du serveur

### Étape 1 : Connexion SSH

1. Connectez-vous à votre VPS Hostinger via SSH :
   ```bash
   ssh root@votre-ip-serveur
   # ou
   ssh utilisateur@votre-domaine.com
   ```

2. Mettez à jour le système :
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

### Étape 2 : Installation de Node.js

```bash
# Installer Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v20.x.x
npm --version   # Doit afficher 10.x.x
```

### Étape 3 : Installation de PM2 (gestionnaire de processus)

```bash
sudo npm install -g pm2

# Configurer PM2 pour démarrer au boot
pm2 startup systemd
# Suivre les instructions affichées
```

### Étape 4 : Installation de Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Étape 5 : Installation de Git

```bash
sudo apt install git -y
```

---

## 📥 Installation des dépendances

### Étape 1 : Cloner le dépôt

```bash
# Créer un répertoire pour l'application
sudo mkdir -p /var/www
cd /var/www

# Cloner votre dépôt GitHub
sudo git clone https://github.com/votre-username/votre-repo.git ejs-market
cd ejs-market

# Donner les permissions appropriées
sudo chown -R $USER:$USER /var/www/ejs-market
```

### Étape 2 : Installer les dépendances

```bash
cd /var/www/ejs-market
npm install
```

---

## 🗄️ Configuration de la base de données

### Option 1 : Utiliser Neon (recommandé - externe)

Si vous utilisez déjà Neon (comme sur Vercel), **aucune configuration supplémentaire** n'est nécessaire. Utilisez simplement la même `DATABASE_URL` dans vos variables d'environnement.

### Option 2 : Installer PostgreSQL sur le serveur

```bash
# Installer PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer un utilisateur et une base de données
sudo -u postgres psql

# Dans le shell PostgreSQL :
CREATE DATABASE ejs_market;
CREATE USER ejs_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE ejs_market TO ejs_user;
\q
```

**Mettre à jour `DATABASE_URL` dans `.env` :**
```env
DATABASE_URL="postgresql://ejs_user:votre_mot_de_passe_securise@localhost:5432/ejs_market?schema=public"
```

---

## 🚀 Déploiement de l'application

### Étape 1 : Créer le fichier `.env`

```bash
cd /var/www/ejs-market
nano .env
```

**Contenu minimal du `.env` :**

```env
# Base de données
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..." # Optionnel

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-minimum-32-caracteres-genere-aleatoirement"

# Node Environment
NODE_ENV="production"

# Email (Brevo)
BREVO_API_KEY="votre_cle_api_brevo"
EMAIL_FROM="no-reply@votre-domaine.com"
ADMIN_NOTIFICATION_EMAIL="admin@votre-domaine.com"

# Autres variables si nécessaire
```

**Générer un `NEXTAUTH_SECRET` sécurisé :**
```bash
openssl rand -base64 32
```

### Étape 2 : Générer le client Prisma et pousser le schéma

```bash
cd /var/www/ejs-market

# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npx prisma db push

# Seed les données initiales (optionnel)
npm run db:seed
```

### Étape 3 : Build de production

```bash
npm run build
```

### Étape 4 : Démarrer l'application avec PM2

```bash
# Démarrer l'application
pm2 start npm --name "ejs-market" -- start

# Sauvegarder la configuration PM2
pm2 save

# Vérifier le statut
pm2 status
pm2 logs ejs-market
```

**L'application devrait maintenant tourner sur `http://localhost:3000`**

---

## 🌐 Configuration Nginx

### Étape 1 : Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/ejs-market
```

**Contenu de la configuration :**

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    # Redirection vers HTTPS (après configuration SSL)
    # return 301 https://$server_name$request_uri;

    # Pour l'instant, proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Désactiver le cache pour les pages dynamiques
    location ~* \.(html|json)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### Étape 2 : Activer la configuration

```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/ejs-market /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 🔒 Configuration SSL/HTTPS

### Étape 1 : Installer Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Étape 2 : Obtenir un certificat SSL

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

**Suivez les instructions :**
- Entrez votre email
- Acceptez les conditions
- Choisissez de rediriger HTTP vers HTTPS

### Étape 3 : Vérifier le renouvellement automatique

```bash
# Tester le renouvellement
sudo certbot renew --dry-run
```

Certbot renouvelle automatiquement les certificats avant expiration.

### Étape 4 : Mettre à jour Nginx pour HTTPS

Après l'installation SSL, Certbot modifie automatiquement votre configuration Nginx. Vérifiez :

```bash
sudo nano /etc/nginx/sites-available/ejs-market
```

**La configuration devrait maintenant inclure :**

```nginx
server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # ... reste de la configuration
}

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 🔄 Gestion avec PM2

### Commandes PM2 utiles

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs ejs-market

# Redémarrer l'application
pm2 restart ejs-market

# Arrêter l'application
pm2 stop ejs-market

# Supprimer l'application de PM2
pm2 delete ejs-market

# Monitorer (CPU, RAM)
pm2 monit

# Redémarrer après un crash
pm2 startup
pm2 save
```

### Configuration PM2 avancée (optionnel)

Créer un fichier `ecosystem.config.js` à la racine du projet :

```javascript
module.exports = {
  apps: [{
    name: 'ejs-market',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ejs-market',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/ejs-market-error.log',
    out_file: '/var/log/pm2/ejs-market-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

**Utilisation :**
```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## 🔐 Variables d'environnement

### Liste complète des variables

```env
# ============================================
# BASE DE DONNÉES
# ============================================
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..." # Optionnel

# ============================================
# NEXTAUTH (Authentification)
# ============================================
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-32-caracteres-minimum"

# ============================================
# ENVIRONNEMENT
# ============================================
NODE_ENV="production"
PORT=3000

# ============================================
# EMAIL (Brevo)
# ============================================
BREVO_API_KEY="votre_cle_api_brevo"
EMAIL_FROM="no-reply@votre-domaine.com"
ADMIN_NOTIFICATION_EMAIL="admin@votre-domaine.com"

# ============================================
# PROCESSEUR DE PAIEMENT (si paiement par carte activé)
# ============================================
# Variables selon le processeur choisi (Stripe, PayPal, etc.)
# PAYMENT_PUBLIC_KEY="..."
# PAYMENT_SECRET_KEY="..."
# PAYMENT_WEBHOOK_SECRET="..."

# ============================================
# ALGOLIA (si activé)
# ============================================
NEXT_PUBLIC_ALGOLIA_APP_ID="..."
NEXT_PUBLIC_ALGOLIA_API_KEY="..."
ALGOLIA_ADMIN_API_KEY="..."
```

### Sécuriser le fichier `.env`

```bash
# Restreindre les permissions
chmod 600 /var/www/ejs-market/.env

# Vérifier que .env est dans .gitignore
cat /var/www/ejs-market/.gitignore | grep .env
```

---

## 🔄 Déploiement continu

### Option 1 : Script de déploiement **manuel**

Créer un script `deploy.sh` :

```bash
#!/bin/bash

cd /var/www/ejs-market

# Pull les dernières modifications
git pull origin main

# Installer les dépendances
npm install

# Générer Prisma
npm run db:generate

# Build
npm run build

# Redémarrer avec PM2
pm2 restart ejs-market

echo "✅ Déploiement terminé !"
```

**Rendre le script exécutable :**
```bash
chmod +x deploy.sh
```

**Utilisation :**
```bash
./deploy.sh
```

### Option 2 : Déploiement continu avec **GitHub Actions** (recommandé)

Cette option permet de déployer automatiquement sur votre serveur Hostinger **à chaque push sur la branche `main`** de GitHub.

#### Étape 1 : Préparer la connexion SSH (clé sans mot de passe)

Sur **votre machine locale** :

```bash
ssh-keygen -t ed25519 -C "deploy@ejs-market" 
# ou : ssh-keygen -t rsa -b 4096 -C "deploy@ejs-market"
```

Vous obtenez :
- Clé **privée** : `~/.ssh/id_ed25519` (À garder secrète)
- Clé **publique** : `~/.ssh/id_ed25519.pub`

Copiez la clé **publique** sur le serveur Hostinger :

```bash
ssh root@votre-ip-serveur   # ou utilisateur@votre-domaine.com

# Sur le serveur :
mkdir -p ~/.ssh
echo "COLLER_CONTENU_DE_id_ed25519.pub_ici" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Testez la connexion **sans mot de passe** depuis votre machine :

```bash
ssh root@votre-ip-serveur
```

> Si vous êtes connecté sans que le système demande un mot de passe : ✅ SSH OK.

#### Étape 2 : Préparer le script `deploy.sh` sur le serveur

Assurez-vous que le script `deploy.sh` (vu dans l’Option 1) est bien présent sur le serveur :

```bash
cd /var/www/ejs-market
nano deploy.sh   # ou vim deploy.sh

chmod +x deploy.sh
```

#### Étape 3 : Configurer les **GitHub Secrets**

Dans votre dépôt GitHub :

1. Aller dans **Settings → Secrets and variables → Actions → New repository secret**
2. Créer les secrets suivants :

- `SSH_HOST` : l’IP du serveur ou le domaine (ex : `123.45.67.89` ou `api.ejs-market.com`)
- `SSH_USER` : l’utilisateur SSH (souvent `root` ou un utilisateur dédié, ex : `deploy`)
- `SSH_PORT` : `22` (ou autre si vous avez modifié le port SSH)
- `SSH_PRIVATE_KEY` : **contenu complet** de votre clé privée `id_ed25519` (ou `id_rsa`)
- `APP_DIR` : chemin du projet sur le serveur, ex : `/var/www/ejs-market`

#### Étape 4 : Créer le workflow GitHub Actions

Dans votre dépôt, créez le fichier : `.github/workflows/deploy-hostinger.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Add SSH key
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Add server to known_hosts
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -p ${{ secrets.SSH_PORT }} ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy via SSH
        env:
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_PORT: ${{ secrets.SSH_PORT }}
          APP_DIR: ${{ secrets.APP_DIR }}
        run: |
          ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "cd $APP_DIR && ./deploy.sh"
```

#### Étape 5 : Flux complet

1. Vous poussez du code sur la branche `main` de GitHub
2. GitHub Actions se déclenche automatiquement
3. Le workflow se connecte en SSH à votre serveur Hostinger
4. Il exécute `./deploy.sh` dans `/var/www/ejs-market`
5. Le script :
   - fait un `git pull`
   - installe les dépendances
   - génère Prisma
   - build l’app
   - redémarre PM2

> Résultat : **déploiement continu** sans intervention manuelle, à chaque push sur `main`.

---

## 📊 Maintenance et monitoring

### Logs

```bash
# Logs PM2
pm2 logs ejs-market

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs système
sudo journalctl -u nginx -f
```

### Monitoring des ressources

```bash
# CPU et RAM
htop

# Espace disque
df -h

# Processus Node.js
pm2 monit
```

### Sauvegarde de la base de données

```bash
# Si PostgreSQL est local
pg_dump -U ejs_user ejs_market > backup_$(date +%Y%m%d).sql

# Restaurer
psql -U ejs_user ejs_market < backup_20240101.sql
```

---

## 🔧 Dépannage

### Problème : L'application ne démarre pas

```bash
# Vérifier les logs PM2
pm2 logs ejs-market --lines 50

# Vérifier les variables d'environnement
pm2 env ejs-market

# Tester manuellement
cd /var/www/ejs-market
npm start
```

### Problème : Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL tourne
sudo systemctl status postgresql

# Tester la connexion
psql -U ejs_user -d ejs_market

# Vérifier DATABASE_URL dans .env
cat .env | grep DATABASE_URL
```

### Problème : Nginx ne redirige pas vers Next.js

```bash
# Tester la configuration Nginx
sudo nginx -t

# Vérifier que Next.js tourne sur le port 3000
curl http://localhost:3000

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problème : Certificat SSL expiré

```bash
# Renouveler manuellement
sudo certbot renew

# Vérifier les certificats
sudo certbot certificates
```

### Problème : L'application crash régulièrement

```bash
# Vérifier la mémoire
free -h

# Augmenter la limite de mémoire dans PM2
pm2 restart ejs-market --max-memory-restart 2G

# Vérifier les logs pour des erreurs spécifiques
pm2 logs ejs-market --err
```

### Problème : Build échoue

```bash
# Nettoyer le cache
rm -rf .next
rm -rf node_modules
npm cache clean --force

# Réinstaller
npm install
npm run build
```

---

## ✅ Checklist de déploiement

- [ ] VPS/Cloud Hosting configuré avec accès SSH
- [ ] Node.js 18+ installé
- [ ] PM2 installé et configuré
- [ ] Nginx installé et configuré
- [ ] Base de données configurée (Neon ou PostgreSQL local)
- [ ] Dépôt Git cloné sur le serveur
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Prisma généré et schéma poussé (`npm run db:generate` et `prisma db push`)
- [ ] Build de production réussi (`npm run build`)
- [ ] Application démarrée avec PM2
- [ ] Nginx configuré comme reverse proxy
- [ ] SSL/HTTPS configuré avec Certbot
- [ ] Domaine pointant vers le serveur
- [ ] Application accessible en HTTPS
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Monitoring configuré (PM2 monit)

---

## 📚 Ressources supplémentaires

- [Documentation Next.js - Déploiement](https://nextjs.org/docs/deployment)
- [Documentation PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation Certbot](https://certbot.eff.org/)
- [Documentation Prisma - Déploiement](https://www.prisma.io/docs/guides/deployment)

---

## 🆘 Support

En cas de problème :

1. Vérifier les logs (`pm2 logs`, `nginx error.log`)
2. Vérifier les variables d'environnement
3. Vérifier la connexion à la base de données
4. Vérifier que tous les services tournent (PM2, Nginx, PostgreSQL)

**Bon déploiement ! 🚀**

