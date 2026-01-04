# 📁 Structure des Fichiers - eJS MARKET

## 📂 Organisation du Projet

```
E-com/
├── app/                          # Pages Next.js (App Router)
│   ├── layout.tsx               # Layout principal avec providers
│   ├── page.tsx                 # Page d'accueil
│   ├── globals.css              # Styles globaux
│   ├── about/                   # Page À propos
│   ├── be-pro/                  # Page Grossistes
│   ├── cart/                    # Page Panier
│   ├── contact/                 # Page Contact
│   ├── help/                    # Centre d'aide
│   ├── products/                # Pages produits
│   │   ├── page.tsx            # Liste des produits
│   │   └── [id]/               # Détail produit
│   ├── tracking/                # Suivi de commande
│   ├── offline/                 # Page hors ligne (PWA)
│   └── [autres pages légales]   # Privacy, Terms, etc.
│
├── components/                   # Composants React
│   ├── mobile/                  # Composants spécifiques mobile
│   │   ├── index.ts            # Exports centralisés
│   │   ├── MobileBottomNav.tsx # Navigation en bas
│   │   ├── MobileHeader.tsx    # Header simplifié mobile
│   │   ├── MobileSearchBar.tsx # Barre de recherche mobile
│   │   ├── MobileProductCard.tsx # Card produit mobile
│   │   ├── MobileFiltersModal.tsx # Modal de filtres
│   │   ├── MobileFiltersButton.tsx # Bouton filtres flottant
│   │   └── PullToRefresh.tsx   # Pull to refresh
│   │
│   ├── ui/                      # Composants UI de base
│   │   ├── Button.tsx          # Bouton avec micro-interactions
│   │   ├── Card.tsx             # Carte générique
│   │   └── Badge.tsx            # Badge
│   │
│   ├── Header.tsx               # Header desktop
│   ├── Footer.tsx               # Footer
│   ├── MegaMenu.tsx             # Menu déroulant
│   ├── ProductCard.tsx          # Card produit desktop
│   ├── ProductDetailModal.tsx   # Modal détail produit
│   ├── QuickViewModal.tsx       # Aperçu rapide
│   ├── Toast.tsx                # Notification toast
│   ├── CookieConsentModal.tsx   # Modal cookies
│   ├── ErrorBoundary.tsx        # Gestion d'erreurs
│   ├── ServiceWorkerRegistration.tsx # PWA
│   └── [autres composants]
│
├── contexts/                    # Contextes React
│   └── CartContext.tsx          # Gestion globale du panier
│
├── hooks/                       # Hooks personnalisés
│   └── useCart.ts               # Hook panier (déprécié, utiliser CartContext)
│
├── lib/                         # Utilitaires
│   ├── utils.ts                 # Fonctions utilitaires
│   ├── mockProducts.ts          # Données mockées produits
│   └── errorHandler.ts          # Gestion d'erreurs centralisée
│
├── public/                      # Assets statiques
│   ├── manifest.json            # Manifest PWA
│   ├── sw.js                    # Service Worker
│   ├── logos/                   # Logos partenaires
│   ├── payment-logos/           # Logos moyens de paiement
│   └── [images et autres assets]
│
├── docs/                        # Documentation
│   ├── PLAN_RESPONSIVE_MOBILE.md
│   ├── OPTIMISATIONS_PERFORMANCE.md
│   ├── STRUCTURE_FICHIERS.md
│   └── [autres docs]
│
├── scripts/                     # Scripts utilitaires
│   └── download-logos.js       # Téléchargement logos
│
├── next.config.js               # Configuration Next.js
├── tailwind.config.ts           # Configuration Tailwind
├── tsconfig.json                # Configuration TypeScript
└── package.json                 # Dépendances
```

## 🎯 Composants Mobile

Tous les composants spécifiques au mobile sont regroupés dans `components/mobile/` :

### Navigation
- **MobileBottomNav** : Barre de navigation fixe en bas
- **MobileHeader** : Header simplifié avec logo et recherche

### Recherche & Filtres
- **MobileSearchBar** : Modal de recherche avec suggestions et historique
- **MobileFiltersModal** : Modal plein écran pour les filtres
- **MobileFiltersButton** : Bouton flottant pour ouvrir les filtres

### Produits
- **MobileProductCard** : Card produit optimisée pour mobile (2 colonnes)

### Interactions
- **PullToRefresh** : Pull to refresh pour rafraîchir les listes

## 📦 Imports Recommandés

### Composants Mobile
```typescript
// Import individuel
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';

// Import depuis l'index (recommandé)
import { MobileBottomNav, MobileHeader } from '@/components/mobile';
```

### Composants UI
```typescript
import { Button, Card, Badge } from '@/components/ui/Button';
```

### Contextes
```typescript
import { useCart } from '@/contexts/CartContext';
```

## 🔄 Code Splitting

Les composants mobile sont chargés dynamiquement pour optimiser les performances :

```typescript
// Dans app/layout.tsx
const MobileHeader = dynamic(() => import("@/components/mobile/MobileHeader").then(mod => ({ default: mod.MobileHeader })), {
  ssr: false,
});
```

## 📱 Responsive Breakpoints

- **Mobile** : < 1024px (lg)
- **Desktop** : ≥ 1024px (lg)

Les composants mobile sont masqués sur desktop avec `lg:hidden` et les composants desktop sont masqués sur mobile avec `hidden lg:flex`.

## 🎨 Conventions de Nommage

- **Composants** : PascalCase (`MobileProductCard.tsx`)
- **Fichiers utilitaires** : camelCase (`mockProducts.ts`)
- **Hooks** : camelCase avec préfixe `use` (`useCart.ts`)
- **Contextes** : PascalCase avec suffixe `Context` (`CartContext.tsx`)

## 📝 Notes Importantes

1. **Composants Mobile** : Toujours vérifier que les zones tactiles font minimum 44x44px
2. **Code Splitting** : Utiliser `dynamic` pour les composants lourds
3. **Images** : Toujours utiliser `next/image` avec `loading="lazy"` sauf pour les images critiques
4. **Accessibilité** : Ajouter `aria-label` sur tous les boutons icon-only


