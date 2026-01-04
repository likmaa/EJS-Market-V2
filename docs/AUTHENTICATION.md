# Documentation d'Authentification

Ce document décrit le système d'authentification implémenté avec NextAuth.js.

## Configuration

### Variables d'environnement requises

Créez un fichier `.env.local` avec les variables suivantes :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ejs_market?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Pour générer un `NEXTAUTH_SECRET` sécurisé :

```bash
openssl rand -base64 32
```

### Configuration initiale

1. **Créer/Migrer la base de données** :
   ```bash
   npm run db:push
   ```

2. **Créer l'utilisateur admin** :
   ```bash
   npm run db:seed
   ```
   - Email : `admin@ejsmarket.com`
   - Mot de passe : `Admin123!`
   - ⚠️ Changez ce mot de passe après la première connexion !

3. **Tester l'authentification** :
   - Démarrer : `npm run dev`
   - Se connecter : `http://localhost:3000/login`
   - Accéder à l'admin : `http://localhost:3000/admin`

## Architecture

### NextAuth.js Configuration

L'authentification est configurée dans `app/api/auth/[...nextauth]/route.ts` :

- **Provider** : Credentials (email/password)
- **Adapter** : Prisma Adapter pour la persistance
- **Session Strategy** : JWT (JSON Web Tokens)
- **Callbacks** : 
  - `jwt` : Ajoute le rôle utilisateur au token
  - `session` : Ajoute le rôle et l'ID utilisateur à la session

### Rôles utilisateurs

Le système supporte 4 rôles définis dans `prisma/schema.prisma` :

- **ADMIN** : Accès complet au panel admin
- **MANAGER** : Accès limité au panel admin (pas de suppression définitive, pas de gestion des utilisateurs)
- **CUSTOMER** : Client standard
- **B2B_CUSTOMER** : Client professionnel avec accès à l'espace B2B

### Permissions

Les permissions sont définies dans `lib/auth.ts` :

```typescript
// Exemple d'utilisation
const { permissions } = useAuth();
if (permissions.canManageProducts) {
  // Afficher le bouton de modification
}
```

## Pages d'authentification

### Connexion (`/login`)

- Formulaire de connexion avec email et mot de passe
- Redirection vers la page d'origine après connexion (`callbackUrl`)
- Lien vers la page d'inscription
- Lien vers la récupération de mot de passe (à implémenter)

### Inscription (`/register`)

- Formulaire d'inscription standard
- Support pour l'inscription B2B (`/register?type=b2b`)
- Validation côté client et serveur
- Vérification de l'unicité de l'email

## Routes API

### `/api/auth/register` (POST)

Crée un nouveau compte utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "vatNumber": "FR12345678901", // Optionnel, requis pour B2B
  "role": "CUSTOMER" // ou "B2B_CUSTOMER"
}
```

**Réponse :**
```json
{
  "message": "Compte créé avec succès",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

### Routes Admin (`/api/admin/*`)

Toutes les routes admin nécessitent une authentification et un rôle approprié :

- `/api/admin/products` - Gestion des produits
- `/api/admin/orders` - Gestion des commandes
- `/api/admin/stats` - Statistiques

## Middleware

Le middleware (`middleware.ts`) protège automatiquement :

- Routes `/admin/*` : Accessibles uniquement par ADMIN et MANAGER
- Routes `/b2b/*` : Accessibles uniquement par B2B_CUSTOMER

Les utilisateurs non authentifiés sont redirigés vers `/login` avec un paramètre `callbackUrl`.

## Utilisation dans les composants

### Hook `useAuth`

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, permissions } = useAuth();

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  if (isAdmin) {
    return <div>Contenu admin</div>;
  }

  return <div>Contenu utilisateur</div>;
}
```

### Côté serveur

```typescript
import { getSession } from '@/lib/get-session';

export default async function ServerComponent() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <div>Contenu protégé</div>;
}
```

## Sécurité

### Hashage des mots de passe

Les mots de passe sont hashés avec `bcryptjs` (12 rounds) avant stockage.

### Validation

- Email : Validation avec Zod
- Mot de passe : Minimum 8 caractères
- Numéro de TVA : Requis pour les comptes B2B

### Protection CSRF

NextAuth.js gère automatiquement la protection CSRF.

## Prochaines étapes

- [ ] Implémenter la récupération de mot de passe
- [ ] Ajouter la vérification d'email
- [ ] Implémenter l'authentification OAuth (Google, Facebook)
- [ ] Ajouter la gestion des sessions actives
- [ ] Implémenter le refresh token

