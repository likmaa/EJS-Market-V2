'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ComparisonItem {
  productId: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  image?: string;
  brand?: string;
  attributes?: Record<string, string | number>;
  category?: string;
}

interface ComparisonContextType {
  comparison: ComparisonItem[];
  isInComparison: (productId: string) => boolean;
  addToComparison: (item: ComparisonItem) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  canAddMore: boolean;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const COMPARISON_STORAGE_KEY = 'ej-store-comparison';
const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparison, setComparison] = useState<ComparisonItem[]>([]);

  // Charger la comparaison depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setComparison(parsed.slice(0, MAX_COMPARISON_ITEMS)); // Limiter au max
        } catch (error) {
          console.error('Error loading comparison from localStorage:', error);
        }
      }
    }
  }, []);

  // Sauvegarder la comparaison dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparison));
    }
  }, [comparison]);

  const isInComparison = useCallback((productId: string): boolean => {
    return comparison.some((item) => item.productId === productId);
  }, [comparison]);

  const addToComparison = useCallback((item: ComparisonItem) => {
    if (isInComparison(item.productId)) {
      return; // Déjà dans la comparaison
    }

    if (comparison.length >= MAX_COMPARISON_ITEMS) {
      // Remplacer le premier élément si on atteint la limite
      setComparison((prev) => [...prev.slice(1), item]);
    } else {
      setComparison((prev) => [...prev, item]);
    }
  }, [comparison.length, isInComparison]);

  const removeFromComparison = useCallback((productId: string) => {
    setComparison((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparison([]);
  }, []);

  return (
    <ComparisonContext.Provider
      value={{
        comparison,
        isInComparison,
        addToComparison,
        removeFromComparison,
        clearComparison,
        canAddMore: comparison.length < MAX_COMPARISON_ITEMS,
        maxItems: MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}

