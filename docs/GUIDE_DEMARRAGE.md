# 🚀 Guide de Démarrage

## ✅ Structure du Projet Créée

Le projet a été initialisé avec :

- ✅ Next.js 14+ (App Router) + TypeScript
- ✅ Tailwind CSS
- ✅ Prisma ORM (schéma complet)
- ✅ Structure de base de données (Users, Products, Orders, etc.)
- ✅ Validations Zod
- ✅ Helpers et utilitaires
- ✅ Configuration sécurité (headers, etc.)

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

#### Option A : Supabase (Recommandé)

1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer l'URL de connexion PostgreSQL
4. Créer un fichier `.env.local` :

```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```


### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth (générer avec: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici"

# Stripe (optionnel pour l'instant)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la DB (créer les tables)
npm run db:push

# Seed les données initiales (taux TVA, zones de livraison)
npm run db:seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
E-com/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── lib/                    # Utilitaires et helpers
│   ├── prisma.ts          # Client Prisma
│   ├── types.ts           # Types TypeScript
│   ├── validations.ts     # Schémas Zod
│   ├── constants.ts       # Constantes (TVA, pays, etc.)
│   ├── utils.ts           # Utilitaires (formatage prix, etc.)
│   ├── helpers.ts         # Helpers produits/commandes
│   └── env.ts             # Validation variables d'environnement
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.ts           # Script de seed (données initiales)
├── package.json
├── tsconfig.json
├── next.config.js         # Config Next.js + headers sécurité
├── tailwind.config.ts
└── README.md
```

## 🗄️ Modèles de Données

### Tables Principales

- **User** : Utilisateurs (ADMIN, CUSTOMER, B2B_CUSTOMER)
- **Product** : Produits avec attributs dynamiques (JSONB)
- **Order** : Commandes
- **OrderItem** : Lignes de commande
- **TaxRate** : Taux TVA par pays
- **ShippingZone** : Zones de livraison
- **ShippingMethod** : Méthodes de transport
- **Address** : Adresses utilisateurs

## 🔧 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run start` - Serveur de production
- `npm run lint` - Linter le code
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:migrate` - Créer une migration
- `npm run db:studio` - Ouvrir Prisma Studio (interface admin)
- `npm run db:seed` - Seed les données initiales

## 🎯 Prochaines Étapes

### Phase 1 : MVP (À faire)

1. **Authentification**
   - [ ] Configurer NextAuth.js
   - [ ] Pages login/register
   - [ ] Protection des routes admin

2. **Catalogue Produits**
   - [ ] Page liste produits
   - [ ] Page détail produit
   - [ ] CRUD admin produits

3. **Panier & Checkout**
   - [ ] Gestion panier (localStorage + DB)
   - [ ] Page checkout
   - [ ] Calcul TVA par pays

4. **Paiements**
   - [ ] Intégration Stripe
   - [ ] Webhooks Stripe
   - [ ] Gestion statuts commandes

## 🔒 Sécurité

Les headers de sécurité sont déjà configurés dans `next.config.js` :
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- CSP (à configurer selon besoins)

## 📚 Documentation

- **Cahier des charges** : `CAHIER_DES_CHARGES.md`
- **Stack validée** : `STACK_VALIDATION.md`
- **Next.js** : https://nextjs.org/docs
- **Prisma** : https://www.prisma.io/docs
- **Stripe** : https://stripe.com/docs

## ⚠️ Notes Importantes

- Les erreurs TypeScript au démarrage sont normales (dépendances non installées)
- Après `npm install`, tout devrait fonctionner
- N'oubliez pas de créer le fichier `.env.local` avant de lancer le serveur
- Utilisez `npm run db:studio` pour visualiser/gérer la base de données

---

**Bon développement ! 🚀**

