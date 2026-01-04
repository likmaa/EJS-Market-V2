# Gestion du Contenu Dynamique

## Vue d'ensemble

Le système de gestion de contenu permet de modifier dynamiquement plusieurs sections du site depuis l'interface d'administration :

1. **Partenaires** - Logos des marques partenaires
2. **Témoignages** - Avis clients
3. **Images Hero** - Images de la grille hero (2 cartes : Tech et Jardin)
4. **Images Immersives** - Images de la section immersive 3D

## Modèles de données

### Partner
- `name`: Nom de la marque
- `logoPath`: Chemin vers le logo local
- `cdnUrl`: URL CDN de fallback (optionnel)
- `width` / `height`: Dimensions du logo
- `alt`: Texte alternatif
- `order`: Ordre d'affichage
- `isActive`: Actif/Inactif

### Testimonial
- `name`: Nom du client
- `initial`: Initiales (2 lettres)
- `rating`: Note de 1 à 5
- `text`: JSON multilingue `{ fr: "...", en: "..." }`
- `product`: Nom du produit concerné
- `date`: Date relative (ex: "Il y a 2 semaines")
- `order`: Ordre d'affichage
- `isActive`: Actif/Inactif

### HeroImage
- `type`: "tech" ou "garden"
- `name`: Nom du produit
- `imageUrl`: URL de l'image
- `price`: Prix en centimes (optionnel)
- `productId`: ID du produit associé (optionnel)
- `available`: Disponible en stock
- `order`: Ordre d'affichage
- `isActive`: Actif/Inactif

### ImmersiveImage
- `name`: Nom du produit
- `imageUrl`: URL de l'image
- `productId`: ID du produit associé (optionnel)
- `order`: Ordre d'affichage
- `isActive`: Actif/Inactif

## API Routes

### Admin (protégées)
- `GET /api/admin/content/partners` - Liste des partenaires
- `POST /api/admin/content/partners` - Créer un partenaire
- `GET /api/admin/content/partners/[id]` - Détails d'un partenaire
- `PUT /api/admin/content/partners/[id]` - Modifier un partenaire
- `DELETE /api/admin/content/partners/[id]` - Supprimer un partenaire

Même structure pour `testimonials`, `hero-images`, et `immersive-images`.

### Publiques
- `GET /api/content/partners` - Liste publique (actifs uniquement)
- `GET /api/content/testimonials` - Liste publique (actifs uniquement)
- `GET /api/content/hero-images?type=tech` - Images hero publiques
- `GET /api/content/immersive-images` - Images immersives publiques

## Pages Admin

- `/admin/content` - Page principale avec navigation
- `/admin/content/partners` - Gestion des partenaires
- `/admin/content/testimonials` - Gestion des témoignages
- `/admin/content/hero` - Gestion des images hero
- `/admin/content/immersive` - Gestion des images immersives

## Migration des composants frontend

Pour utiliser les données dynamiques dans les composants frontend :

### 1. Partenaires (`components/PartnerLogos.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Partner {
  id: string;
  name: string;
  logoPath: string;
  cdnUrl: string | null;
  width: number | null;
  height: number | null;
  alt: string;
}

export function PartnerLogos() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch('/api/content/partners')
      .then(res => res.json())
      .then(data => setPartners(data.partners || []))
      .catch(err => console.error('Erreur:', err));
  }, []);

  return (
    <>
      {partners.map((partner) => (
        <div key={partner.id} className="mx-12 flex items-center justify-center h-16">
          <div className="relative opacity-40 hover:opacity-70 transition-opacity duration-300">
            <Image
              src={partner.logoPath || partner.cdnUrl || ''}
              alt={partner.alt}
              width={partner.width || 120}
              height={partner.height || 40}
              className="h-12 w-auto object-contain filter grayscale"
              style={{ filter: 'grayscale(100%) opacity(0.6)' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<div class="text-4xl font-bold text-black-deep opacity-40">${partner.name}</div>`;
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
```

### 2. Témoignages (`app/page.tsx`)

Remplacer le tableau statique `testimonials` par :

```typescript
const [testimonials, setTestimonials] = useState([]);

useEffect(() => {
  fetch('/api/content/testimonials')
    .then(res => res.json())
    .then(data => setTestimonials(data.testimonials || []))
    .catch(err => console.error('Erreur:', err));
}, []);
```

### 3. Images Hero (`app/page.tsx`)

Remplacer les tableaux statiques `techImages` et `jardinImages` par :

```typescript
const [techImages, setTechImages] = useState([]);
const [jardinImages, setJardinImages] = useState([]);

useEffect(() => {
  Promise.all([
    fetch('/api/content/hero-images?type=tech').then(res => res.json()),
    fetch('/api/content/hero-images?type=garden').then(res => res.json()),
  ])
    .then(([techData, jardinData]) => {
      setTechImages(techData.images || []);
      setJardinImages(jardinData.images || []);
    })
    .catch(err => console.error('Erreur:', err));
}, []);
```

### 4. Images Immersives (`app/page.tsx`)

Remplacer le tableau statique `immersiveImages` par :

```typescript
const [immersiveImages, setImmersiveImages] = useState([]);

useEffect(() => {
  fetch('/api/content/immersive-images')
    .then(res => res.json())
    .then(data => setImmersiveImages(data.images || []))
    .catch(err => console.error('Erreur:', err));
}, []);
```

## Migration de la base de données

Après avoir ajouté les nouveaux modèles au schéma Prisma, exécuter :

```bash
npx prisma migrate dev --name add_content_models
```

Cela créera les tables nécessaires dans la base de données.

## Notes importantes

1. Les données statiques actuelles continueront de fonctionner jusqu'à ce que les composants soient migrés
2. Les API publiques ne retournent que les éléments avec `isActive: true`
3. L'ordre d'affichage est déterminé par le champ `order` puis par `createdAt`
4. Les images uploadées sont stockées dans `/public/uploads/products/` (réutilise l'API d'upload des produits)

