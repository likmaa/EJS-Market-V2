// Constantes pour l'application

// Codes pays supportés
export const SUPPORTED_COUNTRIES = ['FR', 'ES', 'DE', 'IT', 'BE', 'NL', 'PT'] as const;

// Taux TVA par pays (par défaut, à synchroniser avec la DB)
export const DEFAULT_VAT_RATES: Record<string, number> = {
  FR: 0.20,  // 20%
  ES: 0.21,  // 21%
  DE: 0.19,  // 19%
  IT: 0.22,  // 22%
  BE: 0.21,  // 21%
  NL: 0.21,  // 21%
  PT: 0.23,  // 23%
};

// Catégories de produits
export const PRODUCT_CATEGORIES = [
  'electronics',
  'garden',
  'photo',
  'mobility',
  'tools',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Statuts de commande
export const ORDER_STATUSES = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
] as const;

// Rôles utilisateurs
export const USER_ROLES = ['ADMIN', 'MANAGER', 'CUSTOMER', 'B2B_CUSTOMER'] as const;

// Limites pour le calcul des frais de port
export const SHIPPING_LIMITS = {
  MAX_WEIGHT_STANDARD: 30, // kg
  MAX_DIMENSION_STANDARD: 100, // cm
} as const;

// Langues supportées
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'de', 'it'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Devise par défaut
export const DEFAULT_CURRENCY = 'EUR';

