# 📊 Documentation Panel Admin - eJS MARKET

**Version** : 1.0  
**Dernière mise à jour** : 25 Novembre 2024

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Types d'utilisateurs](#types-dutilisateurs)
3. [Structure du Panel Admin](#structure-du-panel-admin)
4. [Fonctionnalités par Rôle](#fonctionnalités-par-rôle)
5. [Routes et Permissions](#routes-et-permissions)
6. [Guide d'utilisation](#guide-dutilisation)

---

## 🎯 Vue d'ensemble

Le Panel Admin est l'interface de gestion complète de la plateforme eJS MARKET. Il permet de gérer les produits, les commandes, les utilisateurs et d'analyser les performances de la boutique.

### Accès

- **URL** : `/admin`
- **Authentification** : Requise (NextAuth.js)
- **Protection** : Middleware de vérification des rôles

---

## 👥 Types d'utilisateurs

Le système distingue **trois types d'utilisateurs** avec des permissions différentes :

### 1. 🔴 **ADMIN** (Administrateur)

**Rôle** : `ADMIN` dans la base de données

**Permissions** :
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Gestion des utilisateurs (création, modification, suppression)
- ✅ Gestion des produits (CRUD complet)
- ✅ Gestion des commandes (toutes les commandes)
- ✅ Gestion des catégories et attributs
- ✅ Configuration du site (paramètres généraux)
- ✅ Accès aux statistiques complètes
- ✅ Gestion des rôles et permissions
- ✅ Export de données
- ✅ Gestion des remboursements

**Cas d'usage** :
- Propriétaire de la plateforme
- Super administrateur technique
- Gestion complète de la boutique

---

### 2. 🟡 **GESTIONNAIRE** (Manager)

**Rôle** : `CUSTOMER` avec permissions spéciales (à implémenter)

**Permissions** :
- ✅ Gestion des produits (CRUD)
- ✅ Gestion des commandes (visualisation et mise à jour des statuts)
- ✅ Accès aux statistiques de vente
- ✅ Gestion du stock
- ✅ Gestion des catégories
- ❌ Gestion des utilisateurs
- ❌ Configuration du site
- ❌ Gestion du contenu (partenaires, témoignages, images)
- ❌ Gestion des remboursements
- ❌ Export de données sensibles

**Cas d'usage** :
- Responsable e-commerce
- Gestionnaire de catalogue
- Responsable des ventes

**Note** : Ce rôle nécessite une implémentation supplémentaire dans le schéma Prisma (ajout d'un champ `isManager` ou création d'un enum `UserRole` avec `MANAGER`).

---

### 3. 🟢 **GROSSISTE** (B2B Customer)

**Rôle** : `B2B_CUSTOMER` dans la base de données

**Permissions** :
- ✅ Accès à un catalogue spécialisé (prix B2B)
- ✅ Passer des commandes en gros
- ✅ Suivre ses commandes
- ✅ Gérer ses adresses de livraison
- ✅ Accès à des tarifs préférentiels
- ✅ Historique des commandes
- ✅ Téléchargement de factures
- ❌ Gestion des produits
- ❌ Gestion des commandes d'autres clients
- ❌ Accès aux statistiques globales

**Cas d'usage** :
- Revendeurs
- Entreprises
- Clients professionnels

**Caractéristiques** :
- Numéro de TVA intracommunautaire requis
- Tarifs dégressifs selon volume
- Conditions de paiement spéciales (30j, 60j)

---

## 🏗️ Structure du Panel Admin

### Layout Principal

```
/app/admin/
├── layout.tsx          # Layout avec sidebar et navigation
├── page.tsx            # Dashboard principal
├── products/
│   ├── page.tsx        # Liste des produits
│   ├── new/
│   │   └── page.tsx    # Créer un produit
│   └── [id]/
│       └── edit/
│           └── page.tsx # Modifier un produit
├── orders/
│   ├── page.tsx        # Liste des commandes
│   └── [id]/
│       └── page.tsx    # Détails d'une commande
└── stats/
    └── page.tsx        # Statistiques détaillées
```

### Navigation

Le panel admin dispose d'une sidebar avec les sections suivantes :

1. **📊 Dashboard** (`/admin`)
   - Vue d'ensemble des statistiques
   - Actions rapides
   - Commandes récentes

2. **📦 Produits** (`/admin/products`)
   - Liste des produits
   - Filtres et recherche
   - Création/Modification/Suppression

3. **🛒 Commandes** (`/admin/orders`)
   - Liste des commandes
   - Filtres par statut
   - Détails et gestion

4. **📈 Statistiques** (`/admin/stats`)
   - Revenus détaillés
   - Top produits
   - Activité récente

---

## 🔐 Fonctionnalités par Rôle

### ADMIN - Fonctionnalités Complètes

#### Dashboard
- ✅ Vue d'ensemble complète
- ✅ Statistiques en temps réel
- ✅ Graphiques de performance
- ✅ Alertes (stock faible, commandes en attente)

#### Gestion des Produits
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Gestion des images (upload, optimisation)
- ✅ Gestion des attributs (JSONB)
- ✅ Gestion du stock
- ✅ Gestion des prix (HT, TVA)
- ✅ Gestion des catégories
- ✅ Import/Export CSV
- ✅ Duplication de produits

#### Gestion des Commandes
- ✅ Visualisation de toutes les commandes
- ✅ Modification des statuts
- ✅ Gestion des remboursements
- ✅ Impression des factures
- ✅ Export des commandes
- ✅ Gestion des expéditions

#### Statistiques
- ✅ Revenus (jour, semaine, mois, année)
- ✅ Top produits
- ✅ Analyse des ventes
- ✅ Rapports personnalisés
- ✅ Export de données

#### Gestion des Utilisateurs
- ✅ Liste des utilisateurs
- ✅ Création/Modification/Suppression
- ✅ Gestion des rôles
- ✅ Historique des actions

---

### GESTIONNAIRE - Fonctionnalités Limitées

#### Dashboard
- ✅ Vue d'ensemble (statistiques de vente uniquement)
- ✅ Commandes en attente
- ✅ Alertes stock

#### Gestion des Produits
- ✅ CRUD complet
- ✅ Gestion du stock
- ✅ Gestion des prix
- ❌ Suppression définitive (soft delete uniquement)
- ❌ Import/Export (lecture seule)

#### Gestion des Commandes
- ✅ Visualisation des commandes
- ✅ Modification des statuts (sauf remboursement)
- ✅ Impression des factures
- ❌ Gestion des remboursements
- ❌ Export de données sensibles

#### Statistiques
- ✅ Statistiques de vente
- ✅ Top produits
- ❌ Données financières complètes
- ❌ Rapports personnalisés

---

### GROSSISTE (B2B) - Espace Client Pro

#### Dashboard B2B
- ✅ Vue d'ensemble des commandes
- ✅ Statistiques personnelles
- ✅ Catalogue avec prix B2B

#### Catalogue Produits
- ✅ Visualisation avec prix dégressifs
- ✅ Filtres avancés
- ✅ Favoris produits
- ✅ Comparaison de produits

#### Commandes
- ✅ Passer des commandes en gros
- ✅ Suivi des commandes
- ✅ Historique complet
- ✅ Téléchargement de factures
- ✅ Gestion des adresses

#### Profil B2B
- ✅ Informations entreprise
- ✅ Numéro de TVA
- ✅ Conditions de paiement
- ✅ Historique des remises

---

## 🛣️ Routes et Permissions

### Routes Admin (ADMIN uniquement)

```
/admin                    → Dashboard
/admin/products           → Liste produits
/admin/products/new       → Créer produit
/admin/products/[id]/edit → Modifier produit
/admin/orders             → Liste commandes
/admin/orders/[id]        → Détails commande
/admin/stats              → Statistiques
/admin/users              → Gestion utilisateurs (ADMIN uniquement)
/admin/settings           → Configuration (ADMIN uniquement)
```

### Routes Gestionnaire

```
/admin                    → Dashboard (limité)
/admin/products           → Liste produits
/admin/products/new       → Créer produit
/admin/products/[id]/edit → Modifier produit
/admin/orders             → Liste commandes
/admin/orders/[id]        → Détails commande
/admin/stats              → Statistiques (limitées)
```

### Routes Grossiste (B2B)

```
/b2b                      → Dashboard B2B
/b2b/catalog              → Catalogue produits
/b2b/orders               → Mes commandes
/b2b/orders/[id]          → Détails commande
/b2b/profile              → Profil entreprise
/b2b/invoices             → Factures
```

---

## 📖 Guide d'utilisation

### Pour les Administrateurs

#### Accéder au Panel Admin

1. Se connecter avec un compte ADMIN
2. Accéder à `/admin`
3. Le système vérifie automatiquement les permissions

#### Gérer les Produits

1. Aller dans **Produits** → **Liste**
2. Utiliser les filtres pour trouver un produit
3. Cliquer sur **Modifier** pour éditer
4. Cliquer sur **Ajouter un produit** pour créer

#### Gérer les Commandes

1. Aller dans **Commandes** → **Liste**
2. Filtrer par statut si nécessaire
3. Cliquer sur une commande pour voir les détails
4. Modifier le statut selon l'avancement

#### Consulter les Statistiques

1. Aller dans **Statistiques**
2. Consulter les revenus par période
3. Voir les top produits
4. Analyser l'activité récente

### Pour les Gestionnaires

Le processus est similaire à l'admin, mais certaines fonctionnalités sont limitées :
- Pas d'accès à la gestion des utilisateurs
- Pas de suppression définitive de produits
- Pas de gestion des remboursements

### Pour les Grossistes

#### Accéder à l'Espace B2B

1. Se connecter avec un compte B2B_CUSTOMER
2. Accéder à `/b2b`
3. Consulter le catalogue avec prix B2B

#### Passer une Commande

1. Parcourir le catalogue B2B
2. Ajouter des produits au panier
3. Vérifier les prix dégressifs
4. Passer la commande

---

## 🔒 Sécurité et Permissions

### Vérification des Rôles

```typescript
// Middleware de vérification (à implémenter)
export function requireRole(role: UserRole) {
  // Vérifier le rôle de l'utilisateur connecté
  // Rediriger si non autorisé
}
```

### Protection des Routes

Toutes les routes `/admin/*` doivent être protégées :
- Vérification de l'authentification
- Vérification du rôle
- Redirection si non autorisé

### Audit Log

Toutes les actions importantes doivent être loggées :
- Création/Modification/Suppression de produits
- Changements de statut de commande
- Modifications de prix
- Actions sur les utilisateurs

---

## 🚀 Prochaines Étapes

### À Implémenter

1. **Authentification et Protection**
   - [ ] Middleware de vérification des rôles
   - [ ] Protection des routes admin
   - [ ] Gestion des sessions

2. **API Routes**
   - [ ] `/api/admin/products` - CRUD produits
   - [ ] `/api/admin/orders` - Gestion commandes
   - [ ] `/api/admin/stats` - Statistiques
   - [ ] `/api/admin/users` - Gestion utilisateurs

3. **Fonctionnalités Manquantes**
   - [ ] Page de gestion des utilisateurs
   - [ ] Page de configuration
   - [ ] Graphiques pour les statistiques
   - [ ] Export de données
   - [ ] Upload d'images
   - [ ] Gestion des catégories

4. **Espace B2B**
   - [ ] Dashboard B2B (`/b2b`)
   - [ ] Catalogue avec prix B2B
   - [ ] Gestion des commandes B2B
   - [ ] Profil entreprise

5. **Rôle Gestionnaire**
   - [ ] Ajouter `MANAGER` au schéma Prisma
   - [ ] Implémenter les permissions
   - [ ] Créer les pages spécifiques

---

## 📝 Notes Techniques

### Schéma Prisma

Le schéma actuel définit :
```prisma
enum UserRole {
  ADMIN
  CUSTOMER
  B2B_CUSTOMER
}
```

**Recommandation** : Ajouter `MANAGER` à l'enum pour le rôle Gestionnaire.

### Structure des Données

Les produits utilisent JSONB pour les attributs dynamiques :
```typescript
attributes: Json? // { processor: "A17 Pro", ram: "8Go", ... }
```

Les commandes stockent les adresses au moment de la commande :
```typescript
shippingAddress: Json // Adresse complète au moment de la commande
```

---

## 📞 Support

Pour toute question sur le Panel Admin :
- Consulter cette documentation
- Vérifier les logs d'erreur
- Contacter l'équipe technique

---

**Version** : 1.0  
**Dernière mise à jour** : 25 Novembre 2024

