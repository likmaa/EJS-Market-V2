# 🔗 Connection Strings Neon

## 📋 Connection Strings

### 1️⃣ Connection String AVEC Pooler (pour Vercel et requêtes normales)

```
postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Utilisation :**
- ✅ Vercel (variable d'environnement `DATABASE_URL`)
- ✅ Requêtes normales dans l'application
- ✅ Serverless functions

---

### 2️⃣ Connection String SANS Pooler (pour migrations Prisma)

```
postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Utilisation :**
- ✅ Migrations Prisma (`prisma db push`, `prisma migrate`)
- ✅ Scripts de seed
- ✅ Commandes Prisma CLI

**Note :** Cette connection string est utilisée via `DATABASE_URL_UNPOOLED` dans le schéma Prisma.

---

## 🔧 Configuration

### Sur Vercel

1. Va sur **Vercel → Settings → Environment Variables**
2. Ajoute ou modifie `DATABASE_URL` avec la connection string **AVEC pooler** (1️⃣)
3. Assure-toi que **Production**, **Preview**, et **Development** sont cochés
4. Redéploie après modification

### Localement

**Fichier `.env` :**
```bash
DATABASE_URL="postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

**Fichier `.env.local` :**
```bash
DATABASE_URL="postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ton-secret-ici"
```

---

## ✅ Vérification

### Test Local
```bash
npx tsx scripts/test-db-connection.ts
```

### Test Vercel
```bash
npx tsx scripts/test-vercel-db.ts
```

Ou directement :
- `https://ejs-market-181a.vercel.app/api/test-db`

---

## 🔍 Dépannage

### Erreur : "Authentication failed"

**Cause :** Connection string incorrecte ou mot de passe erroné

**Solution :** Vérifie que la connection string est exactement celle fournie ci-dessus

### Erreur : "Can't reach database server"

**Cause :** Connection string incorrecte ou réseau bloqué

**Solution :** 
- Vérifie que `?sslmode=require` est présent à la fin
- Vérifie que l'hostname contient bien `neon.tech`

### Erreur : "Table does not exist"

**Cause :** Base de données non initialisée

**Solution :**
```bash
npx prisma db push
npm run db:seed
```

---

**Dernière mise à jour** : 2024

