# EJS-Market

Plateforme E-commerce multi-produits (High-tech + Jardinage) pour le marché européen.

## 🚀 Stack Technique

- **Frontend/Backend** : Next.js 15+ (App Router) + TypeScript
- **Base de données** : PostgreSQL managé (Neon) + Prisma ORM
- **Authentification** : NextAuth.js
- **Paiements** : Stripe
- **Recherche** : Algolia
- **Hébergement** : Vercel

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Générer le client Prisma
npm run db:generate

# Lancer le serveur de développement
npm run dev
```

## 🔧 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Linter le code
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser le schéma vers la DB
- `npm run db:migrate` - Créer une migration
- `npm run db:studio` - Ouvrir Prisma Studio
- `npm run db:seed` - Seed les données initiales

## 📚 Documentation

Toute la documentation du projet est disponible dans le dossier [`docs/`](./docs/) :

- [`docs/README.md`](./docs/README.md) - Vue d'ensemble du projet
- [`docs/CAHIER_DES_CHARGES.md`](./docs/CAHIER_DES_CHARGES.md) - Cahier des charges complet
- [`docs/GUIDE_DEMARRAGE.md`](./docs/GUIDE_DEMARRAGE.md) - Guide de démarrage
- [`docs/FRONTEND_README.md`](./docs/FRONTEND_README.md) - Documentation frontend
- [`docs/DEPLOIEMENT.md`](./docs/DEPLOIEMENT.md) - Guide de déploiement
- [`docs/STACK_VALIDATION.md`](./docs/STACK_VALIDATION.md) - Validation de la stack technique
- [`docs/OPTIMISATION_IMAGES.md`](./docs/OPTIMISATION_IMAGES.md) - Guide d'optimisation des images
- [`docs/GITHUB_PUSH.md`](./docs/GITHUB_PUSH.md) - Instructions GitHub
- [`docs/INSTRUCTIONS_GITHUB.md`](./docs/INSTRUCTIONS_GITHUB.md) - Instructions GitHub supplémentaires
- [`docs/DIAGNOSTIC_CSS.md`](./docs/DIAGNOSTIC_CSS.md) - Diagnostic CSS
- [`docs/ADMIN_PANEL.md`](./docs/ADMIN_PANEL.md) - Documentation Panel Admin (rôles, permissions, fonctionnalités)

## 🔒 Sécurité

- SSL/TLS automatique (Vercel)
- Validation Zod sur tous les inputs
- Protection CSRF/XSS intégrée
- 3D Secure via Stripe (DSP2)
- Backups automatiques (fournisseur PostgreSQL managé)

## 📝 License

Propriétaire - Tous droits réservés

