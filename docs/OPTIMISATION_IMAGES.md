# 🖼️ Guide d'Optimisation des Images

## ⚠️ Problème Identifié

Les images dans `/public` sont très lourdes :
- `img1.jpg` : **12 Mo** ❌
- `img2.jpg` : **5.2 Mo** ❌
- `img3.jpg` : **4.1 Mo** ❌
- `jard1.jpg` : **9.6 Mo** ❌
- `jard2.jpg` : **11 Mo** ❌
- `jard3.jpg` : **3.5 Mo** ❌

**Cible recommandée** : < 200 Ko par image pour le web !

## ✅ Optimisations Déjà Appliquées

### 1. Chargement Intelligent des Images
- ✅ **Lazy loading** : Les images ne se chargent que lorsqu'elles sont visibles
- ✅ **Chargement progressif** : Seule l'image visible + la suivante sont chargées dans les carrousels
- ✅ **Placeholder blur** : Effet de flou pendant le chargement pour une meilleure UX

### 2. Configuration Next.js
- ✅ Formats modernes (AVIF, WebP) selon le navigateur
- ✅ Tailles responsives optimisées
- ✅ Qualité d'image réduite (75-85% au lieu de 100%)

### 3. Attributs d'Image
- ✅ `loading="lazy"` pour les images non critiques
- ✅ `priority` uniquement pour la première image
- ✅ `sizes` optimisés pour le responsive
- ✅ `quality` réduit (75-85%)

## 🚀 Actions Recommandées

### Option 1 : Optimiser les Images Existant (RECOMMANDÉ)

Utilisez un outil en ligne ou en ligne de commande pour compresser les images :

#### Avec Sharp (Node.js)
```bash
npm install -D sharp
```

Puis créez un script `scripts/optimize-images.js` :
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'jard1.jpg', 'jard2.jpg', 'jard3.jpg'];

async function optimizeImage(filename) {
  const inputPath = path.join(publicDir, filename);
  const outputPath = path.join(publicDir, filename.replace('.jpg', '-optimized.jpg'));
  
  await sharp(inputPath)
    .resize(1920, 1080, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .jpeg({ 
      quality: 85,
      progressive: true 
    })
    .toFile(outputPath);
  
  const stats = await Promise.all([
    fs.promises.stat(inputPath),
    fs.promises.stat(outputPath)
  ]);
  
  const reduction = ((1 - stats[1].size / stats[0].size) * 100).toFixed(1);
  console.log(`${filename}: ${(stats[0].size / 1024 / 1024).toFixed(2)} Mo → ${(stats[1].size / 1024 / 1024).toFixed(2)} Mo (${reduction}% réduit)`);
}

async function optimizeAll() {
  for (const image of images) {
    try {
      await optimizeImage(image);
    } catch (error) {
      console.error(`Erreur avec ${image}:`, error.message);
    }
  }
}

optimizeAll();
```

Exécutez avec :
```bash
node scripts/optimize-images.js
```

#### Avec un Outil en Ligne (Plus Simple)

1. **TinyPNG / TinyJPG** : https://tinypng.com
   - Glissez-déposez vos images
   - Téléchargez les versions optimisées
   - Remplacez les fichiers dans `/public`

2. **Squoosh** : https://squoosh.app
   - Outil Google, très performant
   - Contrôle total sur la compression

3. **ImageOptim** (Mac) : https://imageoptim.com/mac
   - Application desktop
   - Optimise automatiquement

### Option 2 : Convertir en WebP

WebP offre une meilleure compression :

```bash
# Installer cwebp (via Homebrew sur Mac)
brew install webp

# Convertir une image
cwebp -q 85 img1.jpg -o img1.webp
```

Puis mettre à jour le code pour utiliser `.webp` au lieu de `.jpg`.

### Option 3 : Utiliser un CDN d'Images

Pour la production, considérez :
- **Cloudinary** : Optimisation automatique
- **ImageKit** : CDN spécialisé images
- **Vercel Image Optimization** : Intégré avec Vercel

## 📏 Tailles Recommandées

| Usage | Largeur | Poids cible |
|-------|---------|-------------|
| Hero carrousel | 1920px | < 200 Ko |
| Carte produit | 800px | < 100 Ko |
| Miniature | 200px | < 20 Ko |
| Logo | 300px | < 50 Ko |

## 🎯 Objectifs de Performance

- **Lighthouse Score** : > 90/100 pour les images
- **LCP (Largest Contentful Paint)** : < 2.5s
- **First Contentful Paint** : < 1.8s

## 📝 Checklist

- [ ] Optimiser toutes les images dans `/public` (< 200 Ko)
- [ ] Tester le chargement des images (DevTools Network)
- [ ] Vérifier le score Lighthouse
- [ ] Configurer un CDN pour la production (optionnel)

---

**Note** : Les optimisations de code sont déjà en place. Il reste principalement à optimiser les fichiers images eux-mêmes.

