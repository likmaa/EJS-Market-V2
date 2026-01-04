# 📋 Cahier des Charges Technique - Electrónica & Jardín Store Europe

**Version** : 2.0 (Validée après recherche approfondie)  
**Date** : 2024  
**Priorités** : Sécurité ⚠️ > Performance 🚀 > Scalabilité 📈

---

## 🎯 Vue d'ensemble du projet

**Objectif** : Plateforme E-commerce multi-produits (High-tech + Jardinage) pour le marché européen

**Complexités principales** :
- Gestion de produits très hétérogènes (iPhone vs Tondeuse robot)
- Multi-langues (FR, EN, ES, DE, IT)
- Gestion fiscale UE (TVA variable selon pays)
- Logistique complexe (poids/dimensions variables)
- **Conformité réglementaire stricte** (RGPD, DSP2, PCI DSS)

---

## 🏗️ STACK TECHNIQUE VALIDÉE (Après recherche approfondie)

### ✅ **DÉCISION FINALE : Stack Moderne, Sécurisée & Performante**

> **Note importante** : Cette stack a été validée après recherche des meilleures pratiques 2024 pour la sécurité et les performances e-commerce en Europe.

---

### 🎨 **FRONTEND**

#### **Framework : Next.js 15+ (App Router) avec TypeScript**

**Pourquoi Next.js ?**
- ✅ **SEO natif** : SSR/SSG intégré (essentiel pour le référencement)
- ✅ **Performance** : Image optimization automatique (WebP/AVIF)
- ✅ **Sécurité** : Protection CSRF intégrée, sanitization automatique
- ✅ **Multi-langues** : Support i18n natif (next-intl)
- ✅ **Type-safety** : TypeScript end-to-end
- ✅ **API Routes** : Backend intégré (pas besoin de serveur séparé)
- ✅ **Écosystème** : Plus grande communauté que Nuxt.js

**Version recommandée** : Next.js 15+ (App Router)
- Meilleures performances que Pages Router
- Server Components par défaut
- Streaming SSR

**Bibliothèques complémentaires** :
- `next-intl` : Internationalisation
- `zod` : Validation de schémas (sécurité)
- `react-hook-form` : Formulaires performants
- `@tanstack/react-query` : Gestion d'état serveur

---

### ⚙️ **BACKEND**

#### **Option 1 (RECOMMANDÉE) : Next.js API Routes + Prisma ORM**

**Avantages** :
- ✅ **Tout-en-un** : Frontend + Backend dans un seul projet
- ✅ **Type-safety** : Prisma génère les types TypeScript automatiquement
- ✅ **Déploiement simplifié** : Un seul déploiement sur Vercel
- ✅ **Sécurité** : Middleware Next.js pour auth/rate limiting
- ✅ **Coût** : Gratuit au début (Vercel Hobby)

**Architecture** :
```
/app
  /api          → Routes API (Backend)
  /(routes)     → Pages Frontend
/prisma
  schema.prisma → Modèles de données
```

#### **Option 2 (Si besoin de microservices) : NestJS**

**Quand l'utiliser** :
- Besoin de microservices séparés
- Équipe backend dédiée
- Scalabilité très élevée requise

**Avantages** :
- ✅ Architecture modulaire (modules, controllers, services)
- ✅ Décorateurs TypeScript
- ✅ Support GraphQL natif
- ✅ Scalabilité avancée

---

### 🗄️ **BASE DE DONNÉES**

#### **PostgreSQL managé (Neon recommandé, Supabase possible)**

**Pourquoi PostgreSQL et pas MongoDB ?**

**PostgreSQL** ✅ (CHOIX RECOMMANDÉ) :
- ✅ **Transactions ACID** : Essentielles pour les paiements (atomicité garantie)
- ✅ **Sécurité** : Contrôle d'accès granulaire, chiffrement au repos
- ✅ **JSONB** : Support natif pour attributs produits dynamiques
- ✅ **Conformité** : Meilleure conformité PCI DSS (transactions financières)
- ✅ **Fiabilité** : Moins de risques de corruption de données
- ✅ **Performance** : Excellent pour requêtes complexes (jointures, agrégations)

**MongoDB** ❌ (Non recommandé pour ce projet) :
- ❌ Pas de transactions ACID fiables (risque pour paiements)
- ❌ Moins sécurisé pour données financières
- ❌ Requêtes complexes plus difficiles

**Hébergeur recommandé : Neon (PostgreSQL managé)**
- ✅ PostgreSQL 15+ (dernière version)
- ✅ Interface admin incluse (gratuite)
- ✅ Auth intégrée (si besoin)
- ✅ Backups automatiques
- ✅ SSL/TLS inclus
- ✅ Plan gratuit : 500MB DB + 2GB bande passante
- ✅ Conformité : SOC 2 Type II, ISO 27001

**Alternatives** : Supabase, Railway
- ✅ PostgreSQL 15+
- ✅ Déploiement simple
- ✅ Plan gratuit : 5$ crédit/mois

---

### 📦 **CMS / GESTION PRODUITS**

#### **Option 1 (RECOMMANDÉE) : Payload CMS**

**Pourquoi Payload CMS ?**
- ✅ **Spécialisé e-commerce** : Built-in pour e-commerce
- ✅ **TypeScript natif** : Type-safety complet
- ✅ **Self-hosted** : Contrôle total des données
- ✅ **Flexible** : Custom fields, relations complexes
- ✅ **Sécurité** : Auth intégrée, permissions granulaires
- ✅ **Gratuit** : Open-source (MIT)

**Alternative : Strapi**
- ✅ Plus mature, plus de plugins
- ❌ Plus lourd, moins optimisé e-commerce

**Option 2 : Interface Admin Custom (Prisma Studio + React Admin)**
- ✅ Contrôle total
- ✅ Pas de dépendance externe
- ❌ Plus de développement

---

### 🔍 **RECHERCHE**

#### **Algolia (RECOMMANDÉ pour début)**

**Pourquoi Algolia ?**
- ✅ **Setup rapide** : 30 minutes d'intégration
- ✅ **Facettes instantanées** : Filtres en temps réel
- ✅ **Tolérance fautes** : Typo-tolerance intégrée
- ✅ **Synonymes** : Gestion native
- ✅ **Plan gratuit** : 10k requêtes/mois
- ✅ **Performance** : < 50ms de latence

**Alternative : ElasticSearch**
- ✅ Plus puissant, plus flexible
- ❌ Plus complexe à setup/maintenir
- ❌ Nécessite serveur dédié (coût)

---

### 💳 **PAIEMENTS**

#### **Moyens de Paiement Disponibles**

EJS Market propose **deux moyens de paiement** :

1. **💳 Carte de crédit/débit** - Paiement sécurisé en ligne
2. **🏦 Virement bancaire** - Paiement par transfert bancaire

#### **Paiement par Carte de Crédit**

**Caractéristiques** :
- ✅ **DSP2/SCA natif** : 3D Secure 2.0 intégré automatiquement (via processeur de paiement)
- ✅ **Conformité PCI DSS** : Level 1 (le plus élevé)
- ✅ **Sécurisé** : Aucune donnée de carte stockée localement
- ✅ **Rapide** : Validation instantanée
- ✅ **International** : Accepte les cartes de tous les pays
- ✅ **Méthodes de paiement** : CB, Bancontact, iDEAL, Sofort, Giropay
- ✅ **Frais** : 1.4% + 0.25€ (Europe)
- ✅ **Support** : Excellent (chat, email)
- ✅ **Test mode** : Environnement de test complet

**Processus** :
1. Le client sélectionne "Paiement par carte" au checkout
2. Redirection vers la page de paiement sécurisée
3. Saisie des informations de carte
4. Validation 3D Secure si requis
5. Confirmation de la commande

#### **Paiement par Virement Bancaire**

**Caractéristiques** :
- ✅ **Sécurisé** : Pas de frais de transaction
- ✅ **Idéal pour les gros montants** : Pas de limite de montant
- ✅ **Confiance** : Méthode traditionnelle appréciée
- ⏱️ **Délai** : Validation manuelle par l'équipe (1-3 jours ouvrés)

**Processus** :
1. Le client sélectionne "Virement bancaire" au checkout
2. La commande est créée avec le statut **"En attente de paiement"**
3. Le client reçoit un email avec les coordonnées bancaires
4. Le client effectue le virement depuis sa banque
5. L'équipe EJS Market vérifie la réception du paiement
6. La commande passe au statut **"Payée"** et est traitée

**Implémentation** :
```typescript
// Processus de paiement :
- Carte : Intégration processeur de paiement (conformité PCI DSS)
- Virement : Validation manuelle via panel admin
- Emails automatiques pour chaque étape
- Traçabilité complète des transactions
```

**Pourquoi PayPal ?**
- ✅ Popularité en Europe (Allemagne, UK)
- ✅ Alternative pour clients sans CB
- ✅ Intégration simple (SDK)

---

### ☁️ **HÉBERGEMENT & INFRASTRUCTURE**

#### **Frontend/Backend : Vercel (RECOMMANDÉ)**

**Pourquoi Vercel ?**
- ✅ **Déploiement automatique** : Git push = déploiement
- ✅ **CDN global** : 100+ edge locations (latence < 50ms)
- ✅ **SSL/TLS gratuit** : Certificats automatiques (Let's Encrypt)
- ✅ **DDoS protection** : Intégrée
- ✅ **Analytics** : Vercel Analytics inclus
- ✅ **Image Optimization** : CDN images intégré
- ✅ **Plan gratuit** : 100GB bande passante/mois
- ✅ **Conformité** : SOC 2 Type II, ISO 27001
- ✅ **Edge Functions** : Serverless functions à la périphérie

**Alternative : AWS (si besoin de plus de contrôle)**
- ✅ Plus de flexibilité
- ❌ Plus complexe à configurer
- ❌ Coût plus élevé

#### **Base de données : Supabase (RECOMMANDÉ)**

**Voir section Base de Données ci-dessus**

#### **CDN Images : Vercel Image Optimization (INTÉGRÉ)**

**Pourquoi pas Cloudflare séparément ?**
- ✅ Vercel inclut déjà un CDN images optimisé
- ✅ Conversion WebP/AVIF automatique
- ✅ Lazy loading intégré
- ✅ Pas besoin de service supplémentaire

**Si besoin de Cloudflare** :
- Protection DDoS avancée
- WAF (Web Application Firewall)
- Rate limiting avancé

---

### 📧 **AUTRES SERVICES**

#### **Email : Resend (RECOMMANDÉ)**

**Pourquoi Resend ?**
- ✅ **Moderne** : API React-based
- ✅ **Performance** : Délivrabilité excellente
- ✅ **Gratuit** : 3000 emails/mois
- ✅ **Templates** : React Email intégré
- ✅ **Analytics** : Open rates, clicks

**Alternative : SendGrid**
- ✅ Plus mature
- ❌ API moins moderne

#### **Traduction : DeepL API (Si budget)**

**Pourquoi DeepL ?**
- ✅ Meilleure qualité que Google Translate
- ✅ Support contextuel
- ✅ API simple

**Alternative gratuite** : Google Translate API (qualité moindre)

#### **Analytics : Google Analytics 4 + Vercel Analytics**

- **GA4** : Tracking e-commerce complet
- **Vercel Analytics** : Performance monitoring

---

## 🔒 SÉCURITÉ (PRIORITÉ ABSOLUE)

### ✅ **Mesures de Sécurité Implémentées**

#### **1. Chiffrement & Communication**

- ✅ **SSL/TLS 1.3** : Automatique avec Vercel (Let's Encrypt)
- ✅ **HSTS** : Headers de sécurité stricts
- ✅ **CSP** : Content Security Policy (prévention XSS)
- ✅ **Chiffrement au repos** : Base de données (Supabase)

#### **2. Authentification & Autorisation**

- ✅ **NextAuth.js** (Auth.js) : Authentification sécurisée
  - JWT avec rotation de tokens
  - Sessions sécurisées (httpOnly cookies)
  - OAuth (Google, GitHub si besoin)
- ✅ **MFA (2FA)** : Authentification à deux facteurs pour admins
- ✅ **Rate limiting** : Protection contre brute force
  - `@upstash/ratelimit` (Redis-based)
- ✅ **RBAC** : Role-Based Access Control (Admin, User, Guest)

#### **3. Protection des Données**

- ✅ **Validation stricte** : Zod pour tous les inputs
- ✅ **Sanitization** : `dompurify` pour contenu HTML
- ✅ **CSRF Protection** : Next.js intégré
- ✅ **XSS Protection** : React escape automatique + CSP
- ✅ **SQL Injection** : Prisma (parametrized queries)
- ✅ **Chiffrement données sensibles** : 
  - Mots de passe : bcrypt (salt rounds: 12)
  - Tokens : Chiffrement AES-256

#### **4. Conformité Paiements (DSP2 / PCI DSS)**

- ✅ **Paiement par carte** : Conformité PCI DSS Level 1 (via processeur de paiement)
- ✅ **3D Secure 2.0** : SCA automatique pour les paiements carte
- ✅ **Tokenisation** : Aucune donnée CB stockée localement
- ✅ **Virement bancaire** : Validation manuelle sécurisée par l'équipe admin
- ✅ **Logs audit** : Toutes transactions loggées (sans données sensibles)

#### **5. Infrastructure & Monitoring**

- ✅ **Backups automatiques** : 
  - Supabase : Quotidien (rétention 7 jours)
  - Extension : 30 jours (plan payant)
- ✅ **Monitoring** : 
  - Vercel Analytics (performance)
  - Sentry (erreurs)
- ✅ **WAF** : Web Application Firewall (optionnel Cloudflare)
- ✅ **DDoS Protection** : Vercel intégré

#### **6. Conformité Réglementaire**

- ✅ **RGPD** : 
  - Consentement cookies
  - Droit à l'oubli
  - Export données utilisateur
- ✅ **DSP2** : SCA pour paiements > 30€ (géré automatiquement pour les cartes)
- ✅ **PCI DSS** : Conformité via processeur de paiement (pas de stockage CB)

### 📋 **Checklist Sécurité**

- [ ] SSL/TLS activé (automatique Vercel)
- [ ] Headers de sécurité configurés (CSP, HSTS, X-Frame-Options)
- [ ] Validation Zod sur toutes les API routes
- [ ] Rate limiting sur endpoints sensibles
- [ ] Authentification 2FA pour admins
- [ ] Backups automatiques configurés
- [ ] Logs d'audit pour transactions
- [ ] Tests de sécurité (OWASP Top 10)
- [ ] Scan de vulnérabilités (npm audit, Snyk)

---

## 🚀 PERFORMANCE

### ✅ **Optimisations Implémentées**

#### **1. Images**

- ✅ **Next.js Image** : Optimisation automatique
  - Format WebP/AVIF selon navigateur
  - Lazy loading automatique
  - Responsive images (srcset)
  - Réduction poids : ~70%

#### **2. Code**

- ✅ **Code Splitting** : Automatique (Next.js)
- ✅ **Tree Shaking** : Suppression code inutilisé
- ✅ **Server Components** : Moins de JS côté client
- ✅ **Streaming SSR** : Rendu progressif

#### **3. Réseau**

- ✅ **CDN** : Vercel Edge Network (100+ locations)
- ✅ **HTTP/2** : Multiplexing
- ✅ **Compression** : Gzip/Brotli automatique

#### **4. Base de Données**

- ✅ **Indexes** : Sur colonnes fréquemment requêtées
- ✅ **Connection Pooling** : Prisma intégré
- ✅ **Query Optimization** : Prisma query engine

### 📊 **Objectifs Performance**

- **Lighthouse Mobile** : > 90/100
- **First Contentful Paint (FCP)** : < 1.8s
- **Largest Contentful Paint (LCP)** : < 2.5s
- **Time to Interactive (TTI)** : < 3.8s
- **Cumulative Layout Shift (CLS)** : < 0.1

---

## 📊 ARCHITECTURE DES DONNÉES

### Structure Produit (Modèle Hybride)

```typescript
// Champs communs (tous produits) - Table PostgreSQL
interface ProductBase {
  id: string;                    // UUID
  sku: string;                   // Unique, indexé
  name: Record<string, string>;  // { fr: "iPhone 15", en: "iPhone 15", es: "..." }
  priceHT: number;               // En centimes (précision)
  defaultVATRate: number;        // 0.20 pour 20%
  weight: number;                // kg (pour calcul shipping)
  dimensions: {                  // cm
    length: number;
    width: number;
    height: number;
  };
  stock: number;                 // Quantité disponible
  brand: string;                 // Indexé pour recherche
  category: string;             // "electronics", "garden", "photo", etc.
  images: string[];             // URLs (CDN)
  isActive: boolean;            // Produit visible ou non
  createdAt: Date;
  updatedAt: Date;
}

// Attributs spécifiques (JSONB dynamique dans PostgreSQL)
interface ProductAttributes {
  // Set A: Informatique
  processor?: string;      // "M2", "Intel i7"
  ram?: string;            // "16Go", "32Go"
  storage?: string;        // "1TB SSD"
  screenSize?: string;      // "16 pouces"
  os?: string;             // "iOS", "Windows 11"
  
  // Set B: Photo/Vidéo
  sensor?: string;         // "Plein format", "APS-C"
  resolution?: string;     // "33 MP", "4K"
  lensMount?: string;      // "Sony E", "Canon RF"
  
  // Set C: Mobilité
  autonomy?: number;       // km
  maxSpeed?: number;       // km/h
  maxWeight?: number;      // kg
  motorPower?: number;     // W
  
  // Set D: Jardin
  mowingArea?: number;     // m²
  maxSlope?: number;       // %
  connectivity?: string[]; // ["Wi-Fi", "GPS", "Bluetooth"]
  noiseLevel?: number;     // dB
  
  // Set E: Outils
  material?: string;       // "Acier inoxydable"
  telescopic?: boolean;   // Oui/Non
}
```

### Tables Principales (Schéma Prisma)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    // bcrypt
  role          UserRole  @default(CUSTOMER)
  isEmailVerified Boolean @default(false)
  vatNumber     String?   // Pour B2B
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Product {
  id          String   @id @default(uuid())
  sku         String   @unique @index
  name        Json     // { fr: "...", en: "..." }
  priceHT     Int      // En centimes
  defaultVATRate Float
  weight      Float
  dimensions  Json     // { length, width, height }
  stock       Int
  brand       String   @index
  category    String   @index
  images      String[] // URLs
  attributes  Json?    // ProductAttributes (JSONB)
  isActive    Boolean  @default(true)
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Order {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  status        OrderStatus @default(PENDING)
  totalHT       Int
  totalTTC      Int
  vatAmount     Int
  shippingCost  Int
  shippingAddress Json      // Adresse complète
  paymentMethod   String     // "card" ou "bank_transfer"
  paymentIntentId String?   // ID du processeur de paiement (si carte)
  items         OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  priceHT   Int     // Prix au moment de la commande
  vatRate   Float
  createdAt DateTime @default(now())
}

model TaxRate {
  id        String  @id @default(uuid())
  countryCode String @unique // "FR", "ES", "DE"
  rate      Float   // 0.20 pour 20%
  isActive  Boolean @default(true)
}

enum UserRole {
  ADMIN
  CUSTOMER
  B2B_CUSTOMER
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

---

## 🔧 FONCTIONNALITÉS CRITIQUES

### 1. Gestion Géographique & Fiscale

**Algorithme de calcul TVA** :
```
1. Détecter pays visiteur
   - Via IP (API: ipapi.co ou Cloudflare headers)
   - Ou sélection manuelle utilisateur
   
2. Vérifier type client (B2B ou B2C)
   - Si B2B (vatNumber fourni) :
     a. Appel API VIES (Commission Européenne)
     b. Si TVA valide + pays différent du vendeur → TVA 0% (Autoliquidation)
     c. Sinon → TVA locale du pays
   - Si B2C :
     → TVA locale du pays de livraison
   
3. Calculer prix TTC
   - TTC = HT × (1 + tauxTVA)
   
4. Afficher prix avec devise locale
```

**Table TVA (Base de données)** :
| Pays | Code | TVA Standard | TVA Réduite |
|------|------|--------------|-------------|
| France | FR | 20% | 5.5%, 10% |
| Espagne | ES | 21% | 10%, 4% |
| Allemagne | DE | 19% | 7% |
| Italie | IT | 22% | 10%, 5%, 4% |
| Belgique | BE | 21% | 12%, 6% |
| Pays-Bas | NL | 21% | 9% |

**API VIES** :
- Endpoint : `https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl`
- Vérification en temps réel du numéro TVA intracommunautaire

### 2. Calcul des Frais de Port

**Règles de calcul** :
```
SI (poids_total > 30kg) OU (dimension_max > 100cm) ALORS
  Transporteur = "Transporteur Spécial"
  Coût = Calcul via API SendCloud/Shippo (selon pays, poids, dimensions)
SINON
  Transporteur = "Standard" (DHL, UPS, DPD)
  Coût = Tarif fixe par zone ou calcul API
FIN SI
```

**Intégration API** :
- **SendCloud** : Support DHL, UPS, DPD, GLS, GLS
- **Shippo** : Alternative, support plus large

**Zones de livraison** :
- Zone 1 (FR, BE, NL, DE) : 5-10€
- Zone 2 (ES, IT, PT) : 10-15€
- Zone 3 (Autres UE) : 15-25€
- Hors UE : Sur devis

### 3. Recherche & Filtres

**Fonctionnalités Algolia** :
- Recherche full-text avec typo-tolerance
- Filtres à facettes instantanés (RAM, Stockage, Prix, Marque, etc.)
- Synonymes configurables (ex: "Tondeuse robot" = "Robot de tonte")
- Tri dynamique (Prix croissant/décroissant, Popularité, Nouveautés)
- Highlighting des résultats
- Analytics intégré (recherches populaires, sans résultats)

---

## 🔌 INTÉGRATIONS API REQUISES

| Service | Usage | Documentation | Sécurité |
|---------|-------|---------------|----------|
| **Processeur de paiement** | Paiements CB + 3D Secure | Documentation du processeur | ✅ PCI DSS Level 1 |
| **Virement bancaire** | Paiement par transfert | Validation manuelle | ✅ Sécurisé |
| **VIES (EU)** | Vérification TVA intracommunautaire | https://ec.europa.eu/taxation_customs/vies/ | ✅ API officielle UE |
| **SendCloud/Shippo** | Génération étiquettes transport | API REST | ✅ HTTPS uniquement |
| **DeepL API** | Traduction produits | https://www.deepl.com/docs-api | ✅ API Key |
| **Resend** | Emails transactionnels | https://resend.com/docs | ✅ API Key |
| **Algolia** | Recherche avancée | https://www.algolia.com/doc/ | ✅ API Key + Search Key |
| **ipapi.co** | Détection pays (IP) | https://ipapi.co/api/ | ✅ Rate limited |

---

## 📦 PLAN DE DÉVELOPPEMENT (Phases)

### Phase 1 : MVP & Sécurité (2-3 mois)
- [x] Setup Next.js 15 + TypeScript + Prisma
- [x] Configuration base PostgreSQL managée (Neon)
- [x] Structure DB (Users, Products, Orders, TaxRates)
- [x] Authentification (NextAuth.js, rôles ADMIN / MANAGER / CLIENT)
- [ ] 2FA admins
- [x] Catalogue produits (CRUD avec validation Zod + panel admin)
- [x] Panier + page Checkout basique
- [ ] Intégration paiement par carte (processeur de paiement avec 3D Secure)
- [ ] Système de validation manuelle pour virements bancaires
- [ ] Gestion TVA simple (FR uniquement)
- [x] Headers de sécurité (HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Rate limiting (API routes)
- [x] Backups automatiques (fournisseur DB)

### Phase 2 : Internationalisation (1 mois)
- [ ] Multi-langues (next-intl) : FR, EN, ES, DE, IT
- [ ] Détection pays (IP + sélection manuelle)
- [ ] TVA par pays (table TaxRate)
- [ ] Vérification VIES (B2B)
- [ ] Multi-devises (EUR, GBP, etc.)
- [ ] Traduction produits (DeepL API si budget)

### Phase 3 : Logistique (1 mois)
- [ ] Calcul frais de port dynamique
- [ ] Intégration SendCloud/Shippo
- [ ] Gestion stocks avancée (alertes, réservations)
- [ ] Suivi commandes (webhooks transporteurs)
- [ ] Génération étiquettes automatique

### Phase 4 : Recherche & UX (1 mois)
- [ ] Intégration Algolia
- [ ] Indexation produits (sync automatique)
- [ ] Filtres avancés (facettes)
- [x] Optimisation UX admin (dashboard, commandes, produits)
- [ ] Optimisation performance (Lighthouse > 90)
- [ ] PWA (Progressive Web App)

### Phase 5 : Marketing & Analytics (1 mois)
- [ ] Emails transactionnels (Resend)
- [ ] Google Analytics 4 (e-commerce tracking)
- [ ] Vercel Analytics
- [ ] SEO avancé (sitemap, robots.txt, meta tags)
- [ ] A/B testing (optionnel)

---

## 💰 ESTIMATION COÛTS MENSUELS

### Début (MVP - 0-1000 commandes/mois)

| Service | Coût | Limites |
|---------|------|---------|
| **Vercel** (Hosting) | Gratuit | 100GB bande passante/mois |
| **PostgreSQL managé** (Neon/Supabase) | Gratuit / faible coût | ~500MB DB, quelques Go bande passante |
| **Algolia** | Gratuit | 10k requêtes/mois |
| **Paiement par carte** | Frais selon processeur (~1.4% + 0.25€/transaction) | Frais par transaction |
| **Virement bancaire** | Gratuit | Aucun frais |
| **Resend** | Gratuit | 3000 emails/mois |
| **Cloudflare** (optionnel) | Gratuit | Protection DDoS basique |
| **TOTAL** | **~0€/mois** | + Frais processeur de paiement par transaction (si carte) |

### Scale (1000-10000 commandes/mois)

| Service | Coût | Limites |
|---------|------|---------|
| **Vercel Pro** | ~20€/mois | 1TB bande passante |
| **PostgreSQL managé Pro** | ~25–40€/mois | 8GB+ DB, 50GB+ bande passante |
| **Algolia** | ~50€/mois | 100k requêtes/mois |
| **Paiement par carte** | Frais selon processeur (~1.4% + 0.25€/transaction) | Frais par transaction |
| **Virement bancaire** | Gratuit | Aucun frais |
| **Resend** | ~20€/mois | 50k emails/mois |
| **Cloudflare Pro** (optionnel) | ~20€/mois | WAF, DDoS avancé |
| **Sentry** (monitoring) | Gratuit | 5k events/mois |
| **TOTAL** | **~135€/mois** | + Frais processeur de paiement par transaction (si carte) |

---

## 🚀 PROCHAINES ÉTAPES (État au 2025-11)

### ✅ Ce qui est déjà fait (résumé)

- Socle technique : **Next.js 15 + TypeScript + Prisma** en place  
- Base PostgreSQL managée (**Neon**) configurée  
- Schéma Prisma complet : `users`, `products`, `orders`, `tax_rates`, etc.  
- Authentification NextAuth avec rôles **ADMIN / MANAGER / CUSTOMER / B2B_CUSTOMER**  
- Panel admin opérationnel :
  - Dashboard (KPIs, graphique, diagramme statuts, commandes récentes)
  - Gestion des produits (liste avancée + édition + médias)
  - Gestion des commandes (liste + détail + remboursement "métier")
- Sécurité backend : middleware d’accès, headers de sécurité, validations Zod

### ⏭️ Priorités court terme

1. **Compléter la Phase 1 (MVP & Sécurité)**
   - Intégration **paiement par carte** (processeur de paiement avec remboursement)
   - Système de **validation manuelle des virements bancaires**
   - Gestion **TVA FR** simple (utiliser `tax_rates`)  
   - Mise en place du **rate limiting** sur les routes sensibles (`auth`, `admin/*`)  
   - Durcir la **checklist sécurité** (tests OWASP, npm audit dans CI)

2. **Phase 2 – Internationalisation**
   - Activer pleinement **next-intl** sur le front (FR par défaut, EN en second)  
   - Préparer la structure pour autres langues (ES, DE, IT)  
   - Démarrer la gestion TVA par pays via `tax_rates`

3. **Phase 3 – Logistique**
   - Calcul de frais de port dynamiques (poids + zone)  
   - Brancher un prestataire shipping (SendCloud/Shippo) pour les étiquettes  
   - Affinement de la gestion de stock (alertes, réservations)

4. **Phase 4 – Recherche & UX**
   - Intégration **Algolia** (index produits, facettes, auto-complétion)  
   - PWA complète (manifest, offline, stratégie cache affinée)

5. **Phase 5 – Marketing & Analytics**
   - Emails transactionnels (Resend) pour commandes, reset password, etc.  
   - Activation **GA4** + **Vercel Analytics**  
   - SEO avancé (sitemap, robots.txt, métas, OpenGraph)  
   - A/B testing simple sur landing / pages clé (optionnel)

---

## 📝 JUSTIFICATIONS TECHNIQUES

### **Pourquoi Next.js plutôt que Nuxt.js ?**
- Écosystème plus large (plus de packages, plus de ressources)
- Meilleure intégration avec Vercel (créé par la même équipe)
- TypeScript natif (pas besoin de configuration)
- Server Components (meilleures performances)
- Plus grande communauté (plus facile de trouver de l'aide)

### **Pourquoi Prisma plutôt que TypeORM ou Drizzle ?**
- **Meilleure DX** : Migrations automatiques, introspection DB
- **Type-safety supérieur** : Types générés automatiquement
- **Performance** : Query engine optimisé
- **Documentation** : Excellente, nombreux exemples
- **Écosystème** : Prisma Studio (admin UI), Prisma Client

### **Pourquoi PostgreSQL plutôt que MongoDB ?**
- **Transactions ACID** : Essentielles pour paiements (atomicité)
- **Sécurité** : Meilleure conformité PCI DSS
- **JSONB** : Support natif pour attributs dynamiques (meilleur des deux mondes)
- **Fiabilité** : Moins de risques de corruption
- **Performance** : Excellent pour requêtes complexes (jointures)

### **Moyens de Paiement**

**Paiement par carte** :
- **DSP2/SCA natif** : 3D Secure 2.0 géré automatiquement par le processeur
- **Conformité PCI DSS** : Level 1 (via processeur de paiement)
- **Sécurité** : Aucune donnée de carte stockée localement

**Virement bancaire** :
- **Sécurisé** : Validation manuelle par l'équipe admin
- **Sans frais** : Aucun frais de transaction
- **Idéal pour gros montants** : Pas de limite

### **Pourquoi Supabase plutôt que Railway ou PlanetScale ?**
- **Interface admin** : Prisma Studio + Supabase Dashboard
- **Auth intégrée** : Si besoin plus tard (pas obligatoire)
- **Backups** : Automatiques, gratuits
- **Conformité** : SOC 2, ISO 27001
- **Plan gratuit** : Plus généreux (500MB vs 5$ crédit)

### **Pourquoi Vercel plutôt qu'AWS directement ?**
- **Simplicité** : Déploiement en 1 clic (Git push)
- **CDN intégré** : 100+ edge locations automatiques
- **SSL automatique** : Certificats Let's Encrypt
- **Analytics** : Intégré (performance monitoring)
- **Coût** : Gratuit au début (vs AWS qui facture tout)

---

## ⚠️ RISQUES & MITIGATION

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Piratage données** | Critique | Faible | Chiffrement, auth 2FA, audits sécurité |
| **Panne serveur** | Élevé | Faible | Vercel (99.99% uptime), backups |
| **Perte données** | Critique | Très faible | Backups quotidiens, rétention 30j |
| **Non-conformité DSP2** | Élevé | Faible | Processeur de paiement gère automatiquement (cartes) |
| **Performance dégradée** | Moyen | Moyen | Monitoring, CDN, optimisation continue |

---

## 📚 RESSOURCES & DOCUMENTATION

- **Next.js** : https://nextjs.org/docs
- **Prisma** : https://www.prisma.io/docs
- **Paiements** : Voir [`PAIEMENTS.md`](./PAIEMENTS.md) - Documentation complète des moyens de paiement
- **Supabase** : https://supabase.com/docs
- **Algolia** : https://www.algolia.com/doc/
- **NextAuth.js** : https://next-auth.js.org/
- **Zod** : https://zod.dev/

---

**Document validé le** : [Date à compléter]  
**Prochaine révision** : Après Phase 1 (MVP)
