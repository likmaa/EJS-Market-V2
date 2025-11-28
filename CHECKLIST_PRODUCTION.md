# ✅ Checklist Production - EJS Market

## 🎯 État Actuel du Projet

### ✅ Configuration Technique
- [x] Next.js 15.5.6 installé et configuré
- [x] ESLint 8.57.0 configuré (compatible Next.js 15)
- [x] TypeScript configuré
- [x] Prisma ORM configuré
- [x] Build de production fonctionnel
- [x] Aucune vulnérabilité (`npm audit` clean)
- [x] Tous les tests passent

### ✅ Code Quality
- [x] Composants dynamiques correctement configurés
- [x] Layout optimisé (Server/Client Components)
- [x] Configuration Next.js propre (swcMinify supprimé)
- [x] ESLint actif et fonctionnel

---

## 🚀 Étapes de Déploiement Production

### 1. Préparation du Code

- [x] Build de production testé localement
- [x] Toutes les dépendances à jour
- [x] Configuration ESLint fonctionnelle
- [ ] **À faire** : Corriger les 2 warnings `<img>` → `<Image />` (optionnel)

### 2. Base de Données

- [ ] **Vérifier** : Base de données PostgreSQL configurée (**Neon**)
- [ ] **Vérifier** : `DATABASE_URL` configurée en production
- [ ] **Vérifier** : `DATABASE_URL_UNPOOLED` configurée (si utilisée)
- [ ] **À faire** : Exécuter les migrations Prisma en production
  ```bash
  npx prisma migrate deploy
  ```
- [ ] **À faire** : Seed les données initiales (taux TVA, zones livraison)
  ```bash
  npm run db:seed
  ```

### 3. Variables d'Environnement Production

#### Variables OBLIGATOIRES :

```bash
# Base de données
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..." # Optionnel mais recommandé

# NextAuth
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-minimum-32-caracteres"

# Node Environment
NODE_ENV="production"
```

#### Variables OPTIONNELLES :

```bash
# Stripe (si paiements activés)
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Algolia (si recherche activée)
NEXT_PUBLIC_ALGOLIA_APP_ID="..."
NEXT_PUBLIC_ALGOLIA_API_KEY="..."
ALGOLIA_ADMIN_API_KEY="..."
```

### 4. Déploiement Vercel

#### Étape 1 : Préparer le dépôt GitHub
- [ ] Code poussé sur GitHub
- [ ] Branche `main` ou `production` prête

#### Étape 2 : Créer le projet Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur **"Add New Project"**
4. Sélectionner le dépôt
5. Configurer :
   - **Framework Preset** : Next.js
   - **Root Directory** : `./` (par défaut)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

#### Étape 3 : Configurer les Variables d'Environnement
Dans les **Settings** → **Environment Variables**, ajouter :

1. `DATABASE_URL` (Production)
2. `DATABASE_URL_UNPOOLED` (Production) - Optionnel
3. `NEXTAUTH_URL` (Production) - URL de votre domaine
4. `NEXTAUTH_SECRET` (Production) - Générer avec : `openssl rand -base64 32`
5. `NODE_ENV` = `production` (Production)

#### Étape 4 : Déployer
- [ ] Cliquer sur **"Deploy"**
- [ ] Attendre la fin du build
- [ ] Vérifier les logs de build
- [ ] Tester l'application déployée

### 5. Post-Déploiement

#### Initialisation Base de Données
- [ ] Se connecter au terminal Vercel ou utiliser Prisma Studio
- [ ] Exécuter les migrations :
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Seed les données initiales :
  ```bash
  npm run db:seed
  ```

#### Vérifications
- [ ] Site accessible sur l'URL Vercel
- [ ] Authentification fonctionne (login/register)
- [ ] Base de données connectée
- [ ] Pages principales chargent correctement
- [ ] Images s'affichent
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Pas d'erreurs dans les logs Vercel

#### Configuration Domaine Personnalisé (Optionnel)
- [ ] Ajouter un domaine personnalisé dans Vercel
- [ ] Configurer les DNS
- [ ] Mettre à jour `NEXTAUTH_URL` avec le nouveau domaine

---

## 🔒 Sécurité Production

### Checklist Sécurité
- [x] Headers de sécurité configurés (`next.config.js`)
- [x] Validation Zod sur les inputs
- [x] NextAuth configuré avec secret fort
- [ ] **À vérifier** : HTTPS activé (automatique sur Vercel)
- [ ] **À vérifier** : Variables sensibles dans Vercel (pas dans le code)
- [ ] **À vérifier** : Rate limiting configuré (si nécessaire)

---

## 📊 Monitoring & Analytics

### À Configurer (Optionnel)
- [ ] Vercel Analytics activé
- [ ] Google Analytics 4 (si nécessaire)
- [ ] Sentry pour le monitoring d'erreurs (si nécessaire)
- [ ] Logs Vercel configurés

---

## 🚨 En Cas de Problème

### Build Échoue
1. Vérifier les logs Vercel
2. Tester le build localement : `npm run build`
3. Vérifier les variables d'environnement
4. Vérifier la connexion à la base de données

### Erreurs Runtime
1. Vérifier les logs Vercel
2. Vérifier la console navigateur
3. Vérifier la connexion à la base de données
4. Vérifier les variables d'environnement

### Base de Données
- Voir [`docs/VERIFIER_DATABASE_URL_VERCEL.md`](./docs/VERIFIER_DATABASE_URL_VERCEL.md)
- Voir [`docs/CONNECTION_STRINGS_NEON.md`](./docs/CONNECTION_STRINGS_NEON.md)

---

## 📚 Documentation Référence

- **Déploiement Vercel** : [`docs/VERCEL.md`](./docs/VERCEL.md)
- **Configuration GitHub** : [`docs/INSTRUCTIONS_GITHUB.md`](./docs/INSTRUCTIONS_GITHUB.md)
- **Base de données** : [`docs/SETUP_DATABASE.md`](./docs/SETUP_DATABASE.md)
- **Authentification** : [`docs/AUTHENTICATION.md`](./docs/AUTHENTICATION.md)

---

## ✅ Prêt pour Production

Une fois toutes les cases cochées, votre application est prête pour la production ! 🚀

**Bon déploiement !**

