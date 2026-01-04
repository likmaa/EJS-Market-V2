# ⚠️ Document de diagnostic (legacy)
#
# Ce document décrit un ancien problème de configuration (Supabase → Neon)
# conservé pour historique. Pour la configuration actuelle, se référer à
# `DEPLOIEMENT.md`, `VERCEL.md` et `SETUP_DATABASE.md`.

# 🔍 Problème : Build utilise Neon mais Runtime utilise Supabase

## ❌ Symptôme

- ✅ Le **BUILD** sur Vercel utilise bien Neon (visible dans les logs)
- ❌ Le **RUNTIME** (application en production) utilise encore Supabase

## 🔍 Causes Possibles

### 1. Plusieurs Variables DATABASE_URL

Il peut y avoir plusieurs variables `DATABASE_URL` sur Vercel :
- Une pour **Production**
- Une pour **Preview**
- Une pour **Development**

Si une seule a été mise à jour, les autres utilisent encore Supabase.

### 2. Variables Non Assignées aux Bons Environnements

La variable `DATABASE_URL` peut ne pas être assignée à tous les environnements (Production, Preview, Development).

### 3. Cache de Runtime

Vercel peut avoir mis en cache l'ancienne valeur pour le runtime.

---

## ✅ Solution

### Étape 1 : Vérifier Toutes les Variables

1. Va sur **Vercel → Settings → Environment Variables**
2. Utilise le filtre **"All Environments"** pour voir TOUTES les variables
3. Cherche **TOUTES** les occurrences de `DATABASE_URL`

### Étape 2 : Supprimer TOUTES les Variables DATABASE_URL

1. Pour **CHAQUE** variable `DATABASE_URL` que tu vois :
   - Clique sur les **3 points** (⋯)
   - Clique sur **Delete**
   - Confirme la suppression
2. **Assure-toi qu'il n'y a plus AUCUNE variable `DATABASE_URL`**

### Étape 3 : Attendre 30 Secondes

Laisse Vercel synchroniser la suppression.

### Étape 4 : Recréer UNE SEULE Variable DATABASE_URL

1. Clique sur **Add New**
2. **Key :** `DATABASE_URL`
3. **Value :** Colle EXACTEMENT cette connection string :
   ```
   postgresql://neondb_owner:npg_zofTC40WrDUB@ep-plain-shadow-ag8l27ob-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Environments :** Coche **TOUTES** ces cases :
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Clique sur **Save**

### Étape 5 : Vérifier la Valeur

1. Clique sur l'icône **œil** pour révéler la valeur
2. **Vérifie qu'elle contient bien `neon.tech`** (pas `supabase.com`)
3. Si elle contient encore `supabase.com`, supprime et recrée

### Étape 6 : Forcer un Nouveau Déploiement

**Option A : Via l'Interface**
1. Va dans **Deployments**
2. Clique sur les **3 points** (⋯) du dernier déploiement
3. Clique sur **Redeploy**
4. Attends que le déploiement se termine

**Option B : Via un Commit (Recommandé)**
1. Fais un petit changement (ou un commit vide)
2. Push sur GitHub
3. Vercel redéploiera automatiquement avec les nouvelles variables

### Étape 7 : Vérifier les Logs du Nouveau Déploiement

1. Va dans **Vercel → Logs**
2. Cherche les lignes qui contiennent :
   - `[Prisma] DATABASE_URL`
   - `[Prisma] Provider`
3. Vérifie que tu vois `neon.tech` et `Provider: Neon`

---

## 🐛 Si ça Ne Fonctionne Toujours Pas

### Vérifier les Variables par Environnement

1. Va dans **Settings → Environment Variables**
2. Utilise le filtre pour voir les variables par environnement :
   - **Production** uniquement
   - **Preview** uniquement
   - **Development** uniquement
3. Vérifie qu'il n'y a pas de variables différentes selon l'environnement

### Vérifier le Cache de Build

1. Va dans **Settings → Build and Deployment**
2. Cherche une option pour **"Clear Build Cache"** ou **"Rebuild"**
3. Force un rebuild complet

### Vérifier les Logs Runtime

1. Va dans **Vercel → Logs**
2. Fais une requête à `/api/test-db`
3. Regarde les logs pour voir quelle `DATABASE_URL` est utilisée au runtime

---

## 📋 Checklist

- [ ] Toutes les anciennes variables `DATABASE_URL` supprimées
- [ ] Une seule nouvelle variable `DATABASE_URL` créée
- [ ] La valeur contient `neon.tech` (pas `supabase.com`)
- [ ] Production, Preview, et Development sont TOUS cochés
- [ ] La valeur a été vérifiée avec l'icône œil
- [ ] Un nouveau déploiement a été fait
- [ ] Les logs du build montrent `Provider: Neon`
- [ ] Le test `/api/test-db` retourne `{"success": true}`

---

**Dernière mise à jour** : 2024

