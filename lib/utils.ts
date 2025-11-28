import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Note: clsx et tailwind-merge seront installés avec npm install

// Utilitaire pour fusionner les classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Conversion prix (centimes <-> euros)
export function centsToEuros(cents: number): number {
  return cents / 100;
}

export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

// Formatage prix
export function formatPrice(cents: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// Calcul TVA
export function calculateVAT(priceHT: number, vatRate: number): number {
  return Math.round(priceHT * vatRate);
}

export function calculateTTC(priceHT: number, vatRate: number): number {
  return priceHT + calculateVAT(priceHT, vatRate);
}

// Validation numéro TVA intracommunautaire (format basique)
export function isValidVATFormat(vatNumber: string): boolean {
  // Format: 2 lettres (pays) + 2-12 caractères alphanumériques
  const vatRegex = /^[A-Z]{2}[A-Z0-9]{2,12}$/;
  return vatRegex.test(vatNumber.toUpperCase());
}

// Extraction code pays depuis numéro TVA
export function extractCountryFromVAT(vatNumber: string): string | null {
  const match = vatNumber.match(/^([A-Z]{2})/);
  return match ? match[1] : null;
}

