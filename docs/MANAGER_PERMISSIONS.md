# 🔐 Permissions GESTIONNAIRE (Manager) - eJS MARKET

## 📋 Vue d'Ensemble

Le rôle **GESTIONNAIRE (Manager)** permet d'accéder au panel admin avec des permissions limitées par rapport à l'administrateur.

---

## ✅ Permissions Accordées

### 1. Gestion des Produits (CRUD)
- ✅ **Créer** des produits
- ✅ **Lire** tous les produits
- ✅ **Modifier** des produits
- ⚠️ **Supprimer** : Soft delete uniquement (désactivation, pas suppression définitive)
- ✅ Gestion des images produits
- ✅ Gestion des variantes (si implémenté)

**Routes API** :
- `GET /api/admin/products` ✅
- `POST /api/admin/products` ✅
- `PUT /api/admin/products/[id]` ✅
- `DELETE /api/admin/products/[id]` ⚠️ (soft delete)

---

### 2. Gestion des Commandes
- ✅ **Visualiser** toutes les commandes
- ✅ **Modifier les statuts** des commandes (PENDING → PAID → PROCESSING → SHIPPED → DELIVERED)
- ✅ Filtrer et rechercher les commandes
- ❌ **Rembourser** des commandes (ADMIN uniquement)

**Routes API** :
- `GET /api/admin/orders` ✅
- `GET /api/admin/orders/[id]` ✅
- `PUT /api/admin/orders/[id]` ✅ (changement de statut)
- `POST /api/admin/orders/[id]/refund` ❌ (bloqué)

---

### 3. Statistiques de Vente
- ✅ **Revenus** (aujourd'hui, semaine, mois, année)
- ✅ **Nombre de commandes** (aujourd'hui, semaine, mois)
- ✅ **Produits en stock faible**
- ✅ **Commandes en attente**
- ❌ **Top produits** (ADMIN uniquement - données sensibles)
- ❌ **Statistiques utilisateurs** (ADMIN uniquement)

**Routes API** :
- `GET /api/admin/stats` ✅ (données limitées pour MANAGER)

**Données disponibles pour MANAGER** :
```json
{
  "revenue": { "today": 3420, "week": 24500, "month": 125430, "year": 1450000 },
  "orders": { "today": 15, "week": 98, "month": 342 },
  "products": { "total": 150, "lowStock": 5 },
  "pendingOrders": 12
}
```

**Données masquées pour MANAGER** :
- `topProducts` (retourné vide)

---

### 4. Gestion du Stock
- ✅ **Visualiser** le stock de tous les produits
- ✅ **Modifier** les quantités en stock
- ✅ **Alertes** de stock faible
- ✅ **Historique** des mouvements de stock (si implémenté)

**Routes API** :
- Gestion via `/api/admin/products/[id]` (champ `stock`)

---

### 5. Gestion des Catégories
- ✅ **Créer** des catégories
- ✅ **Modifier** des catégories
- ✅ **Supprimer** des catégories (si implémenté)
- ✅ **Réorganiser** les catégories

**Routes API** :
- À implémenter selon les besoins

---

### 6. Gestion du Contenu
- ❌ **Gestion des partenaires** (logos) - ADMIN uniquement
- ❌ **Gestion des témoignages** - ADMIN uniquement
- ❌ **Gestion des images Hero** - ADMIN uniquement
- ❌ **Gestion des images Immersives** - ADMIN uniquement

**Pages bloquées** :
- `/admin/content` ❌ (masquée dans la navigation)

**Routes API** :
- Toutes les routes `/api/admin/content/*` ❌ (bloquées pour MANAGER)

---

## ❌ Permissions Refusées

### 1. Gestion des Utilisateurs
- ❌ **Visualiser** la liste des utilisateurs
- ❌ **Créer** des utilisateurs
- ❌ **Modifier** des utilisateurs
- ❌ **Supprimer** des utilisateurs
- ❌ **Changer les rôles** des utilisateurs

**Pages bloquées** :
- `/admin/users` ❌ (masquée dans la navigation)

**Routes API** :
- `GET /api/admin/users` ❌
- `POST /api/admin/users` ❌
- `PUT /api/admin/users/[id]` ❌
- `DELETE /api/admin/users/[id]` ❌

---

### 2. Configuration du Site
- ❌ **Paramètres généraux** du site
- ❌ **Configuration des paiements**
- ❌ **Configuration de la livraison**
- ❌ **Paramètres de sécurité**

**Pages bloquées** :
- `/admin/settings` ❌ (masquée dans la navigation)

**Routes API** :
- Toutes les routes `/api/admin/settings/*` ❌

---

### 3. Gestion des Remboursements
- ❌ **Effectuer des remboursements**
- ❌ **Voir l'historique des remboursements**

**Routes API** :
- `POST /api/admin/orders/[id]/refund` ❌

**Message d'erreur** :
```json
{
  "error": "Permission refusée. Seuls les administrateurs peuvent effectuer des remboursements."
}
```

---

### 4. Export de Données Sensibles
- ❌ **Export CSV/JSON** des produits
- ❌ **Export CSV/JSON** des commandes
- ❌ **Export CSV/JSON** des utilisateurs

**Routes API** :
- `GET /api/admin/export` ❌

**Message d'erreur** :
```json
{
  "error": "Permission refusée"
}
```

---

### 5. Suppression Définitive
- ❌ **Supprimer définitivement** des produits
- ⚠️ **Soft delete uniquement** (désactivation)

**Comportement** :
- Les MANAGER peuvent désactiver un produit (`isActive: false`)
- Les ADMIN peuvent supprimer définitivement de la base de données

---

## 🔧 Implémentation Technique

### Vérification des Permissions

**Fichier** : `lib/auth.ts`

```typescript
export const adminPermissions = {
  MANAGER: {
    canManageUsers: false,
    canManageProducts: true,
    canManageOrders: true,
    canManageSettings: false,
    canViewAllStats: false,
    canManageStock: true,
    canManageCategories: true,
    canDeleteProducts: false, // Soft delete uniquement
    canRefundOrders: false,
    canExportData: false,
  },
};
```

### Fonctions Utilitaires

**Fichier** : `lib/manager-permissions.ts`

```typescript
// Vérifier si l'utilisateur peut gérer les utilisateurs
canManageUsers(role) // false pour MANAGER

// Vérifier si l'utilisateur peut voir toutes les stats
canViewAllStats(role) // false pour MANAGER

// Vérifier si l'utilisateur peut voir les stats de vente
canViewSalesStats(role) // true pour MANAGER

// Vérifier si l'utilisateur peut rembourser
canRefundOrders(role) // false pour MANAGER
```

### Exemple d'Utilisation dans une Route API

```typescript
import { canAccessAdmin, getUserPermissions } from '@/lib/auth';
import { canRefundOrders } from '@/lib/manager-permissions';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  // Vérifier l'accès admin (ADMIN ou MANAGER)
  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }
  
  // Vérifier la permission spécifique
  if (!canRefundOrders(session.user.role)) {
    return NextResponse.json(
      { error: 'Permission refusée' },
      { status: 403 }
    );
  }
  
  // ... logique métier
}
```

---

## 🎯 Navigation Admin

### Pages Visibles pour MANAGER
- ✅ Dashboard (`/admin`)
- ✅ Produits (`/admin/products`)
- ✅ Commandes (`/admin/orders`)
- ✅ Statistiques (`/admin/stats`) - données limitées
- ✅ Contenu (`/admin/content`)
- ✅ Profil (`/admin/profile`)

### Pages Masquées pour MANAGER
- ❌ Utilisateurs (`/admin/users`) - `adminOnly: true`
- ❌ Paramètres (`/admin/settings`) - `adminOnly: true`

**Fichier** : `app/admin/layout.tsx`

```typescript
const navigation = [
  // ... autres items
  { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon, adminOnly: true },
  { name: 'Paramètres', href: '/admin/settings', icon: SettingsIcon, adminOnly: true },
];

// Filtrage dans le rendu
if (item.adminOnly && user?.role !== 'ADMIN') {
  return null; // Masquer pour MANAGER
}
```

---

## 📊 Tableau Récapitulatif

| Fonctionnalité | ADMIN | MANAGER |
|---------------|-------|---------|
| Gestion produits (CRUD) | ✅ | ✅ |
| Suppression définitive produits | ✅ | ❌ (soft delete) |
| Gestion commandes | ✅ | ✅ |
| Changer statut commande | ✅ | ✅ |
| Rembourser commandes | ✅ | ❌ |
| Statistiques complètes | ✅ | ❌ |
| Statistiques de vente | ✅ | ✅ |
| Gestion stock | ✅ | ✅ |
| Gestion catégories | ✅ | ✅ |
| Gestion contenu | ✅ | ❌ |
| Gestion utilisateurs | ✅ | ❌ |
| Configuration site | ✅ | ❌ |
| Export données | ✅ | ❌ |

---

## 🔒 Sécurité

### Protection des Routes
- Toutes les routes API vérifient `canAccessAdmin` (ADMIN ou MANAGER)
- Les actions sensibles vérifient les permissions spécifiques
- Les pages admin masquent les éléments non autorisés

### Messages d'Erreur
- Messages clairs pour les permissions refusées
- Pas d'exposition d'informations sensibles dans les erreurs

---

## 📝 Notes

- Les permissions sont définies dans `lib/auth.ts`
- Les fonctions utilitaires sont dans `lib/manager-permissions.ts`
- Le layout admin filtre automatiquement les éléments `adminOnly`
- Les routes API doivent vérifier les permissions spécifiques pour les actions sensibles

---

**Dernière mise à jour** : 2024
**Version** : 1.0

