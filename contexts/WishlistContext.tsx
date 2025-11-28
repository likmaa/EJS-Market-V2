'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface WishlistItem {
  productId: string;
  sku: string;
  name: string;
  priceHT: number;
  vatRate: number;
  image?: string;
  brand?: string;
  addedAt: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearWishlist: () => void;
  isLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'ej-store-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la wishlist depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        try {
          setWishlist(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder la wishlist dans localStorage à chaque changement
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlist.some((item) => item.productId === productId);
  }, [wishlist]);

  const addToWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item.productId)) {
      return; // Déjà dans la wishlist
    }

    const newItem: WishlistItem = {
      ...item,
      addedAt: Date.now(),
    };

    setWishlist((prev) => [...prev, newItem]);
  }, [isInWishlist]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item.productId)) {
      removeFromWishlist(item.productId);
    } else {
      addToWishlist(item);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

