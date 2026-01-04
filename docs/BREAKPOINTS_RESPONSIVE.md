# 📱 Breakpoints et Responsivité - eJS MARKET

## 🎯 Breakpoints Tailwind CSS

Le projet utilise les breakpoints standard de Tailwind CSS :

| Breakpoint | Taille | Usage |
|------------|--------|-------|
| `sm` | 640px | Petits mobiles (ajustements mineurs) |
| `md` | 768px | Tablettes portrait |
| **`lg`** | **1024px** | **TRANSITION PRINCIPALE Mobile ↔ Desktop** |
| `xl` | 1280px | Grands écrans desktop |
| `2xl` | 1536px | Très grands écrans |

## 📐 Logique de Responsivité

### Mobile (< 1024px - avant `lg`)

**Comportement :**
- ✅ **Bottom Navigation** : Visible (`lg:hidden`)
- ✅ **MobileHeader** : Visible (`lg:hidden`)
- ✅ **Header Desktop** : Masqué (`hidden lg:block`)
- ✅ **Hero Section** : Masquée (`hidden md:block`)
- ✅ **Grille Produits** : 2 colonnes (`grid-cols-2`)
- ✅ **Filtres** : Modal plein écran (bouton flottant)
- ✅ **Sections Immersives** : Masquées (`hidden md:block`)

**Classes Tailwind utilisées :**
```tsx
// Masquer sur mobile, afficher sur desktop
className="hidden lg:block"

// Afficher sur mobile, masquer sur desktop
className="lg:hidden"

// Grille 2 colonnes mobile, 4 colonnes desktop
className="grid grid-cols-2 lg:grid-cols-4"
```

### Desktop (≥ 1024px - à partir de `lg`)

**Comportement :**
- ✅ **Header Desktop** : Visible (`hidden lg:block`)
- ✅ **MobileHeader** : Masqué (`lg:hidden`)
- ✅ **Bottom Navigation** : Masquée (`lg:hidden`)
- ✅ **Hero Section** : Visible
- ✅ **Grille Produits** : 4 colonnes (`lg:grid-cols-4`)
- ✅ **Filtres** : Barre inline avec dropdowns
- ✅ **Toutes les sections** : Visibles

## 🎨 Exemples d'Utilisation

### Grille Responsive

```tsx
// 2 colonnes mobile, 4 colonnes desktop
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
  {products.map(product => ...)}
</div>
```

### Affichage Conditionnel

```tsx
// Version mobile
<div className="lg:hidden">
  <MobileComponent />
</div>

// Version desktop
<div className="hidden lg:flex">
  <DesktopComponent />
</div>
```

### Espacements Responsifs

```tsx
// Padding réduit sur mobile, normal sur desktop
<div className="px-4 lg:px-12">
  Content
</div>

// Gap réduit sur mobile
<div className="gap-3 lg:gap-4">
  Items
</div>
```

### Tailles de Texte

```tsx
// Texte plus petit sur mobile
<h1 className="text-2xl lg:text-4xl">Titre</h1>
<p className="text-sm lg:text-base">Paragraphe</p>
```

## 📋 Composants et Breakpoints

### MobileBottomNav
- **Visible** : `< lg` (`lg:hidden`)
- **Masqué** : `≥ lg`

### MobileHeader
- **Visible** : `< lg` (`lg:hidden`)
- **Masqué** : `≥ lg`

### Header (Desktop)
- **Visible** : `≥ lg` (`hidden lg:block`)
- **Masqué** : `< lg`

### MobileProductCard
- **Utilisé** : `< lg`
- **Remplacé par** : `Card` desktop `≥ lg`

### MobileFiltersModal
- **Utilisé** : `< lg` (via bouton flottant)
- **Remplacé par** : Barre de filtres inline `≥ lg`

## 🔍 Vérification de Cohérence

### ✅ Points de Vérification

1. **Tous les composants mobile** doivent avoir `lg:hidden`
2. **Tous les composants desktop** doivent avoir `hidden lg:block` ou `hidden lg:flex`
3. **Grilles produits** : `grid-cols-2 lg:grid-cols-4`
4. **Espacements** : Réduits sur mobile (`px-4 lg:px-12`)
5. **Tailles de texte** : Plus petites sur mobile (`text-sm lg:text-base`)

### 🚨 Erreurs Communes à Éviter

❌ **Ne pas utiliser** `md:` comme breakpoint principal
- `md` (768px) est pour les tablettes, pas la transition mobile/desktop

✅ **Utiliser** `lg:` (1024px) comme breakpoint principal
- C'est le point de rupture entre mobile et desktop

❌ **Ne pas mélanger** les logiques
- Mobile: `< lg` (avant 1024px)
- Desktop: `≥ lg` (à partir de 1024px)

## 📊 Tableau de Correspondance

| Écran | Largeur | Breakpoint | Composants |
|-------|---------|------------|------------|
| Mobile petit | 320-639px | `< sm` | MobileHeader, MobileBottomNav |
| Mobile moyen | 640-767px | `sm - md` | MobileHeader, MobileBottomNav |
| Tablette | 768-1023px | `md - lg` | MobileHeader, MobileBottomNav |
| Desktop | 1024-1279px | `lg - xl` | Header, pas de BottomNav |
| Desktop large | 1280-1535px | `xl - 2xl` | Header, pas de BottomNav |
| Desktop très large | ≥ 1536px | `≥ 2xl` | Header, pas de BottomNav |

## 🛠️ Utilisation dans le Code

### Import des Constantes

```typescript
import { BREAKPOINTS, RESPONSIVE_LOGIC } from '@/lib/breakpoints';

// Utilisation
const isMobileWidth = window.innerWidth < BREAKPOINTS.lg;
```

### Classes Tailwind Recommandées

```tsx
// Mobile first (recommandé)
className="text-sm lg:text-base"

// Desktop first (si nécessaire)
className="hidden lg:block"
```

## 📝 Notes Importantes

1. **Mobile First** : Privilégier l'approche mobile-first dans le CSS
2. **Breakpoint principal** : `lg` (1024px) est le point de rupture principal
3. **Cohérence** : Toujours utiliser les mêmes breakpoints pour les mêmes transitions
4. **Test** : Tester sur différentes tailles d'écran (320px à 1920px)


