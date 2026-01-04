# 🔧 Ajouter DATABASE_URL_UNPOOLED sur Vercel

## ❌ Problème Identifié

Les logs Vercel montrent **42 lignes avec status -1**, ce qui signifie que les fonctions serverless **crash avant d'envoyer une réponse**.

**Cause :** Le schéma Prisma utilise `directUrl = env("DATABASE_URL_UNPOOLED")`, mais cette variable n'existe pas sur Vercel.

---

## ✅ Solution : Ajouter DATABASE_URL_UNPOOLED

### 📋 Étape 1 : Va sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi
2. Sélectionne ton projet **ejs-market**
3. Va dans **Settings** → **Environment Variables**

### 📋 Étape 2 : Ajoute DATABASE_URL_UNPOOLED

1. Clique sur **Add New**
2. **Key :** `DATABASE_URL_UNPOOLED`
3. **Value :** Colle EXACTEMENT cette connection string (sans pooler) :
   ```
   postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Environments :** Coche **Production**, **Preview**, et **Development**
5. Clique sur **Save**

### 📋 Étape 3 : Vérifie que DATABASE_URL existe aussi

Assure-toi que `DATABASE_URL` contient bien (avec pooler) :
```
postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**⚠️ IMPORTANT :**
- `DATABASE_URL` doit contenir **`-pooler`** dans l'URL
- `DATABASE_URL_UNPOOLED` ne doit **PAS** contenir **`-pooler`**

---

## 📋 Étape 4 : Redéploie

1. Va dans **Deployments**
2. Clique sur les **3 points** (⋯) du dernier déploiement
3. Clique sur **Redeploy**
4. Attends que le déploiement se termine (1-2 minutes)

---

## ✅ Vérification

Après le redéploiement, teste :

1. **Test de la base de données :**
   - Va sur : `https://ejs-market-181a.vercel.app/api/test-db`
   - Tu devrais voir : `{"success": true, "userCount": 1, ...}`

2. **Vérifie les logs Vercel :**
   - Va sur **Vercel → Logs**
   - Les status `-1` devraient disparaître
   - Tu devrais voir des status `200` pour les routes API

---

## 🔍 Différence entre les deux variables

### DATABASE_URL (avec pooler)
- Utilisé pour les **requêtes normales** dans l'application
- Contient **`-pooler`** dans l'URL
- Optimisé pour les connexions serverless (Vercel)

### DATABASE_URL_UNPOOLED (sans pooler)
- Utilisé pour les **migrations Prisma** (`prisma migrate`, `prisma db push`)
- Ne contient **PAS** `-pooler` dans l'URL
- Connexion directe à la base de données

---

## 📝 Connection Strings à Copier-Coller

### DATABASE_URL (avec pooler)
```
postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### DATABASE_URL_UNPOOLED (sans pooler)
```
postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🐛 Dépannage

### Si les status -1 persistent

1. **Vérifie que les deux variables existent :**
   - `DATABASE_URL` ✅
   - `DATABASE_URL_UNPOOLED` ✅

2. **Vérifie les valeurs :**
   - Clique sur l'icône **œil** pour révéler chaque valeur
   - `DATABASE_URL` doit contenir `neon.tech` et `-pooler`
   - `DATABASE_URL_UNPOOLED` doit contenir `neon.tech` mais **PAS** `-pooler`

3. **Vérifie les environnements :**
   - Chaque variable doit être assignée à **Production**, **Preview**, et **Development**

4. **Force un nouveau déploiement :**
   - Supprime le cache de build si possible
   - Redéploie

---

**Dernière mise à jour** : 2024

