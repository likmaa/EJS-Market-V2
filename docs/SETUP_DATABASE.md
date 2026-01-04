# Guide de Configuration de la Base de Données

Ce guide vous aidera à créer et configurer votre base de données PostgreSQL pour le projet eJS MARKET.

## 🎯 Options Disponibles

### Option 1 : PostgreSQL Local (Recommandé pour le développement)
### Option 2 : Supabase (Gratuit, Cloud)
### Option 3 : Autres Providers Cloud (Railway, Neon, etc.)

---

## Option 1 : PostgreSQL Local

### Installation sur macOS

```bash
# Installer PostgreSQL avec Homebrew
brew install postgresql@15

# Démarrer PostgreSQL
brew services start postgresql@15

# Créer une base de données
createdb ejs_market

# Créer un utilisateur (optionnel)
createuser -s ejs_user
```

### Installation sur Linux (Ubuntu/Debian)

```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Se connecter en tant que postgres
sudo -u postgres psql

# Dans psql, créer la base de données et l'utilisateur
CREATE DATABASE ejs_market;
CREATE USER ejs_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE ejs_market TO ejs_user;
\q
```

### Installation sur Windows

1. Télécharger PostgreSQL depuis : https://www.postgresql.org/download/windows/
2. Installer avec l'installateur
3. Pendant l'installation, noter le mot de passe du superutilisateur `postgres`
4. Ouvrir "pgAdmin" ou "SQL Shell (psql)"
5. Créer la base de données :
   ```sql
   CREATE DATABASE ejs_market;
   ```

### Configuration de la DATABASE_URL

Une fois PostgreSQL installé et la base créée, mettez à jour `.env.local` :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/ejs_market?schema=public"
```

Ou si vous avez créé un utilisateur spécifique :

```env
DATABASE_URL="postgresql://ejs_user:VOTRE_MOT_DE_PASSE@localhost:5432/ejs_market?schema=public"
```

---

## Option 2 : Supabase (Gratuit, Cloud)

### Étape 1 : Créer un compte Supabase

1. Aller sur https://supabase.com
2. Cliquer sur "Start your project"
3. Se connecter avec GitHub, Google, ou créer un compte

### Étape 2 : Créer un nouveau projet

1. Cliquer sur "New Project"
2. Remplir les informations :
   - **Name** : ejs-market (ou votre nom)
   - **Database Password** : Choisir un mot de passe fort (⚠️ le noter !)
   - **Region** : Choisir la région la plus proche
3. Cliquer sur "Create new project"
4. Attendre 2-3 minutes que le projet soit créé

### Étape 3 : Récupérer la connection string

1. Dans votre projet Supabase, aller dans **Settings** > **Database**
2. Scroller jusqu'à **Connection string**
3. Sélectionner **URI** dans le dropdown
4. Copier la connection string (elle ressemble à) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Étape 4 : Configurer .env.local

Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez défini lors de la création du projet :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres?schema=public"
```

---

## Option 3 : Autres Providers Cloud

### Railway

1. Aller sur https://railway.app
2. Créer un compte
3. Créer un nouveau projet > PostgreSQL
4. Récupérer la `DATABASE_URL` dans les variables d'environnement

### Neon

1. Aller sur https://neon.tech
2. Créer un compte
3. Créer un nouveau projet
4. Récupérer la connection string

---

## ✅ Vérifier la Connexion

Une fois la base de données configurée, testez la connexion :

### Méthode 1 : Via Prisma

```bash
# Générer le client Prisma (déjà fait)
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push
```

Si cette commande réussit, votre base de données est correctement configurée !

### Méthode 2 : Via psql (PostgreSQL local)

```bash
# Se connecter à la base de données
psql -d ejs_market

# Ou avec utilisateur spécifique
psql -U ejs_user -d ejs_market
```

### Méthode 3 : Via Prisma Studio

```bash
npm run db:studio
```

Cela ouvrira une interface graphique pour visualiser votre base de données.

---

## 🚀 Prochaines Étapes

Une fois la base de données configurée :

1. **Créer les tables** :
   ```bash
   npm run db:push
   ```

2. **Créer l'utilisateur admin** :
   ```bash
   npm run db:seed
   ```

3. **Vérifier avec Prisma Studio** :
   ```bash
   npm run db:studio
   ```

---

## 🛠️ Dépannage

### Erreur : "Can't reach database server"

**PostgreSQL local** :
- Vérifier que PostgreSQL est démarré :
  ```bash
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status postgresql
  ```

**Supabase/Cloud** :
- Vérifier que la `DATABASE_URL` est correcte
- Vérifier que le mot de passe n'a pas d'espaces ou de caractères spéciaux non échappés

### Erreur : "password authentication failed"

- Vérifier que le mot de passe dans `DATABASE_URL` est correct
- Pour Supabase, utiliser le mot de passe défini lors de la création du projet

### Erreur : "database does not exist"

- Créer la base de données :
  ```bash
  createdb ejs_market
  ```
  Ou via psql :
  ```sql
  CREATE DATABASE ejs_market;
  ```

### Erreur : "permission denied"

- Vérifier que l'utilisateur a les permissions nécessaires :
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE ejs_market TO ejs_user;
  ```

---

## 📚 Ressources

- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Railway](https://docs.railway.app/)
- [Documentation Neon](https://neon.tech/docs)

